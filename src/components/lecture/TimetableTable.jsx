import React from "react";

function TimetableTable({ timetableData, selectedCourses, toggleCourseSelection, isLecture, selectAllCourses, deselectAllCourses }) {
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
            <th className="p-3">{isLecture ? "Time" : "Date"}</th>
            <th className="p-3">{isLecture ? "Lecture Room" : "Venue"}</th>
            <th className="p-3">Course Code</th>
            <th className="p-3">Course Name</th>
            <th className="p-3 max-w-xs">Programme Code</th>
            <th className="p-3">Class Size</th>
            <th className="p-3">Lecturer Name</th>
            <th className="p-3">{isLecture ? "Period" : "Mode"}</th>
            <th className="p-3">{isLecture ? "Credit Hours" : "N/A"}</th>
            <th className="p-3">{isLecture ? "Mode" : "N/A"}</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((course, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.some((c) => c.CourseCode === course.CourseCode)}
                  onChange={() => toggleCourseSelection(course)}
                />
              </td>
              <td className="p-3">{isLecture ? course.Block : course.blockCode}</td>
              <td className="p-3">{isLecture ? course.Day : course.examsDay}</td>
              <td className="p-3">{isLecture ? course.Time : course.examsDate}</td>
              <td className="p-3">{isLecture ? course.LectureRoom : course.examsVenue}</td>
              <td className="p-3">{isLecture ? course.CourseCode : course.courseCode}</td>
              <td className="p-3">{isLecture ? course.CourseName : course.courseName}</td>
              <td className="p-3 truncate max-w-xs">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
              <td className="p-3">{isLecture ? course.ClassSize : course.classSize}</td>
              <td className="p-3">{isLecture ? course.LecturerName : course.lecturerName}</td>
              <td className="p-3">{isLecture ? course.Period : course.mode}</td>
              <td className="p-3">{isLecture ? course.CreditHours : "N/A"}</td>
              <td className="p-3">{isLecture ? course.Mode : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableTable;