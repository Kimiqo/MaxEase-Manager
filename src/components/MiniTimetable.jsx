// src/components/MiniTimetable.js
import React, { forwardRef } from "react";

const MiniTimetable = forwardRef(({ selectedCourses }, ref) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Mini-Timetable</h2>
      <table
        ref={ref}
        className="w-full bg-white shadow-md rounded-lg border border-gray-300"
      >
        <thead className="bg-[#10b981] text-white"> {/* Hex green-500 */}
          <tr>
            <th className="p-3">Day</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Venue</th>
            <th className="p-3">Course Code</th>
            <th className="p-3">Course Name</th>
            <th className="p-3">Lecturer</th>
          </tr>
        </thead>
        <tbody>
          {selectedCourses.map((exam, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{exam.examsDay}</td>
              <td className="p-3">{exam.examsDate}</td>
              <td className="p-3">{exam.examsTime}</td>
              <td className="p-3">{exam.examsVenue}</td>
              <td className="p-3">{exam.courseCode}</td>
              <td className="p-3">{exam.courseName}</td>
              <td className="p-3">{exam.lecturerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default MiniTimetable;