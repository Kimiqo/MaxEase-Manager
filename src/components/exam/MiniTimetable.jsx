import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses }, ref) => {
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
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Date</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Time</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Venue</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Course Code</th>
              <th className="p-2 sm:p-3 text-left max-w-[150px] truncate">Course Name</th>
              <th className="p-2 sm:p-3 text-left max-w-[120px] truncate">Programme Code</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px] hidden sm:table-cell">Class Size</th>
              <th className="p-2 sm:p-3 text-left max-w-[120px] truncate hidden sm:table-cell">Lecturer</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((exam, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 sm:p-3">{exam.examsDay}</td>
                <td className="p-2 sm:p-3">{exam.examsDate}</td>
                <td className="p-2 sm:p-3">{exam.examsTime}</td>
                <td className="p-2 sm:p-3">{exam.examsVenue}</td>
                <td className="p-2 sm:p-3">{exam.courseCode}</td>
                <td className="p-2 sm:p-3 max-w-[150px] truncate">{exam.courseName}</td>
                <td className="p-2 sm:p-3 max-w-[120px] truncate">{exam.programmeCode}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">{exam.classSize}</td>
                <td className="p-2 sm:p-3 max-w-[120px] truncate hidden sm:table-cell">{exam.lecturerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;