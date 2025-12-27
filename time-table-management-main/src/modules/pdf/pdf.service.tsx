import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { type Semester,TeacherGender } from "@prisma/client";
import { renderToBuffer } from "@react-pdf/renderer";

import { SectionSchedulePDF } from "../../components/TimeTable";
import {
  sectionSchduleToPdfData,
  teacherSchduleToPdfData,
} from "../../utils/pdf";
import { ServiceResponse } from "../../utils/serviceResponse";
import { SectionService } from "../section/section.service";
import { TeacherService } from "../teacher/teacher.service";

import type { SchedulePDFConfig } from "../../types/pdf";

export class PdfService {
  static outputDir = path.join(process.cwd(), "output", "timetables");

  static async checkOutputDir() {
    const exists = await fs
      .access(this.outputDir)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log("Output directory created:", this.outputDir);
    } else {
      console.log("Output directory already exists:", this.outputDir);
    }
  }

  static async generateSectionTimetablePdf(
    sectionId: string,
    semester: Semester
  ) {
    await this.checkOutputDir();

    const sectionSchdule = await SectionService.getSectionSchedule(
      sectionId,
      semester
    );

    if (!sectionSchdule.success) {
      return ServiceResponse.fail(
        "Section schedule not found",
        sectionSchdule.errors
      );
    }

    const sectionSchduleData = sectionSchdule.data;
    //const fileName = `${sectionId}.pdf`;
    //const outputPath = path.join(this.outputDir, fileName);

    const pdfSectionSchdule = sectionSchduleToPdfData(sectionSchdule.data);

    const pdfConfig: SchedulePDFConfig = {
      title: `${sectionSchduleData.sectionFullName}`,
      semester: sectionSchduleData.semester,
      pdfType: "Section",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      faculty: sectionSchduleData.faculty,
      season: sectionSchduleData.season,
      year: sectionSchduleData.year,
      schedule: pdfSectionSchdule,
    };

    const buffer = await renderToBuffer(
      <SectionSchedulePDF config={pdfConfig} />
    );

    await fs.writeFile(path.join(this.outputDir, `${sectionId}.pdf`), buffer);

    return ServiceResponse.success("PDF generated successfully", buffer);
  }

  static async generateTeacherTimetablePdf(
    teacherId: string,
    semester: Semester
  ) {
    await this.checkOutputDir();

    const teacherSchedule = await TeacherService.getTeacherScheduleById(
      teacherId,
      semester
    );

    if (!teacherSchedule.success) {
      return ServiceResponse.fail(
        "Section schedule not found",
        teacherSchedule.errors
      );
    }

    const teacherSchduleData = teacherSchedule.data;
    //const fileName = `${sectionId}.pdf`;
    //const outputPath = path.join(this.outputDir, fileName);

    const pdfTeacherSchedule = teacherSchduleToPdfData(teacherSchduleData);

    const pdfConfig: SchedulePDFConfig = {
      title: `${teacherSchduleData.gender === TeacherGender.Male ? "Mr" : "Mm"}.${teacherSchduleData.fullName}`,
      semester: teacherSchduleData.semester,
      pdfType: "Teacher",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),

      faculty: teacherSchduleData.faculty,
      season: teacherSchduleData.season,
      schedule: pdfTeacherSchedule,
    };

    const buffer = await renderToBuffer(
      <SectionSchedulePDF config={pdfConfig} />
    );

    await fs.writeFile(path.join(this.outputDir, `${teacherId}.pdf`), buffer);

    return ServiceResponse.success("PDF generated successfully", buffer);
  }
}

//PdfService.generateSectionTimetablePdf("422c27c9-4b6b-4c90-8dc3-0aee8a87b6bb");
