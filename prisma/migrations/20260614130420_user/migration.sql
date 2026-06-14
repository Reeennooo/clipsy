/*
  Warnings:

  - You are about to drop the column `waitingForNote` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "waitingForNote",
ADD COLUMN     "flowState" TEXT NOT NULL DEFAULT 'IDLE';
