-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BriefStatus" AS ENUM ('NEW', 'IN_REVIEW', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPosition" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'ФК Полісся',
    "preferredContactMethod" TEXT NOT NULL DEFAULT 'EMAIL',
    "businessGoals" TEXT[],
    "targetAudience" TEXT NOT NULL,
    "currentProblems" TEXT NOT NULL,
    "matchCenterFeatures" TEXT[],
    "userCabinetModules" TEXT[],
    "ticketingSystem" TEXT NOT NULL,
    "shopCategories" TEXT NOT NULL,
    "paymentMethods" TEXT[],
    "needsInventoryManagement" BOOLEAN NOT NULL DEFAULT false,
    "contentUpdateFrequency" TEXT NOT NULL,
    "matchResultsImport" TEXT NOT NULL,
    "hasBrandbook" BOOLEAN NOT NULL DEFAULT false,
    "designMood" TEXT NOT NULL,
    "expectsPeakLoads" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDeadline" TEXT NOT NULL,
    "status" "BriefStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
