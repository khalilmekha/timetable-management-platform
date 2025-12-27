import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const SectionRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create section",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Section created successfully",
    },
  },

  getSectionById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section not found",
    },

    success: {
      code: StatusCodes.OK,
      message: "Section fetched successfully",
    },
  },

  createSectionSchedule: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create section schedule",
    },

    success: {
      code: StatusCodes.CREATED,
      message: "Section schedule created successfully",
    },
  },

  updateSectionSchedule: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update section schedule",
    },

    success: {
      code: StatusCodes.CREATED,
      message: "Section schedule update successfully",
    },
  },

  deleteSectionSchedule: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create delete schedule",
    },

    success: {
      code: StatusCodes.CREATED,
      message: "Section schedule delete successfully",
    },
  },

  getAllSections: {
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch sections",
    },
    success: {
      code: StatusCodes.OK,
      message: "Sections fetched successfully",
    },
  },

  genetateSectionSchedule: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Section schedule generation failed",
    },

    success: {
      code: StatusCodes.OK,
      message: "Section schedule generated successfully",
    },
  },

  updateSection: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update section",
    },
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Section updated successfully",
    },
  },

  deleteSection: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Section deleted successfully",
    },
  },

  getSectionSchedule: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section not found",
    },

    success: {
      code: StatusCodes.OK,
      message: "Section schedule fetched successfully",
    },
  },

  generateSectionTimetablePdf: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section schedule not found",
    },

    success: {
      code: StatusCodes.OK,
      message: "Section timetable PDF generated successfully",
    },
  },

  getSectionScheduleStatistics: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section schedule not found",
    },

    success: {
      code: StatusCodes.OK,
      message: "Section schedule statistics fetched successfully",
    },
  },

  assignSection: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Section not found",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to assign section",
    },
    success: {
      code: StatusCodes.OK,
      message: "Section assigned successfully",
    },
  },

  getSectionsChoices: {
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch sections choices",
    },
    success: {
      code: StatusCodes.OK,
      message: "Sections choices fetched successfully",
    },
  },
} satisfies RouteResponsesConfig;
