import React from "react";

function TimetableTable({ timetableData, selectedCourses, toggleCourseSelection, isLecture, selectAllCourses, deselectAllCourses }) {
  const handleSelectAll = () => {
    selectAllCourses();
  };

  const handleDeselectAll = () => {
    deselectAllCourses();
  };

  const headerBgClass = isLecture ? "bg-green-600" : "bg-blue-600";
  const headerTextClass = "text-white";

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap table-auto">
        <thead className={`${headerBgClass} ${headerTextClass} font-semibold tracking-wide uppercase text-xs border-b border-gray-200`}>
          <tr>
            <th className="p-3 w-12">
              <div className="relative group">
                <button className="w-full text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 transition-all shadow-sm">
                  Sel
                </button>
                <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-xl z-20 mt-2 min-w-[120px]">
                  <button
                    onClick={handleSelectAll}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors rounded-t-lg text-gray-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors rounded-b-lg text-gray-700"
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
            <th className="p-3">Programme Code</th>
            <th className="p-3 text-center">Class Size</th>
            <th className="p-3">Lecturer Name</th>
            <th className="p-3">{isLecture ? "Period" : "Mode"}</th>
            <th className="p-3 text-center">{isLecture ? "Credits" : "N/A"}</th>
            <th className="p-3">{isLecture ? "Mode" : "N/A"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {timetableData.map((course) => {
            const isSelected = selectedCourses.some((c) => c.id === course.id);
            return (
              <tr 
                key={course.id} 
                className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
                      checked={isSelected}
                      onChange={() => toggleCourseSelection(course)}
                    />
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold tracking-wide border border-gray-200">
                    {isLecture ? course.Block : course.blockCode}
                  </span>
                </td>
                <td className="p-3 font-medium">{isLecture ? course.Day : course.examsDay}</td>
                <td className="p-3 text-gray-900">{isLecture ? course.Time : course.examsDate}</td>
                <td className="p-3">{isLecture ? course.LectureRoom : course.examsVenue}</td>
                <td className="p-3 font-bold text-blue-600">{isLecture ? course.CourseCode : course.courseCode}</td>
                <td className="p-3 whitespace-normal min-w-[200px] text-gray-900 font-medium">{isLecture ? course.CourseName : course.courseName}</td>
                <td className="p-3 break-words whitespace-normal min-w-[120px] text-xs text-gray-500">{isLecture ? course.ProgrammeCode : course.programmeCode}</td>
                <td className="p-3 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                    {isLecture ? course.ClassSize : course.classSize}
                  </span>
                </td>
                <td className="p-3">{isLecture ? course.LecturerName : course.lecturerName}</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-semibold">
                    {isLecture ? course.Period : course.mode}
                  </span>
                </td>
                <td className="p-3 text-center font-medium">{isLecture ? course.CreditHours : "N/A"}</td>
                <td className="p-3">{isLecture ? course.Mode : "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableTable;