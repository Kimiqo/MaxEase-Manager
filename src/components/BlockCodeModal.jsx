import React from "react";

// Block code data based on the provided Excel sheet
const blockCodeData = [
  { code: "A1", description: "SEMESTER 1 (SEPTEMBER INTAKE)" },
  { code: "A2", description: "SEMESTER 2 (SEPTEMBER INTAKE)" },
  { code: "A5", description: "SEMESTER 1 (FEBRUARY INTAKE)" },
  { code: "A6", description: "SEMESTER 2 (FEBRUARY INTAKE)" },
  { code: "B1", description: "QUARTER 1 (FEBRUARY INTAKE)" },
  { code: "B2", description: "QUARTER 2 (FEBRUARY INTAKE)" },
  { code: "B3", description: "QUARTER 3 (FEBRUARY INTAKE)" },
  { code: "B4", description: "QUARTER 4 (FEBRUARY INTAKE)" },
  { code: "BA", description: "QUARTER 1 REGULAR (SEPTEMBER INTAKE)" },
  { code: "BB", description: "QUARTER 2 REGULAR (SEPTEMBER INTAKE)" },
  { code: "BC", description: "QUARTER 3 REGULAR (SEPTEMBER INTAKE)" },
  { code: "BD", description: "QUARTER 4 REGULAR (SEPTEMBER INTAKE)" },
  { code: "F1", description: "SEMESTER 1 (FEBRUARY INTAKE)" },
  { code: "F2", description: "SEMESTER 2 (FEBRUARY INTAKE)" },
  { code: "JA", description: "MODULAR SESSION 1  (SEPTEMBER INTAKE)" },
  { code: "JB", description: "MODULAR SESSION 2 (SEPTEMBER INTAKE)" },
  { code: "JK", description: "MODULAR SESSION 3 FINAL (SEPTEMBER INTAKE)" },
  { code: "T1", description: "TRIMESTER 1 (FEBRUARY INTAKE)" },
  { code: "T2", description: "TRIMESTER 2 (FEBRUARY INTAKE)" },
  { code: "T3", description: "TRIMESTER 3 (FEBRUARY INTAKE)" },
  { code: "TA", description: "TRIMESTER 1 (SEPTEMBER INTAKE)" },
  { code: "TB", description: "TRIMESTER 2 (SEPTEMBER INTAKE)" },
  { code: "TC", description: "TRIMESTER 3 (SEPTEMBER INTAKE)" },
  { code: "X1", description: "SESSION 1 (FEBRUARY INTAKE)" },
  { code: "X2", description: "SESSION 2 (FEBRUARY INTAKE)" },
];

const BlockCodeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 transition-opacity fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-teal-700 tracking-tight">Block Codes Explanation</h2>
          <p className="mb-4 text-sm sm:text-base text-gray-600">Below is a list of block codes and their corresponding descriptions to help you understand the timetable structure.</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar border border-gray-200 rounded-xl">
          <table className="w-full text-sm sm:text-base text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-4 font-semibold text-gray-700 border-b border-gray-200 w-1/3">Block Code</th>
                <th className="p-4 font-semibold text-gray-700 border-b border-gray-200">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blockCodeData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-teal-700">{item.code}</td>
                  <td className="p-4 text-gray-600">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-shrink-0 mt-6 sm:mt-8">
          <button
            onClick={onClose}
            className="w-full py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockCodeModal;