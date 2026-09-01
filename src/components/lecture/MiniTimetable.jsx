import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses, isLecture }, ref) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table
          ref={ref}
          className="w-full text-left text-sm text-gray-700 whitespace-nowrap table-auto"
        >
          <thead className="bg-green-600 border-b border-green-700 text-white font-semibold tracking-wide uppercase text-xs sticky top-0 z-10">
            <tr>
              <th className="p-4 min-w-[80px]">Day</th>
              <th className="p-4 min-w-[80px]">Time</th>
              <th className="p-4 min-w-[100px]">Lecture Room</th>
              <th className="p-4 min-w-[100px]">Course Code</th>
              <th className="p-4 min-w-[200px]">Course Name</th>
              <th className="p-4 min-w-[120px]">Programme Code</th>
              <th className="p-4 min-w-[80px]">Class Size</th>
              <th className="p-4 min-w-[120px]">Lecturer Name</th>
              <th className="p-4 min-w-[100px]">Period</th>
              <th className="p-4 min-w-[80px]">Block</th>
              <th className="p-4 min-w-[80px]">Credit Hours</th>
              <th className="p-4 min-w-[80px]">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {selectedCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 font-medium">{isLecture ? course.Day : course.examsDay}</td>
                <td className="p-4 text-gray-900">{isLecture ? course.Time : course.examsTime}</td>
                <td className="p-4">{isLecture ? course.LectureRoom : course.examsVenue}</td>
                <td className="p-4 font-bold text-blue-600">{isLecture ? course.CourseCode : course.courseCode}</td>
                <td className="p-4 whitespace-normal min-w-[200px] text-gray-900 font-medium">{isLecture ? course.CourseName : course.courseName}</td>
                <td className="p-4 break-words whitespace-normal min-w-[150px] text-xs text-gray-500">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                    {isLecture ? course.ClassSize : course.classSize}
                  </span>
                </td>
                <td className="p-4">{isLecture ? course.LecturerName : course.lecturerName}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-semibold">
                    {isLecture ? course.Period : "N/A"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold tracking-wide border border-gray-200">
                    {isLecture ? course.Block : course.blockCode}
                  </span>
                </td>
                <td className="p-4 text-center font-medium">{isLecture ? course.CreditHours : "N/A"}</td>
                <td className="p-4">{isLecture ? course.Mode : course.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;