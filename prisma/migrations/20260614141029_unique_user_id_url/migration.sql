/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Reel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reel_userId_url_key" ON "Reel"("userId", "url");
