/*
  Warnings:

  - You are about to drop the column `user_bio` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_biography` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_bio",
ADD COLUMN     "user_biography" TEXT NOT NULL;
