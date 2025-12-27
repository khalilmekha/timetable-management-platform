import React from "react";

import { Faculty, ScheduledClassType, TimeSlot, WeekDay } from "@prisma/client";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { CourseEntryProps, SchedulePDFConfig } from "../types/pdf";

// Register fonts
// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
//       fontWeight: "bold",
//     },
//   ],
// });

Font.register({
  family: "DejaVuSans",
  fonts: [
    {
      src: "assets/fonts/DejaVuSans/DejaVuSans.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "assets/fonts/DejaVuSans/DejaVuSans-Oblique.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "assets/fonts/DejaVuSans/DejaVuSans-Bold.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "assets/fonts/DejaVuSans/DejaVuSans-BoldOblique.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

Font.hyphenationCallback = (word: string) => {
  // Simple hyphenation logic: split words longer than 6 characters
  return ["\n", word];
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "DejaVuSans",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRowHeader: {
    backgroundColor: "#f0f0f0",
    borderStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  tableCol: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCell: {
    padding: 5,
    fontSize: 7,
  },
  dayCell: {
    width: "7%",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "#000",
  },
  timeCell: {
    width: "15.83%",
    justifyContent: "center",
    alignItems: "center",
  },
  highlightedCode: {
    backgroundColor: "#FFEB3B",
    padding: 1,
  },
  courseInfo: {
    marginBottom: 2,
  },
  emptyCell: {
    height: 60,
    width: "100%", // Ensure the cell takes the full width of its parent
    backgroundColor: "#D3D3D3", // Grey background
    flexGrow: 1, // Allow the cell to grow to fill the parent container
    justifyContent: "center", // Center content vertically (optional)
    alignItems: "center", // Center content horizontally (optional)
  },
});

// Component to render a course entry
const SectionCourseEntry: React.FC<CourseEntryProps> = ({ entry }) => (
  <View style={styles.courseInfo}>
    {entry.groupName && <Text>{entry.groupName}:</Text>}
    <Text>
      {entry.classroomName && (
        <Text style={styles.highlightedCode}>({entry.classroomName})</Text>
      )}{" "}
      {entry.courseCode} -- {classTypesMap[entry.type]}
      {entry.teacherName ? `, ${entry.teacherName.toUpperCase()}` : ""}
    </Text>
  </View>
);

const TeacherCourseEntry: React.FC<CourseEntryProps> = ({ entry }) => (
  <View style={styles.courseInfo}>
    <Text>
      {entry.classroomName && (
        <Text style={styles.highlightedCode}>({entry.classroomName})</Text>
      )}{" "}
      {entry.courseCode} -- {classTypesMap[entry.type]}
      {entry.sectionName ? `, ${entry.sectionName.toUpperCase()}` : ""}
    </Text>
  </View>
);

const timeSlotsMap: Record<TimeSlot, string> = {
  [TimeSlot.Slot1]: "08:00 - 09:30",
  [TimeSlot.Slot2]: "09:40 - 11:10",
  [TimeSlot.Slot3]: "11:20 - 12:50",
  [TimeSlot.Slot4]: "13:00 - 14:30",
  [TimeSlot.Slot5]: "14:40 - 16:10",
  [TimeSlot.Slot6]: "16:20 - 17:50",
};

const classTypesMap: Record<ScheduledClassType, string> = {
  [ScheduledClassType.PracticalWork]: "TP",
  [ScheduledClassType.DirectedWork]: "TD",
  [ScheduledClassType.Lecture]: "CM",
};



const FacultiesLogoMap: Record<string, string> = {
  [Faculty.ComputerScience]: "assets/images/faculty_info.png",
  [Faculty.Mathematics]: "assets/images/default_usthb_logo.png",
  [Faculty.Physics]: "assets/images/default_usthb_logo.png",
};

const scheduleDays: WeekDay[] = Object.values(WeekDay);
const scheduleTimeSlots: TimeSlot[] = Object.values(TimeSlot);

// Main PDF component
export const SectionSchedulePDF = ({
  config,
}: {
  config: SchedulePDFConfig;
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page} wrap={false}>
      <View style={styles.header}>
        {FacultiesLogoMap[config.faculty] ? (
          <Image src={FacultiesLogoMap[config.faculty]} style={styles.logo} />
        ) : (
          <Text style={styles.subtitle}>{config.faculty}</Text>
        )}

        <Text style={styles.title}>{config.title}</Text>
      </View>

      <View style={styles.subtitle}>
        {config.year ? <Text>College year: {config.year}</Text> : null}
        {config.season ? <Text>Season: {config.season}</Text> : null}
        <Text>Semester: {config.semester}</Text>
        <Text>Date: {config.date}</Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableRowHeader]}>
          <View style={[styles.tableCol, styles.dayCell]}>
            <Text style={styles.tableCell}></Text>
          </View>
          {scheduleTimeSlots.map((timeSlot, index) => (
            <View key={index} style={[styles.tableCol, styles.timeCell]}>
              <Text style={styles.tableCell}>{timeSlotsMap[timeSlot]}</Text>
            </View>
          ))}
        </View>

        {/* Table Body */}
        {scheduleDays.map((day, dayIndex) => (
          <View key={dayIndex} style={styles.tableRow}>
            <View style={[styles.tableCol, styles.dayCell]}>
              <Text style={styles.tableCell}>{day}</Text>
            </View>

            {scheduleTimeSlots.map((timeSlot, timeIndex) => {
              const entries = config.schedule[day][timeSlot] || [];
              return (
                <View
                  key={timeIndex}
                  style={[styles.tableCol, styles.timeCell]}
                >
                  <View
                    style={[
                      styles.tableCell,
                      entries.length === 0 ? styles.emptyCell : {},
                    ]}
                  >
                    {entries.map((entry, entryIndex) =>
                      config.pdfType === "Section" ? (
                        <SectionCourseEntry key={entryIndex} entry={entry} />
                      ) : (
                        <TeacherCourseEntry key={entryIndex} entry={entry} />
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
