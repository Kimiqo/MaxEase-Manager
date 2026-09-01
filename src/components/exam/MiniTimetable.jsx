import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses }, ref) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table
          ref={ref}
          className="w-full text-left text-sm text-gray-700 whitespace-nowrap table-auto"
        >
          <thead className="bg-blue-600 border-b border-blue-700 text-white font-semibold tracking-wide uppercase text-xs sticky top-0 z-10">
            <tr>
              <th className="p-4 min-w-[80px]">Day</th>
              <th className="p-4 min-w-[100px]">Date</th>
              <th className="p-4 min-w-[80px]">Time</th>
              <th className="p-4 min-w-[80px]">Venue</th>
              <th className="p-4 min-w-[100px]">Course Code</th>
              <th className="p-4 min-w-[200px]">Course Name</th>
              <th className="p-4 min-w-[120px]">Programme Code</th>
              <th className="p-4 min-w-[80px]">Class Size</th>
              <th className="p-4 min-w-[120px]">Lecturer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {selectedCourses.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 font-medium">{exam.examsDay}</td>
                <td className="p-4">{exam.examsDate}</td>
                <td className="p-4 text-gray-900">{exam.examsTime}</td>
                <td className="p-4">{exam.examsVenue}</td>
                <td className="p-4 font-bold text-blue-600">{exam.courseCode}</td>
                <td className="p-4 whitespace-normal min-w-[200px] text-gray-900 font-medium">{exam.courseName}</td>
                <td className="p-4 break-words whitespace-normal min-w-[150px] text-xs text-gray-500">{exam.programmeCode}</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                    {exam.classSize}
                  </span>
                </td>
                <td className="p-4">{exam.lecturerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;