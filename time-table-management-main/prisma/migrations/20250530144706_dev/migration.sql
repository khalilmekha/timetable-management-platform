/*
  Warnings:

  - You are about to drop the `_CourseToSpeciality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseToSpeciality" DROP CONSTRAINT "_CourseToSpeciality_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSpeciality" DROP CONSTRAINT "_CourseToSpeciality_B_fkey";

-- DropTable
DROP TABLE "_CourseToSpeciality";

-- CreateTable
CREATE TABLE "_CourseToSpecialityFirstSemester" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToSpecialityFirstSemester_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToSpecialitySecondSemester" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToSpecialitySecondSemester_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToSpecialityFirstSemester_B_index" ON "_CourseToSpecialityFirstSemester"("B");

-- CreateIndex
CREATE INDEX "_CourseToSpecialitySecondSemester_B_index" ON "_CourseToSpecialitySecondSemester"("B");

-- AddForeignKey
ALTER TABLE "_CourseToSpecialityFirstSemester" ADD CONSTRAINT "_CourseToSpecialityFirstSemester_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSpecialityFirstSemester" ADD CONSTRAINT "_CourseToSpecialityFirstSemester_B_fkey" FOREIGN KEY ("B") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSpecialitySecondSemester" ADD CONSTRAINT "_CourseToSpecialitySecondSemester_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSpecialitySecondSemester" ADD CONSTRAINT "_CourseToSpecialitySecondSemester_B_fkey" FOREIGN KEY ("B") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;
