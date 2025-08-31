-- CreateTable
CREATE TABLE "public"."homepage_sections" (
    "id" SERIAL NOT NULL,
    "sectionKey" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_sectionKey_key" ON "public"."homepage_sections"("sectionKey");
