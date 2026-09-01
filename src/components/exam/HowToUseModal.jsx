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
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700 tracking-tight">Guidelines for Accessing the School’s Exams Timetable</h2>
        <ul className="list-disc list-inside space-y-3 text-sm sm:text-base text-gray-600">
          <li>The timetable loads automatically from the School’s database.</li>
          <li>Use the search bar to filter by lecturer name, course name, course code, your program code, or current block.</li>
          <li>Select the checkboxes next to courses to add them to your mini-timetable.</li>
          <li>Click “View Selected” to display your selected courses. This option becomes available after selecting at least one checkbox.</li>
          <li>Click “Download Timetable” to save your selection as an image.</li>
          <li>Use the “Back to Top” button to quickly return to the top of the page.</li>
          <li>Note: Exam dates are displayed in the format Year-Month-Day (e.g. 2025-04-12).</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 sm:mt-8 w-full py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}

export default HowToUseModal;
