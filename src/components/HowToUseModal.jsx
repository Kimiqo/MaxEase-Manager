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
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400">How to Use MaxEase</h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
          <li>The timetable loads automatically from the school’s data.</li>
          <li>Use the search bar to filter courses by name, code, or program.</li>
          <li>Check the boxes next to courses to add them to your mini-timetable.</li>
          <li>Click "View Mini-Timetable" to jump to your selected courses.</li>
          <li>Click "Download Mini-Timetable as PNG" to save it as an image.</li>
          <li>Use the "Back to Top" button to return to the top of the page.</li>
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