import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import domtoimage from "dom-to-image";
import * as XLSX from "xlsx";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import DeveloperBadge from "../components/DeveloperBadge";
import { FiMenu, FiX } from "react-icons/fi";
import SearchBar from "../components/lecture/SearchBar";
import TimetableTable from "../components/lecture/TimetableTable";
import MiniTimetable from "../components/lecture/MiniTimetable";
import HowToUseModal from "../components/lecture/HowToUseModal";
import BlockCodeModal from "../components/BlockCodeModal";
import LecturerSummaryModal from "../components/lecture/LecturerSummaryModal";

// Custom CSS for animations
const styles = `
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Mapping of block codes to periods
const blockToPeriod = {
  "A1": "SEMESTER 1",
  "A2": "SEMESTER 2",
  "A5": "SEMESTER 1",
  "A6": "SEMESTER 2",
  "B1": "QUARTER 1",
  "B2": "QUARTER 2",
  "B3": "QUARTER 3",
  "B4": "QUARTER 4",
  "BA": "QUARTER 1 REGULAR",
  "BB": "QUARTER 2 REGULAR",
  "BC": "QUARTER 3 REGULAR",
  "BD": "QUARTER 4 REGULAR",
  "F1": "SEMESTER 1",
  "F2": "SEMESTER 2",
  "JA": "MODULAR SESSION 1",
  "JB": "MODULAR SESSION 2",
  "JK": "MODULAR SESSION 3 FINAL",
  "T1": "TRIMESTER 1",
  "T2": "TRIMESTER 2",
  "T3": "TRIMESTER 3",
  "TA": "TRIMESTER 1 (REGULAR)",
  "TB": "TRIMESTER 2 (REGULAR)",
  "TC": "TRIMESTER 3 (REGULAR)",
  "X1": "SESSION 1",
  "X2": "SESSION 2",
};

// Mapping of period values to display names
const periodDisplayNames = {
  "QUARTER 1": "Quarter 1",
  "QUARTER 2": "Quarter 2",
  "QUARTER 3": "Quarter 3",
  "QUARTER 4": "Quarter 4",
  "QUARTER 1 REGULAR": "Quarter 1 (Regular)",
  "QUARTER 2 REGULAR": "Quarter 2 (Regular)",
  "QUARTER 3 REGULAR": "Quarter 3 (Regular)",
  "QUARTER 4 REGULAR": "Quarter 4 (Regular)",
  "SEMESTER 1": "Semester 1",
  "SEMESTER 2": "Semester 2",
  "MODULAR SESSION 1": "Modular Session 1",
  "MODULAR SESSION 2": "Modular Session 2",
  "MODULAR SESSION 3 FINAL": "Modular Session 3 (Final)",
  "TRIMESTER 1": "Trimester 1",
  "TRIMESTER 2": "Trimester 2",
  "TRIMESTER 3": "Trimester 3",
  "TRIMESTER 1 (REGULAR)": "Trimester 1 (Regular)",
  "TRIMESTER 2 (REGULAR)": "Trimester 2 (Regular)",
  "TRIMESTER 3 (REGULAR)": "Trimester 3 (Regular)",
  "SESSION 1": "Session 1",
  "SESSION 2": "Session 2",
};

// Extract level from ProgrammeCode
const getLevelFromProgrammeCode = (programmeCode) => {
  if (programmeCode === null || programmeCode === undefined) return null;
  const codeStr = String(programmeCode);
  const match = codeStr.match(/\d{3}/);
  if (match) {
    const level = parseInt(match[0], 10);
    if (level >= 100 && level <= 900 && level % 100 === 0) {
      return level;
    }
  }
  return null;
};

const weekOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "FRI - SUN"];

const blockCodes = [
  "A1", "A2", "A5", "A6",
  "B1", "B2", "B3", "B4",
  "BA", "BB", "BC", "BD",
  "F1", "F2",
  "JA", "JB", "JK",
  "T1", "T2", "T3",
  "TA", "TB", "TC",
  "X1", "X2"
].sort();

function LectureTimetablePage() {
  const [timetableData, setTimetableData] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockCodeFilter, setBlockCodeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBlockCodeModal, setShowBlockCodeModal] = useState(false);
  const [showLecturerSummary, setShowLecturerSummary] = useState(false);
  const [showMiniTimetableModal, setShowMiniTimetableModal] = useState(false);
  const miniTimetableRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campus = searchParams.get("campus") || "accra"; // Default to Accra

  // Extract unique block codes for the filter dropdown
  const uniqueBlockCodes = blockCodes;

  // Extract unique levels for the filter dropdown
  const uniqueLevels = [
    ...new Set(timetableData.map((lecture) => getLevelFromProgrammeCode(lecture.ProgrammeCode))),
  ]
    .filter((level) => level !== null)
    .sort((a, b) => a - b);

  // Extract unique days for the filter dropdown
  const uniqueDays = [...new Set(timetableData.map((lecture) => lecture.Day))]
    .filter((day) => day && weekOrder.includes(day))
    .sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

  useEffect(() => {
    const fetchTimetableData = async () => {
      setIsLoading(true);
      try {
        const proxyUrl = `http://localhost:3001/lecture-timetable?campus=${campus}`;
        console.log(`Fetching lecture timetable for ${campus} from: ${proxyUrl}`);
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `${response.status} ${response.statusText}`;
          throw new Error(`Failed to fetch timetable for ${campus}: ${errorMessage}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

        let headerRowIndex = jsonData.findIndex((row) =>
          row.some((cell) => cell === "Course Code")
        );
        if (headerRowIndex === -1) throw new Error("Header row with 'Course Code' not found.");

        const headers = jsonData[headerRowIndex];
        const dataRows = jsonData.slice(headerRowIndex + 1).filter(
          (row) => row.length > 0 && row[0]
        );

        const formattedData = dataRows
          .map((row, index) => {
            const block = row[headers.indexOf("Block")] || "TBA";
            return {
              id: `lecture_${index}`,
              CourseCode: row[headers.indexOf("Course Code")] || "N/A",
              CourseName: row[headers.indexOf("Course Name")] || "N/A",
              Period: blockToPeriod[block] || "N/A",
              Mode: row[headers.indexOf("Mode")] || "N/A",
              ProgrammeCode: row[headers.indexOf("Programme Code")] || "N/A",
              ClassSize: row[headers.indexOf("Class Size")] || 0,
              CreditHours: row[headers.indexOf("CreditHours")] || "3",
              LectureRoom: row[headers.indexOf("Lecture Room")] || "TBA",
              Time: row[headers.indexOf("Time")] || "Not Scheduled",
              LecturerName: row[headers.indexOf("Lecturer Name")] || "TBA",
              Day: row[headers.indexOf("Day")] || "Not Scheduled",
              Block: block,
            };
          })
          .filter((lecture) => !lecture.Period.toLowerCase().includes("period"));

        setTimetableData(formattedData);
      } catch (error) {
        console.error(`Error fetching timetable for ${campus}:`, error);
        alert(
          `Failed to load timetable data for ${campus}: ${error.message}. Please check your internet connection or ensure the backend server is running.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetableData();
  }, [campus]);

  useEffect(() => {
    if (showMiniTimetableModal || showModal || showBlockCodeModal || showLecturerSummary) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMiniTimetableModal, showModal, showBlockCodeModal, showLecturerSummary]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredTimetable = timetableData.filter((lecture) => {
    const matchesSearch = [
      lecture.CourseName,
      lecture.CourseCode,
      lecture.Block,
      lecture.LecturerName,
      lecture.ProgrammeCode,
      lecture.LectureRoom,
      lecture.Day,
    ].some((field) => field.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBlockCode = blockCodeFilter
      ? lecture.Block.toLowerCase() === blockCodeFilter.toLowerCase()
      : true;

    const matchesLevel = levelFilter
      ? getLevelFromProgrammeCode(lecture.ProgrammeCode) === parseInt(levelFilter, 10)
      : true;

    const matchesDay = dayFilter
      ? lecture.Day === dayFilter
      : true;

    return matchesSearch && matchesBlockCode && matchesLevel && matchesDay;
  });

  const toggleCourseSelection = (lecture) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.some((course) => course.id === lecture.id);
      if (isSelected) {
        return prev.filter((course) => course.id !== lecture.id);
      } else {
        return [...prev, lecture];
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourses((prev) => {
      const newCourses = filteredTimetable.filter(
        (lecture) => !prev.some((course) => course.id === lecture.id)
      );
      return [...prev, ...newCourses];
    });
  };

  const deselectAllCourses = () => {
    setSelectedCourses([]);
  };

  const downloadMiniTimetable = () => {
    if (!miniTimetableRef.current) return alert("No mini-timetable available to download.");
    domtoimage
      .toPng(miniTimetableRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `mini_lecture_timetable_${campus}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating image:", error);
        alert("Failed to generate timetable image. Please try again.");
      });
  };

  const scrollToMiniTimetable = () => {
    miniTimetableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openBlockCodeModal = () => setShowBlockCodeModal(true);
  const closeBlockCodeModal = () => setShowBlockCodeModal(false);

  const openLecturerSummary = () => setShowLecturerSummary(true);
  const closeLecturerSummary = () => setShowLecturerSummary(false);
  const openMiniTimetableModal = () => setShowMiniTimetableModal(true);
  const closeMiniTimetableModal = () => setShowMiniTimetableModal(false);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-full overflow-x-hidden">
      <style>{styles}</style>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-screen-2xl z-50 bg-gradient-to-r from-blue-900/85 to-teal-800/85 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-6 py-3 flex flex-col sm:flex-row justify-between items-center transition-all">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-white/10 rounded-xl p-1.5 shadow-sm border border-white/20">
            <img src="/logo.jpg" alt="GIMPA" className="w-10 h-10 object-contain rounded" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Lecture Timetable <span className="text-white/50 font-normal mx-1">|</span> <span className="text-teal-300 font-medium">{campus.charAt(0).toUpperCase() + campus.slice(1)}</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-3 mt-4 sm:mt-0">
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm shadow-sm"
          >
            Campus Selection
          </Link>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm shadow-sm"
          >
            How to Use
          </button>
          <button
            onClick={openBlockCodeModal}
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm shadow-sm"
          >
            Block Codes
          </button>
          <button
            onClick={openLecturerSummary}
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm shadow-sm"
          >
            Lecturer Load
          </button>
          <Link
            to={`/exam?campus=${campus}`}
            className="px-5 py-2 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-100 transition-all text-sm shadow-md hover:shadow-lg ml-2"
          >
            Exam Timetable →
          </Link>
        </div>

        <div className="sm:hidden ml-2">
          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 right-4 z-40 w-56 bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg shadow-lg border border-white/10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">Back to Campus Selection</Link>
            <button onClick={() => { openModal(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white rounded hover:bg-white/5">How to Use</button>
            <button onClick={() => { openBlockCodeModal(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white rounded hover:bg-white/5">Block Codes Explanation</button>
            <button onClick={() => { openLecturerSummary(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white rounded hover:bg-white/5">Lecturer Load</button>
            <Link to={`/exam?campus=${campus}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">View Exam Timetable</Link>
          </div>
        )}
      </header>

      <div className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 max-w-screen-2xl mx-auto w-full fade-in">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          Find your lectures
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Loading timetable data for {campus}...
          </p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Block Code</label>
                <select
                  value={blockCodeFilter}
                  onChange={(e) => setBlockCodeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  <option value="">All Blocks</option>
                  {uniqueBlockCodes.map((code) => (
                    <option key={code} value={code}>
                      {code} {blockToPeriod[code] ? `- ${periodDisplayNames[blockToPeriod[code]]}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Level</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  <option value="">All Levels</option>
                  {uniqueLevels.map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Day</label>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  <option value="">All Days</option>
                  {uniqueDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Search</label>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h4 className="text-lg font-medium text-gray-700">
                {filteredTimetable.length} {filteredTimetable.length === 1 ? 'class' : 'classes'} found
              </h4>
              {selectedCourses.length > 0 && (
                <button
                  onClick={openMiniTimetableModal}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>View Selected</span>
                  <span className="bg-white text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">{selectedCourses.length}</span>
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <TimetableTable
                timetableData={filteredTimetable}
                selectedCourses={selectedCourses}
                toggleCourseSelection={toggleCourseSelection}
                isLecture={true}
                selectAllCourses={selectAllCourses}
                deselectAllCourses={deselectAllCourses}
              />
            </div>
            {/* Mini Timetable is now rendered in the modal */}
          </>
        ) : (
          <p className="text-center text-gray-400 text-sm sm:text-base">
            No timetable data available for {campus}. Please check back later.
          </p>
        )}
      </div>

      <DeveloperBadge />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 p-3 sm:p-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-sm sm:text-base"
        >
          ↑ Top
        </button>
      )}

      <HowToUseModal isOpen={showModal} onClose={closeModal} />
      <BlockCodeModal isOpen={showBlockCodeModal} onClose={closeBlockCodeModal} />
      <LecturerSummaryModal isOpen={showLecturerSummary} onClose={closeLecturerSummary} timetableData={timetableData} />

      {/* Mini Timetable Modal */}
      {showMiniTimetableModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
          <div className="relative w-full h-full max-h-screen bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden fade-in border border-gray-200">
            <div className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Your Selected Courses</h3>
              <button onClick={closeMiniTimetableModal} className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
              <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} isLecture={true} />
              </div>
            </div>
            
            <div className="p-6 bg-white border-t border-gray-200 flex justify-end gap-4 items-center">
              <button
                onClick={closeMiniTimetableModal}
                className="px-6 py-2.5 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={downloadMiniTimetable}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Download Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LectureTimetablePage;