import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses }, ref) => {
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
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Date</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Time</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Venue</th>
              <th className="p-2 sm:p-3 text-left min-w-[100px]">Course Code</th>
              <th className="p-2 sm:p-3 text-left min-w-[200px]">Course Name</th>
              <th className="p-2 sm:p-3 text-left min-w-[120px]">Programme Code</th>
              <th className="p-2 sm:p-3 text-left min-w-[80px]">Class Size</th>
              <th className="p-2 sm:p-3 text-left min-w-[120px]">Lecturer</th>
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
                <td className="p-2 sm:p-3">{exam.courseName}</td>
                <td className="p-2 sm:p-3">{exam.programmeCode}</td>
                <td className="p-2 sm:p-3">{exam.classSize}</td>
                <td className="p-2 sm:p-3">{exam.lecturerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default MiniTimetable;