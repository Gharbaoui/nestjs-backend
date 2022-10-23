-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "user_image" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "contcat" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
