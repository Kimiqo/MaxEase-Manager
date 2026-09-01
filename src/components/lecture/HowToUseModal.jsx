import React from "react";

function HowToUseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 transition-opacity fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-700 tracking-tight">Guidelines for Accessing the School’s Lecture Timetable</h2>
        <ul className="list-disc list-inside space-y-3 text-sm sm:text-base text-gray-600">
          <li>The timetable loads automatically from the School’s database.</li>
          <li>Use the search bar to filter by course name, course code, programme code, lecturer name, lecture room, day, or block.</li>
          <li>Use the block or period filters to narrow down by block (e.g., B1) or period (e.g., Quarter 1).</li>
          <li>Select checkboxes next to courses to add them to your mini-timetable.</li>
          <li>Click “View Selected” to see your selected courses (available after selecting at least one course).</li>
          <li>Click “Download Timetable” to save your selection as an image.</li>
          <li>Use the “Back to Top” button to return to the top of the page.</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 sm:mt-8 w-full py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}

export default HowToUseModal;