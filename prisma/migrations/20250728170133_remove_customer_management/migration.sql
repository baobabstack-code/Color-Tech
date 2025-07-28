/*
 Warnings:
 
 - The values [customer] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
 - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'staff');
ALTER TABLE "users"
ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users"
ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole"
RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new"
RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users"
ALTER COLUMN "role"
SET DEFAULT 'admin';
COMMIT;
-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_customerId_fkey";
-- AlterTable
ALTER TABLE "users"
ALTER COLUMN "role"
SET DEFAULT 'admin';
-- DropTable
DROP TABLE "vehicles";