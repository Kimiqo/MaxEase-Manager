import React from "react";

function TimetableTable({ timetableData, selectedCourses, toggleCourseSelection, selectAllCourses, deselectAllCourses }) {
  const handleSelectAll = () => {
    selectAllCourses();
  };

  const handleDeselectAll = () => {
    deselectAllCourses();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3">
              <div className="relative group">
                <button className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded px-2 py-1">
                  Select
                </button>
                <div className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
                  <button
                    onClick={handleSelectAll}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            </th>
            <th className="p-3">Block</th>
            <th className="p-3">Day</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Venue</th>
            <th className="p-3">Course Code</th>
            <th className="p-3">Course Name</th>
            <th className="p-3 max-w-xs">Programme Code</th>
            <th className="p-3">Class Size</th>
            <th className="p-3">Lecturer</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((exam) => (
            <tr key={exam.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.some((course) => course.id === exam.id)}
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