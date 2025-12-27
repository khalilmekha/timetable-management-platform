import { hashSync } from "bcrypt"; // Importing bcrypt for password hashing

import { Faculty, TeacherGender, UserRole, WeekDay } from "@prisma/client";

import { prismaClient } from "../prisma";

import classroomsData from "./data/classrooms.json"; // Importing classrooms data from JSON file
import coursData from "./data/courses.json"; // Importing course data from JSON file
import specialitiesData from "./data/specialities.json"; // Importing specialities data from JSON file
import teachersData from "./data/teachers.json"; // Importing teacher data from JSON file

import type {
  ClassroomFeature,
  ClassroomType,
  Cycle,
  CycleYear,
} from "@prisma/client";
// Teacher data from the JSON file

function randomWeekdays(): WeekDay[] {
  const weekdays: WeekDay[] = [
    WeekDay.Saturday,
    WeekDay.Sunday,
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
  ];
  const days: WeekDay[] = [];
  //2 to 4 random weekdays
  const randomCount = Math.floor(Math.random() * 3) + 2; // Random count between 2 and 4
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = Math.floor(Math.random() * weekdays.length);
    const day = weekdays[randomIndex];
    if (!days.includes(day)) {
      days.push(day);
    } else {
      i--; // If the day is already included, decrement i to try again
    }
  }

  return days;
}

function mapFaculty(facultyString: string): Faculty {
  switch (facultyString) {
    case "Faculty.ComputerScience":
      return Faculty.ComputerScience;
    case "Faculty.Mathematics":
      return Faculty.Mathematics;
    case "Faculty.Physics":
      return Faculty.Physics;
    default:
      return Faculty.ComputerScience; // Default fallback
  }
}

function mapGender(genderString: string): TeacherGender {
  return genderString.toLowerCase() === "male"
    ? TeacherGender.Male
    : TeacherGender.Female;
}

