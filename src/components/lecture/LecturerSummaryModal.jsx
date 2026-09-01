import React, { useState, useMemo } from "react";
import { FiX, FiSearch, FiBookOpen } from "react-icons/fi";

const LecturerSummaryModal = ({ isOpen, onClose, timetableData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const summaryData = useMemo(() => {
    const lecturerMap = {};

    timetableData.forEach(course => {
      const lecturer = course.LecturerName?.trim();
      if (!lecturer || lecturer.toLowerCase() === "tba" || lecturer === "N/A") return;
      
      const block = course.Block || "TBA";
      const courseCode = course.CourseCode;
      const courseName = course.CourseName;

      if (!lecturerMap[lecturer]) {
        lecturerMap[lecturer] = { blocks: {} };
      }
      
      if (!lecturerMap[lecturer].blocks[block]) {
        lecturerMap[lecturer].blocks[block] = new Map();
      }
      
      if (!lecturerMap[lecturer].blocks[block].has(courseCode)) {
        lecturerMap[lecturer].blocks[block].set(courseCode, {
          code: courseCode,
          name: courseName
        });
      }
    });

    const data = Object.keys(lecturerMap).map(lecturer => {
      let totalClasses = 0;
      const blockBreakdown = [];
      Object.keys(lecturerMap[lecturer].blocks).sort().forEach(block => {
        const courses = Array.from(lecturerMap[lecturer].blocks[block].values());
        totalClasses += courses.length;
        blockBreakdown.push({ block, courses });
      });

      return {
        lecturerName: lecturer,
        totalClasses,
        blockBreakdown
      };
    });

    // Sort alphabetically by default
    return data.sort((a, b) => a.lecturerName.localeCompare(b.lecturerName));
  }, [timetableData]);

  // Only show results if the user has typed something
  const filteredData = searchTerm.trim() === "" 
    ? [] 
    : summaryData.filter(item => item.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity fade-in">
      <div className="relative w-full h-full max-h-screen bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden fade-in border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Lecturer Load Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Search for a lecturer to see their assigned classes grouped by block.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors self-start">
            <FiX size={24} />
          </button>
        </div>
        
        {/* Search */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center shadow-sm z-10 gap-4">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Start typing a lecturer's name to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm"
              autoFocus
            />
          </div>
          {searchTerm.trim() !== "" && (
            <div className="text-sm text-gray-500 font-medium">
              Found {filteredData.length} {filteredData.length === 1 ? 'match' : 'matches'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {searchTerm.trim() === "" ? (
              <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center">
                <FiSearch className="text-gray-300 w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Ready to search</h3>
                <p className="text-gray-500 mt-2 max-w-md">Type a lecturer's name in the search bar above to view their detailed course load and block schedule.</p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="space-y-6">
                {filteredData.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-green-600 p-4 sm:px-6 flex justify-between items-center">
                      <h4 className="text-xl font-bold text-white tracking-tight">{item.lecturerName}</h4>
                      <span className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        Total Classes: {item.totalClasses}
                      </span>
                    </div>
                    <div className="p-4 sm:p-6 divide-y divide-gray-100">
                      {item.blockBreakdown.map((b, i) => (
                        <div key={i} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-3">
                            <h5 className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 inline-block">
                              Block: <span className="text-green-700 font-bold">{b.block}</span>
                            </h5>
                            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                              {b.courses.length} {b.courses.length === 1 ? 'class' : 'classes'}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {b.courses.map((c, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-3 pl-2 group">
                                <FiBookOpen className="text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                  <span className="font-bold text-gray-800 group-hover:text-green-700 transition-colors mr-2">{c.code}</span>
                                  <span className="text-gray-600 font-medium">{c.name}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center">
                <p className="text-lg text-gray-500 font-medium">No lecturers found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LecturerSummaryModal;
