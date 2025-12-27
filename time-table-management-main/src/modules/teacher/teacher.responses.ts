import { StatusCodes } from "http-status-codes";

export const TeacherRouteResponses = {  createTeacher: {
    success: {
      code: StatusCodes.CREATED,
      message: "Teacher created successfully",
    },
    fail: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create teacher",
    },
  },  getTeacherSchedule: {
    success: {
      code: StatusCodes.OK,
      message: "Teacher schedule found",
    },
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher schedule not found",
    },
  },
  getMyTeacherSchedule: {
    success: {
      code: StatusCodes.OK,
      message: "Teacher schedule found",
    },
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher schedule not found",
    },
  },
  getTeacherById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher found",
    },
  },
  generateTeacherTimetablePdf: {
    success: {
      code: StatusCodes.OK,
      message: "Teacher timetable PDF generated successfully",
    },
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher schedule not found",
    },
  },
  getAllTeachers: {
    success: {
      code: StatusCodes.OK,
      message: "Teachers found",
    },
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "No teachers found",
    },
  },  updateTeacher: {
    fail: {
      code: StatusCodes.BAD_REQUEST,
      message: "Teacher update failed",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher updated successfully",
    },
  },
  deleteTeacher: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher deleted successfully",
    },
  },
};
