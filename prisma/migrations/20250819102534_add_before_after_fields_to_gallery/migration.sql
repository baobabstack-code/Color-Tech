-- AlterTable
ALTER TABLE "public"."gallery_items" ADD COLUMN     "afterImageUrl" VARCHAR(512),
ADD COLUMN     "beforeImageUrl" VARCHAR(512),
ADD COLUMN     "type" VARCHAR(50) NOT NULL DEFAULT 'single_image';
