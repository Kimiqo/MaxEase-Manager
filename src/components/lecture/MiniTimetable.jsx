import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses, isLecture }, ref) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Mini-Timetable</h2>
      <table
        ref={ref}
        className="w-full bg-white shadow-md rounded-lg border border-gray-300"
      >
        <thead className="bg-[#10b981] text-white">
          <tr>
            <th className="p-3">Day</th>
            <th className="p-3">Time</th>
            <th className="p-3">Lecture Room</th>
            <th className="p-3">Course Code</th>
            <th className="p-3">Course Name</th>
            <th className="p-3 max-w-xs">Programme Code</th>
            <th className="p-3">Class Size</th>
            <th className="p-3">Lecturer Name</th>
            <th className="p-3">Period</th>
            <th className="p-3">Block</th>
            <th className="p-3">Credit Hours</th>
            <th className="p-3">Mode</th>
          </tr>
        </thead>
        <tbody>
          {selectedCourses.map((course, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{isLecture ? course.Day : course.examsDay}</td>
              <td className="p-3">{isLecture ? course.Time : course.examsTime}</td>
              <td className="p-3">{isLecture ? course.LectureRoom : course.examsVenue}</td>
              <td className="p-3">{isLecture ? course.CourseCode : course.courseCode}</td>
              <td className="p-3">{isLecture ? course.CourseName : course.courseName}</td>
              <td className="p-3 truncate max-w-xs">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
              <td className="p-3">{isLecture ? course.ClassSize : course.classSize}</td>
              <td className="p-3">{isLecture ? course.LecturerName : course.lecturerName}</td>
              <td className="p-3">{isLecture ? course.Period : "N/A"}</td>
              <td className="p-3">{isLecture ? course.Block : course.blockCode}</td>
              <td className="p-3">{isLecture ? course.CreditHours : "N/A"}</td>
              <td className="p-3">{isLecture ? course.Mode : course.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default MiniTimetable;