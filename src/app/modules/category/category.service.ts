import { prisma } from "../../../lib/prisma";

const createCategoryInDB = async (payload: {
  name: string;
  description: string;
  slug: string;
}) => {
  // check duplicate category
  const isCategoryExist = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { equals: payload.name, mode: "insensitive" } },
        { slug: { equals: payload.slug, mode: "insensitive" } },
      ],
    },
  });

  if (isCategoryExist) {
    throw new Error("Category with this name or slug already exists!");
  }

  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

export const CategoryService = { createCategoryInDB };
