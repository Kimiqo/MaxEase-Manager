import React from "react";

function HowToUseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400">Guidelines for Accessing the School’s Lecture Timetable</h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
          <li>The timetable loads automatically from the School’s database.</li>
          <li>Use the search bar to filter by course name, course code, programme code, lecturer name, lecture room, day, or block.</li>
          <li>Use the block or period filters to narrow down by block (e.g., B1) or period (e.g., Quarter 1).</li>
          <li>Select checkboxes next to courses to add them to your mini-timetable.</li>
          <li>Click “View Mini-Timetable” to see your selected courses (available after selecting at least one course).</li>
          <li>Click “Download Mini-Timetable as PNG” to save your selection as an image.</li>
          <li>Use the “Back to Top” button to return to the top of the page.</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-sm sm:text-base"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}

export default HowToUseModal;