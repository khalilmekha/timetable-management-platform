/*
  Warnings:

  - The values [ComputerLaboratory] on the enum `ClassroomType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `userId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClassroomFeature" ADD VALUE 'NetTools';
ALTER TYPE "ClassroomFeature" ADD VALUE 'Wifi';
ALTER TYPE "ClassroomFeature" ADD VALUE 'Computers';

-- AlterEnum
BEGIN;
CREATE TYPE "ClassroomType_new" AS ENUM ('Basic', 'Amphitheater', 'Laboratory');
ALTER TABLE "Classroom" ALTER COLUMN "type" TYPE "ClassroomType_new" USING ("type"::text::"ClassroomType_new");
ALTER TYPE "ClassroomType" RENAME TO "ClassroomType_old";
ALTER TYPE "ClassroomType_new" RENAME TO "ClassroomType";
DROP TYPE "ClassroomType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
