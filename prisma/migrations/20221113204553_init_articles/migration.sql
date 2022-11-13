-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT false,
    "release_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "search_keywords" TEXT[],
    "next_prev_article" JSONB NOT NULL,
    "title" TEXT NOT NULL,
    "idea" TEXT NOT NULL,
    "preqs" JSONB[],
    "explained" JSONB[],
    "conclusion" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
