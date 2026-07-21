# 🔧 FixItNow - Backend API

> **"Your Trusted Home Service Platform"**  
> A robust, scalable, and secure RESTful backend API for a multi-vendor home service marketplace built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

---

## 📌 Live Demo & Resources

* **Live API Base URL:** `https://fix-it-now-backend-steel.vercel.app/`
* **API Version:** `v1` (`/api/v1/`)
* **GitHub Repository:** [shehabRabby/FixItNow](https://github.com/shehabRabby/FixItNow)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [User Roles & Permissions](#-user-roles--permissions)
- [Database Schema Architecture](#-database-schema-architecture)
- [System Flow Diagrams](#-system-flow-diagrams)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Environment Setup](#-environment-setup)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Deployment Guide](#-deployment-guide)

---

## 🚀 Overview

**FixItNow** is a complete backend solution powering a digital home service ecosystem. It enables customers to find local home repair services (plumbing, electrical, cleaning, painting, etc.), book verified technicians, make secure payments via Stripe, and leave post-service reviews. Technicians can manage service offerings, time availability, and incoming booking requests, while Admins oversee platform governance, user moderation, and category management.

---

## 💻 Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Runtime Environment** | Node.js (v20+) |
| **Programming Language** | TypeScript |
| **Web Framework** | Express.js (v5) |
| **ORM / Database Tool** | Prisma (v7) with PostgreSQL Adapter |
| **Database** | PostgreSQL |
| **Authentication & Security** | JWT (JSON Web Tokens), Bcrypt.js, Cookie-Parser |
| **Validation & Error Handling** | Zod Schema Validation, Global Error Handler Middleware |
| **Payment Gateways** | Stripe API Integration |
| **Bundler & Build Tool** | `tsup`, `tsx` |
| **Deployment Platform** | Vercel (Serverless Edge Functions) |

---

## ✨ Key Features

### 🌐 Public Features
* Browse available home services and registered technicians with dynamic search and filtering (by service category, rating, price, and location).
* View technician profiles with skill sets, past jobs, and authentic customer reviews.

### 👤 Customer Features
* Secure Registration and Authentication (JWT based with cookie storage).
* Book technicians for targeted services and specific time slots.
* Integrated Online Payments via Stripe for accepted bookings.
* Access transaction history and booking status timeline.
* Submit verified service ratings and reviews upon job completion.
* Profile customization and account management.

### 🛠️ Technician Features
* Custom profile creation detailing skills, hourly/job pricing, and experience.
* Real-time slot management for time availability.
* Booking Request Pipeline: Accept or Decline incoming service requests.
* Job Lifecycle Management: Update status from `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`.

### 🛡️ Admin Features
* Comprehensive User Governance: Ban/Unban or moderate accounts (Customers & Technicians).
* System-wide Booking Overview: Track and audit all platform bookings.
* Dynamic Category Management: Create, edit, and organize service categories.

---

## 🔐 User Roles & Permissions

FixItNow uses **Role-Based Access Control (RBAC)** to restrict sensitive endpoints based on user roles:

| Role | Access Level & Key Permissions |
| :--- | :--- |
| **`CUSTOMER`** | Can browse services, create bookings, process payments, write reviews, and track own bookings. |
| **`TECHNICIAN`** | Can build service profiles, set working schedules, accept/decline customer bookings, and mark job progress. |
| **`ADMIN`** | Full access. Can manage all users, ban accounts, oversee all platform transactions, and configure categories. |

---

## 🗄️ Database Schema Architecture

The database is built on PostgreSQL using **Prisma ORM**. Key tables and relationships include:

1. **`Users`**: Holds base user credentials, role (`CUSTOMER`, `TECHNICIAN`, `ADMIN`), status (`ACTIVE`, `BANNED`), and authentication info.
2. **`TechnicianProfiles`**: Linked 1-to-1 with `Users` for technician bio, experience, location, and hourly rate.
3. **`Categories`**: Stores service domains (e.g., Plumbing, Electrical, House Cleaning).
4. **`Services`**: Specific repair/service offerings created under service categories.
5. **`Bookings`**: Tracks customer-technician service contracts, scheduled time, and status (`REQUESTED`, `ACCEPTED`, `DECLINED`, `PAID`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
6. **`Payments`**: Records financial transactions linked to bookings (Transaction ID, Amount, Payment Method, Payment Status).
7. **`Reviews`**: Customer ratings (1-5 stars) and feedback attached to completed bookings.

---

## 🔄 System Flow Diagrams

### 🔧 1. Customer Journey

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Register   │ ───► │    Browse    │ ───► │ View Tech    │
│  / Login     │      │   Services   │      │   Profile    │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   │
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Leave Review │ ◄─── │ Track Job /  │ ◄─── │ Make Payment │
│ & Rating     │      │ Completion   │      │   (Stripe)   │
└──────────────┘      └──────────────┘      └──────────────┘

🛠️ 2. Technician JourneyPlaintext
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Register as │ ───► │ Create Tech  │ ───► │ Set Time     │
│  Technician  │      │   Profile    │      │ Availability │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   │
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Mark Job     │ ◄─── │ Update Job   │ ◄─── │  Accept /    │
│ Completed    │      │ IN_PROGRESS  │      │ Decline Book │
└──────────────┘      └──────────────┘      └──────────────┘

📊 3. Booking State LifecyclePlaintext      
                    ┌──────────────┐
                    │  REQUESTED   │
                    └──────────────┘
                     /            \
         (technician)              (technician)
           accepts                   declines
             /                          \
            ▼                            ▼
    ┌──────────────┐             ┌──────────────┐
    │   ACCEPTED   │             │   DECLINED   │
    └──────────────┘             └──────────────┘
           │
           ▼
    ┌──────────────┐
    │     PAID     │  (via Stripe Payment)
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │ IN_PROGRESS  │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │  COMPLETED   │
    └──────────────┘

💡 Note: Customers can cancel a booking at any point before it reaches IN_PROGRESS status.

## 📡API Endpoints Reference

All API routes are prefixed with /api/v1.


### 🔑 Authentication (/api/v1/auth)
MethodEndpointAccessDescriptionPOST/api/v1/auth/registerPublicRegister new user (CUSTOMER or TECHNICIAN)POST/api/v1/auth/loginPublicAuthenticate user and issue JWT cookiesGET/api/v1/auth/meAuthenticatedFetch current logged-in user profile👤 Profile Management (/api/v1/profile)MethodEndpointAccessDescriptionGET/api/v1/profileAuthenticatedGet current user's profile detailsPATCH/api/v1/profileAuthenticatedUpdate user profile information🔨 Services & Categories (/api/v1/services, /api/v1/categories)MethodEndpointAccessDescriptionGET/api/v1/servicesPublicFetch all services with filtering & searchGET/api/v1/services/:idPublicGet detailed information of a specific servicePOST/api/v1/servicesADMIN, TECHNICIANCreate a new serviceGET/api/v1/categoriesPublicList all home service categories

### 🧰 Technician Operations (/api/v1/technicians)
MethodEndpointAccessDescriptionGET/api/v1/techniciansPublicList all technicians with filter parametersGET/api/v1/technicians/:idPublicGet technician profile, skills, and reviewsPUT/api/v1/technicians/profileTECHNICIANCreate or update technician professional profilePUT/api/v1/technicians/availabilityTECHNICIANSet available work hours and time slots📅 Bookings (/api/v1/bookings)MethodEndpointAccessDescriptionPOST/api/v1/bookingsCUSTOMERBook a service/technician slotGET/api/v1/bookingsAuthenticatedRetrieve user-specific bookingsGET/api/v1/bookings/:idAuthenticatedGet detailed booking informationPATCH/api/v1/bookings/:id/statusTECHNICIAN, CUSTOMERUpdate status (Accept, Decline, Cancel, Complete)

### 💳 Payments (/api/v1/payments)
MethodEndpointAccessDescriptionPOST/api/v1/payments/create-intentCUSTOMERCreate Stripe payment intent for an accepted bookingPOST/api/v1/payments/confirmCUSTOMERConfirm transaction and mark booking as PAIDGET/api/v1/payments/historyAuthenticatedView payment transaction history

### ⭐ Reviews (/api/v1/reviews)
MethodEndpointAccessDescriptionPOST/api/v1/reviewsCUSTOMERSubmit review & rating for completed jobsGET/api/v1/reviews/:technicianIdPublicGet all reviews for a specific technician

### 👑 Admin Management (/api/v1/admin)
MethodEndpointAccessDescriptionGET/api/v1/admin/usersADMINFetch all registered usersPATCH/api/v1/admin/users/:id/statusADMINChange user status (Active / Banned)GET/api/v1/admin/bookingsADMINView and monitor all system bookingsPOST/api/v1/admin/categoriesADMINCreate new service category


### ⚙️ Environment Setup
Create a .env file in the root directory and configure the following variables:Code snippet# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000


# Database Configuration (PostgreSQL / Prisma)
DATABASE_URL="postgresql://username:password@localhost:5432/fixitnow_db?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="your_super_secret_access_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
JWT_ACCESS_EXPIRATION="1d"
JWT_REFRESH_EXPIRATION="7d"
BCRYPT_SALT_ROUNDS=12

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
## 🏃 Getting Started (Local Development)Clone the repository:Bashgit clone [https://github.com/shehabRabby/FixItNow.git](https://github.com/shehabRabby/FixItNow.git)
cd FixItNow

Install dependencies:Bashnpm install
Prisma Setup & Database Migration:Bashnpx prisma generate
npx prisma db push
Run Development Server:Bashnpm run dev
The server will start at http://localhost:5000.🛠️ Build & DeploymentTo generate the serverless build bundle for Vercel using tsup:Bash# Generate Prisma Client & Bundle with tsup
npm run build

# Deploy manually via Vercel CLI
vercel --prod


## 👨‍💻 AuthorMd. Shehab Al Rabby
Junior Frontend & Full Stack Web Developer
GitHub: @shehabRabby
Portfolio: shehabrabby.vercel.app