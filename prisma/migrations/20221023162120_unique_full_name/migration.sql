/*
  Warnings:

  - A unique constraint covering the columns `[full_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_full_name_key" ON "User"("full_name");
