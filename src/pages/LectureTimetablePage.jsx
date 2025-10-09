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

// Custom CSS for sheen effect
const styles = `
  .sheen-effect {
    position: relative;
    overflow: hidden;
  }
  .sheen-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: sheen 3s infinite;
  }
  @keyframes sheen {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
  .sheen-effect:hover::before {
    animation: sheen 1.5s ease-in-out;
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
  if (!programmeCode) return null;
  const match = programmeCode.match(/\d{3}/);
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
        const proxyUrl = `https://max-ease-manager.vercel.app/api/lecture-timetable?campus=${campus}`;
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

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-full overflow-x-hidden">
      <style>{styles}</style>
      <header className="fixed top-0 left-0 w-full max-w-full z-50 bg-gradient-to-r from-gray-900 to-gray-700 backdrop-blur-md p-4 sm:p-6 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-b border-blue-500/30 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-md">
            <img src="/logo.jpg" alt="GIMPA" className="w-8 h-8 object-cover rounded" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
            Lecture Timetable • {campus.charAt(0).toUpperCase() + campus.slice(1)}
          </h1>
        </div>
        <div className="hidden sm:flex gap-4 mt-4 sm:mt-0">
        <Link
            to="/"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg border-2 border-white hover:bg-gray-900 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(75,85,99,0.7)]"
          >
            Back to Campus Selection
          </Link>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(59,130,246,0.7)]"
          >
            How to Use
          </button>
          <button
            onClick={openBlockCodeModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(147,51,234,0.7)]"
          >
            Block Codes Explanation
          </button>
          <Link
            to={`/exam?campus=${campus}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(34,197,94,0.7)]"
          >
            View Exam Timetable
          </Link>
        </div>

        <div className="sm:hidden ml-2">
          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white/6 text-white"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 right-4 z-40 w-56 bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-lg shadow-lg border border-white/10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">Back to Campus Selection</Link>
            <button onClick={() => { openModal(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white rounded hover:bg-white/5">How to Use</button>
            <button onClick={() => { openBlockCodeModal(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white rounded hover:bg-white/5">Block Codes Explanation</button>
            <Link to={`/exam?campus=${campus}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">View Exam Timetable</Link>
          </div>
        )}
      </header>

      <div className="flex-1 pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 tracking-wide">
          Lecture Scheduling Made Easy
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Loading timetable data for {campus}...
          </p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="w-full sm:w-1/5">
                <select
                  value={blockCodeFilter}
                  onChange={(e) => setBlockCodeFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base backdrop-blur-sm"
                >
                  <option value="">All Block Codes</option>
                  {uniqueBlockCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-2/5">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <div className="w-full sm:w-1/5">
                <div
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base backdrop-blur-sm bg-gray-100 overflow-hidden whitespace-normal break-words"
                >
                  {`Period: ${blockCodeFilter ? periodDisplayNames[blockToPeriod[blockCodeFilter]] || "N/A" : "N/A"}`}
                </div>
              </div>
              <div className="w-full sm:w-1/5">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base backdrop-blur-sm"
                >
                  <option value="">All Levels</option>
                  {uniqueLevels.map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/5">
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base backdrop-blur-sm"
                >
                  <option value="">All Days</option>
                  {uniqueDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center">
              {selectedCourses.length > 0 && (
                <>
                  <button
                    onClick={downloadMiniTimetable}
                    className="w-full sm:w-auto px-4 py-2 sm:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                  >
                    Download Mini-Timetable as PNG
                  </button>
                  <button
                    onClick={scrollToMiniTimetable}
                    className="w-full sm:w-auto px-4 py-2 sm:p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(59,130,246,0.7)]"
                  >
                    View Mini-Timetable
                  </button>
                </>
              )}
            </div>
            <div className="max-w-10xl mx-auto sheen-effect bg-gradient-to-br from-blue-200 to-gray-900 backdrop-blur-md p-4 sm:p-3 rounded-xl shadow-[0_8px_32px_rgba(59,130,246,0.3)] border border-blue-500/30 hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] transition-shadow duration-300">
              <TimetableTable
                timetableData={filteredTimetable}
                selectedCourses={selectedCourses}
                toggleCourseSelection={toggleCourseSelection}
                isLecture={true}
                selectAllCourses={selectAllCourses}
                deselectAllCourses={deselectAllCourses}
              />
            </div>
            {selectedCourses.length > 0 && (
              <div className="w-full px-4 sm:px-6 mt-8">
                <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} isLecture={true} />
              </div>
            )}
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
    </div>
  );
}

export default LectureTimetablePage;