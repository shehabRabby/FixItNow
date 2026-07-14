import { prisma } from "../../../lib/prisma";

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      technicianProfile: true,
    },
  });

  if (!result) {
    throw new Error("User profile not found!");
  }
  const profileData = result as Record<string, any>;
  delete profileData.password;

  return profileData;
};

const updateMyProfileInDB = async (userId: string, payload: Partial<any>) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  const { skills, experienceYears, bio, availabilitySlots, ...userData } =
    payload;

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    if (
      user.role === "TECHNICIAN" &&
      (skills || experienceYears || bio || availabilitySlots)
    ) {
      await tx.technicianProfile.update({
        where: { userId: userId },
        data: {
          skills,
          experienceYears: experienceYears
            ? Number(experienceYears)
            : undefined,
          bio,
          availabilitySlots,
        },
      });
    }

    return await tx.user.findUnique({
      where: { id: userId },
      include: {
        technicianProfile: true,
      },
    });
  });

  const updatedData = result as Record<string, any>;
  delete updatedData.password;
  return updatedData;
};



const getDashboardOverviewFromDB = async (userId: string, role: string) => {
  if (role === "CUSTOMER") {
    const totalBookings = await prisma.booking.count({
      where: { customerId: userId },
    });

    const pendingPayments = await prisma.booking.count({
      where: { customerId: userId, status: "ACCEPTED" }, 
    });

    const completedJobs = await prisma.booking.count({
      where: { customerId: userId, status: "COMPLETED" },
    });

    return {
      role,
      totalBookings,
      pendingPayments,
      completedJobs,
    };
  }

  if (role === "TECHNICIAN") {
    // technician total jobs assigned, completed jobs, total earning, average rating
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId },
    });

    if (!technicianProfile) {
      throw new Error("Technician profile not found!");
    }

    const totalJobsAssigned = await prisma.booking.count({
      where: { service: { technicianProfileId: technicianProfile.id } },
    });

    const completedJobs = await prisma.booking.count({
      where: { 
        service: { technicianProfileId: technicianProfile.id },
        status: "COMPLETED"
      },
    });

    // only compeleted job count
    const totalEarningAgg = await prisma.payment.aggregate({
      where: {
        booking: { service: { technicianProfileId: technicianProfile.id } },
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    return {
      role,
      ratingAverage: technicianProfile.ratingAverage,
      totalJobsAssigned,
      completedJobs,
      totalEarning: totalEarningAgg._sum.amount || 0,
    };
  }

  if (role === "ADMIN") {
    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    const totalTechnicians = await prisma.user.count({ where: { role: "TECHNICIAN" } });
    const totalServices = await prisma.service.count();
    
    const totalRevenueAgg = await prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    return {
      role,
      totalCustomers,
      totalTechnicians,
      totalServices,
      totalRevenue: totalRevenueAgg._sum.amount || 0,
    };
  }

  throw new Error("Invalid user role!");
};


export const ProfileService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
  getDashboardOverviewFromDB,
};
