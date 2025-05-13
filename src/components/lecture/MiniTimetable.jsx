import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses, isLecture }, ref) => {
  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">Your Mini-Timetable</h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#10b981] scrollbar-track-gray-200">
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
              <th className="p-2 sm:p-3 text-left min-w-[200px]">Course Name</th>
              <th className="p-2 sm:p-3 text-left min-w-[120px]">Programme Code</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Class Size</th>
              <th className="p-2 sm:p-3 text-left min-w-[120px]">Lecturer Name</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Period</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Block</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Credit Hours</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Mode</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="p-2 sm:p-3">{isLecture ? course.Day : course.examsDay}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.Time : course.examsTime}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.LectureRoom : course.examsVenue}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.CourseCode : course.courseCode}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.CourseName : course.courseName}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.ClassSize : course.classSize}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.LecturerName : course.lecturerName}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.Period : "N/A"}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.Block : course.blockCode}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.CreditHours : "N/A"}</td>
                <td className="p-2 sm:p-3">{isLecture ? course.Mode : course.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;