/*
  Warnings:

  - Added the required column `logo` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "logo" TEXT NOT NULL;
