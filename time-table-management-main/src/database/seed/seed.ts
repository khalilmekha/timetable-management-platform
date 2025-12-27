import bcrypt from "bcrypt";

import { UserRole } from "@prisma/client";

import { seedTeachers } from "./seeder";

import { prismaClient } from "../prisma";

export async function seedDatabase() {
  try {
    await prismaClient.$connect(); // Ensure the client is connected before seeding
    // Add your seeding logic here
    // Example: await prismaClient.user.create({ data: { name: "John Doe" } });

    console.log("Clearing existing data..."); // Start a transaction
    await prismaClient.$transaction(async (tx) => {
      // Clear all data in the database (respecting foreign key constraints)
      // Delete in order from most dependent to least dependent

      // 1. Most dependent tables first
      await tx.classSchedule.deleteMany({});
      await tx.teacherComplaint.deleteMany({});
      await tx.auditLog.deleteMany({});

      // 2. Assignment tables that depend on core entities
      await tx.groupCourseAssignment.deleteMany({});
      await tx.sectionCourseAssignment.deleteMany({});

      // 3. Group and section hierarchy
      await tx.sectionGroup.deleteMany({});
      await tx.section.deleteMany({});

      // 4. Teachers (depends on users and courses)
      await tx.teacher.deleteMany({});

      // 5. Courses and specialities (many-to-many, delete courses first)
      await tx.course.deleteMany({});
      await tx.speciality.deleteMany({});

      // 6. Independent tables
      await tx.user.deleteMany({});
      await tx.classroom.deleteMany({});
      await tx.season.deleteMany({});
    });

    console.log("Seeding database...");

    // For demonstration, let's create a sample user
    await prismaClient.user.create({
      data: {
        email: "admin@gmail.com",
        hashedPassword: bcrypt.hashSync("admin123", 10), // Hash the password
        firstName: "Admin",
        lastName: "User",
        role: UserRole.Administrator,
      },
    });

    await prismaClient.season.create({
      data: {
        seasonStartYear: 2024,
        seasonEndYear: 2025,
        isCurrent: true,
      },
    });

    await seedTeachers();
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error; // Re-throw the error to handle it in the calling context
  } finally {
    await prismaClient.$disconnect(); // Ensure the client is disconnected after seeding
  }
}

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error);
});
