-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pendingReelUrl" TEXT,
ADD COLUMN     "waitingForNote" BOOLEAN NOT NULL DEFAULT false;
