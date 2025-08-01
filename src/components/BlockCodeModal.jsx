import React from "react";

// Block code data based on the provided Excel sheet
const blockCodeData = [
  { code: "A1", description: "SEMESTER 1" },
  { code: "A2", description: "SEMESTER 2" },
  { code: "A5", description: "SEMESTER 1" },
  { code: "A6", description: "SEMESTER 2" },
  { code: "B1", description: "QUARTER 1" },
  { code: "B2", description: "QUARTER 2" },
  { code: "B3", description: "QUARTER 3" },
  { code: "B4", description: "QUARTER 4" },
  { code: "BA", description: "QUARTER 1 REGULAR" },
  { code: "BB", description: "QUARTER 2 REGULAR" },
  { code: "BC", description: "QUARTER 3 REGULAR" },
  { code: "BD", description: "QUARTER 4 REGULAR" },
  { code: "F1", description: "SEMESTER 1" },
  { code: "F2", description: "SEMESTER 2" },
  { code: "JA", description: "MODULAR SESSION 1" },
  { code: "JB", description: "MODULAR SESSION 2" },
  { code: "JK", description: "MODULAR SESSION 3 FINAL" },
  { code: "T1", description: "TRIMESTER 1" },
  { code: "T2", description: "TRIMESTER 2" },
  { code: "T3", description: "TRIMESTER 3" },
  { code: "TA", description: "TRIMESTER 1 (REGULAR)" },
  { code: "TB", description: "TRIMESTER 2 (REGULAR)" },
  { code: "TC", description: "TRIMESTER 3 (REGULAR)" },
  { code: "X1", description: "SESSION 1" },
  { code: "X2", description: "SESSION 2" },
];

const BlockCodeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400">Block Codes Explanation</h2>
        <p className="mb-4 text-sm sm:text-base">Below is a list of block codes and their corresponding descriptions to help you understand the timetable structure.</p>
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border-b border-gray-600">Block Code</th>
              <th className="p-2 border-b border-gray-600">Description</th>
            </tr>
          </thead>
          <tbody>
            {blockCodeData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}>
                <td className="p-2 border-b border-gray-600">{item.code}</td>
                <td className="p-2 border-b border-gray-600">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-sm sm:text-base"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default BlockCodeModal;