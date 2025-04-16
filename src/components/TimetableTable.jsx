import React from "react";

function TimetableTable({ timetableData, selectedCourses, toggleCourseSelection }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3">Select</th>
            <th className="p-3">Block</th>
            <th className="p-3">Day</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Venue</th>
            <th className="p-3">Course Code</th>
            <th className="p-3">Course Name</th>
            <th className="p-3 max-w-sx">Programme Code</th>
            <th className="p-3">Class Size</th>
            <th className="p-3">Lecturer</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((exam, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(exam)}
                  onChange={() => toggleCourseSelection(exam)}
                />
              </td>
              <td className="p-3">{exam.blockCode}</td>
              <td className="p-3">{exam.examsDay}</td>
              <td className="p-3">{exam.examsDate}</td>
              <td className="p-3">{exam.examsTime}</td>
              <td className="p-3">{exam.examsVenue}</td>
              <td className="p-3">{exam.courseCode}</td>
              <td className="p-3">{exam.courseName}</td>
              <td className="p-3 truncate max-w-xs">{exam.programmeCode}</td>
              <td className="p-3">{exam.classSize}</td>
              <td className="p-3">{exam.lecturerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableTable;