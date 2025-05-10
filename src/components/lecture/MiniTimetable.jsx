import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses, isLecture }, ref) => {
  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">Your Mini-Timetable</h2>
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className="w-full max-w-full bg-white shadow-md rounded-lg border border-gray-300 table-auto"
        >
          <thead className="bg-[#10b981] text-white">
            <tr>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Day</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Time</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Lecture Room</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Course Code</th>
              <th className="p-2 sm:p-3 text-left max-w-[150px] truncate">Course Name</th>
              <th className="p-2 sm:p-3 text-left max-w-[120px] truncate">Programme Code</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px] hidden sm:table-cell">Class Size</th>
              <th className="p-2 sm:p-3 text-left max-w-[120px] truncate hidden sm:table-cell">Lecturer Name</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px] hidden sm:table-cell">Period</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px] hidden sm:table-cell">Block</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px] hidden sm:table-cell">Credit Hours</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px] hidden sm:table-cell">Mode</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 sm:p-3">{isLecture ? course.Day : course.examsDay}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.Time : course.examsTime}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.LectureRoom : course.examsVenue}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.CourseCode : course.courseCode}</td>
                <td className="p-2 sm:p-3 max-w-[150px] truncate">{isLecture ? course.CourseName : course.courseName}</td>
                <td className="p-2 sm:p-3 max-w-[120px] truncate">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{isLecture ? course.ClassSize : course.classSize}</td>
                <td className="p-2 sm:p-3 max-w-[120px] truncate hidden sm:table-cell">{isLecture ? course.LecturerName : course.lecturerName}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{isLecture ? course.Period : "N/A"}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{isLecture ? course.Block : course.blockCode}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{isLecture ? course.CreditHours : "N/A"}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{isLecture ? course.Mode : course.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;