export async function seedTeachers() {
  try {
    console.log("Starting teacher seeding...");

    // First, collect all unique courses from the data
    const allCourses = new Map<
      string,
      {
        name: string;
        code: string;
        tp: number;
        td: number;
        lecture: number;
      }
    >();

    for (const teacher of teachersData) {
      // Add primary course
      const [primaryName, primaryCode] = teacher.primary_course;
      const primaryCourseData = coursData.find(
        (course) => course.code === primaryCode
      );
      if (!primaryCourseData) {
        console.error(
          `Primary course ${primaryCode} not found in course data for teacher ${teacher.first_name} ${teacher.last_name}`
        );
        continue; // Skip this teacher if primary course is not found
      }

      allCourses.set(primaryCode, {
        name: primaryName,
        code: primaryCode,
        lecture: primaryCourseData.lWeeklySessions,
        td: primaryCourseData.pwWeeklySessions,
        tp: primaryCourseData.dwWeeklySessions,
      });

      // Add secondary courses
      for (const [secondaryName, secondaryCode] of teacher.secondary_courses) {
        const secondaryCourseData = coursData.find(
          (course) => course.code === secondaryCode
        );

        if (!secondaryCourseData) {
          console.error(
            `Secondary course ${secondaryCode} not found in course data for teacher ${teacher.first_name} ${teacher.last_name}`
          );
          continue; // Skip this secondary course if not found
        }

        allCourses.set(secondaryCode, {
          name: secondaryName,
          code: secondaryCode,
          lecture: secondaryCourseData.lWeeklySessions,
          td: secondaryCourseData.pwWeeklySessions,
          tp: secondaryCourseData.dwWeeklySessions,
        });
      }
    }

    console.log(
      `Found ${allCourses.size} unique courses to create/ensure exist`
    );

    // Create all courses first (using upsert to avoid duplicates)
    const courseIdMap = new Map<string, string>();

    for (const [code, courseData] of allCourses) {
      const course = await prismaClient.course.upsert({
        where: { code },
        update: {},
        create: {
          name: courseData.name,
          code: courseData.code,
          directedWorkWeeklySessions: courseData.td,
          practicalWorkWeeklySessions: courseData.tp,
          lectureWeeklySessions: courseData.lecture,

          description: `Course: ${courseData.name}`,
        },
      });
      courseIdMap.set(code, course.id);
      console.log(`✓ Course: ${courseData.name} (${code})`);
    }

    console.log("Creating teachers...");

    // Now create teachers
    let successCount = 0;
    let errorCount = 0;

    for (const teacherData of teachersData) {
      try {
        const primaryCourseId = courseIdMap.get(teacherData.primary_course[1]);
        if (!primaryCourseId) {
          console.error(
            `Primary course not found for teacher ${teacherData.first_name} ${teacherData.last_name}`
          );
          errorCount++;
          continue;
        }

        // Get secondary course IDs
        const secondaryCourseIds = teacherData.secondary_courses
          .map(([_, code]) => courseIdMap.get(code))
          .filter((id): id is string => id !== undefined);

        const teacher = await prismaClient.teacher.create({
          data: {
            firstName: teacherData.first_name,
            lastName: teacherData.last_name,
            phone: teacherData.phone,
            email: teacherData.email,
            gender: mapGender(teacherData.gender),
            faculty: mapFaculty(teacherData.faculty),
            availabilities: randomWeekdays(),
            user: {
              create: {
                firstName: teacherData.first_name,
                lastName: teacherData.last_name,
                email: teacherData.email,
                hashedPassword: hashSync(
                  "teacher123", // Default password, should be changed later
                  10 // Hashing the password with bcrypt
                ),
                role: UserRole.Teacher,
              },
            },
            primaryCourse: {
              connect: { id: primaryCourseId },
            },
            secondaryCourses: {
              connect: secondaryCourseIds.map((id) => ({ id })),
            },
          },
        });

        console.log(
          `✓ Teacher: ${teacherData.first_name} ${teacherData.last_name}`
        );
        successCount++;
      } catch (error) {
        console.error(
          `✗ Error creating teacher ${teacherData.first_name} ${teacherData.last_name}:`,
          error
        );
        errorCount++;
      }
    }

    for (const specialityData of specialitiesData.specialities) {
      await prismaClient.speciality.create({
        data: {
          cycle: specialityData.cycle as Cycle,
          name: specialityData.name,
          code: specialityData.code,
          faculty: specialityData.faculty as Faculty,
          year: specialityData.year as CycleYear,
          firstSemesterCourses: {
            connect: specialityData.firstSemesterCourses
              .map((course) => ({
                code: course.code,
              }))
              .map((course) => ({
                id: courseIdMap.get(course.code) || "",
              }))
              .filter((course) => course.id),
          },
          secondSemesterCourses: {
            connect: specialityData.secondSemesterCourses
              .map((course) => ({
                code: course.code,
              }))
              .map((course) => ({
                id: courseIdMap.get(course.code) || "",
              }))
              .filter((course) => course.id),
          },

          sections: {
            create: ["A", "B", "C"].map((section) => ({
              code: `${section}`,
              groups: {
                create: [
                  ...Array.from({ length: 3 }, (_, i) => ({
                    name: `G${i + 1}`,
                  })),
                ],
              },
            })),
          },
        },
      });
    }

    for (const classroomData of classroomsData) {
      await prismaClient.classroom.create({
        data: {
          name: classroomData.name,
          maxCapacity: classroomData.capacity,
          location: classroomData.location,
          description: classroomData.description,
          type: classroomData.type as ClassroomType,
          features: classroomData.features as ClassroomFeature[],
        },
      });
    }

    console.log(`\nTeacher seeding completed:`);
    console.log(`✓ Successfully created/updated: ${successCount} teachers`);
    console.log(`✗ Errors: ${errorCount} teachers`);
    console.log(`📚 Total courses created/ensured: ${allCourses.size}`);
  } catch (error) {
    console.error("Error seeding teachers:", error);
    throw error;
  }
}
