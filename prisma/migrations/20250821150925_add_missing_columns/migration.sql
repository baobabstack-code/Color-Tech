-- AlterTable
ALTER TABLE "public"."gallery_items" ADD COLUMN     "videoUrl" VARCHAR(512);

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "videoUrl" VARCHAR(512);

-- CreateTable
CREATE TABLE "public"."videos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "thumbnailUrl" VARCHAR(512),
    "videoUrl" VARCHAR(512) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);
