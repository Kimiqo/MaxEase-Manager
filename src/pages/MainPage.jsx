import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import domtoimage from "dom-to-image";
import * as XLSX from "xlsx";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import DeveloperBadge from "../components/DeveloperBadge";
import { FiMenu, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "../components/exam/SearchBar";
import TimetableTable from "../components/exam/TimetableTable";
import MiniTimetable from "../components/exam/MiniTimetable";
import HowToUseModal from "../components/exam/HowToUseModal";
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

function MainPage() {
  const [timetableData, setTimetableData] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [blockCodeFilter, setBlockCodeFilter] = useState("");
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

  useEffect(() => {
    const fetchTimetableData = async () => {
      setIsLoading(true);
      try {
        const proxyUrl = `https://max-ease-manager.vercel.app/api/exam-timetable?campus=${campus}`;
        console.log(`Fetching exam timetable for ${campus} from: ${proxyUrl}`);
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
          row.some((cell) => cell === "Block Code")
        );
        if (headerRowIndex === -1) throw new Error("Header row with 'Block Code' not found.");

        const headers = jsonData[headerRowIndex];
        const dataRows = jsonData.slice(headerRowIndex + 1).filter(
          (row) => row.length > 0 && row[0]
        );

        const excelSerialToDate = (serial) => {
          if (typeof serial !== "number" || isNaN(serial)) return serial || "";
          const excelEpoch = new Date(Date.UTC(1900, 0, 0));
          const daysOffset = serial - 1;
          const date = new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, "0");
          const day = String(date.getUTCDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const formattedData = dataRows.map((row, index) => {
          const rawDate = row[headers.indexOf("Exams Date")];
          const examsDate = excelSerialToDate(rawDate);
          return {
            id: `exam_${index}`,
            blockCode: row[headers.indexOf("Block Code")] || "",
            examsDay: row[headers.indexOf("Exams Day")] || "",
            examsDate: examsDate,
            examsTime: row[headers.indexOf("Exams Time")] || "",
            examsVenue: row[headers.indexOf("Exams Venue")] || "",
            courseCode: row[headers.indexOf("Course Code")] || "",
            courseName: row[headers.indexOf("Course Name")] || "",
            period: row[headers.indexOf("Period")] || "",
            mode: row[headers.indexOf("Mode")] || "",
            programmeCode: row[headers.indexOf("Programme Code")] || "",
            classSize: row[headers.indexOf("Class Size")] || 0,
            lecturerName: row[headers.indexOf("Lecturer/Examiner Name")] || "",
            combinedExams: row[headers.indexOf("Combined Exams")] || "",
          };
        });

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

  const filteredTimetable = timetableData.filter((exam) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = [
      exam.courseName,
      exam.courseCode,
      exam.blockCode,
      exam.lecturerName,
      exam.programmeCode,
    ].some((field) => String(field || "").toLowerCase().includes(q));

    const matchesDate = dateFilter
      ? String(exam.examsDate || "").toLowerCase().includes(String(dateFilter || "").toLowerCase())
      : true;

    const matchesBlockCode = blockCodeFilter
      ? String(exam.blockCode || "").toLowerCase() === String(blockCodeFilter || "").toLowerCase()
      : true;

    return matchesSearch && matchesDate && matchesBlockCode;
  });

  const toggleCourseSelection = (exam) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.some((course) => course.id === exam.id);
      if (isSelected) {
        return prev.filter((course) => course.id !== exam.id);
      } else {
        return [...prev, exam];
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourses((prev) => {
      const newCourses = filteredTimetable.filter(
        (exam) => !prev.some((course) => course.id === exam.id)
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
        link.download = `mini_timetable_${campus}.png`;
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
            Exam Timetable • {campus.charAt(0).toUpperCase() + campus.slice(1)}
          </h1>
        </div>
        <div className="hidden sm:flex gap-4 mt-4 sm:mt-0">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg border-2 border-white hover:bg-gray-900 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(75,85,99,0.7)]"
          >
            Back to Campus Selection
          </Link>
          <button
            onClick={() => { openModal(); setMobileMenuOpen(false); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(59,130,246,0.7)]"
          >
            How to Use
          </button>
          <button
            onClick={() => { openBlockCodeModal(); setMobileMenuOpen(false); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(147,51,234,0.7)]"
          >
            Block Codes Explanation
          </button>
          <Link
            to={`/lecture?campus=${campus}`}
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_0_10px_rgba(34,197,94,0.7)]"
          >
            View Lecture Timetable
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
            <Link to={`/lecture?campus=${campus}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">View Lecture Timetable</Link>
          </div>
        )}
      </header>

      <div className="flex-1 pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 tracking-wide">
          Exam Scheduling Made Easy
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Loading timetable data for {campus}...
          </p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center">
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
              <div className="w-full sm:w-3/5">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <div className="w-full sm:w-1/5">
                <DatePicker
                  selected={dateFilter ? new Date(dateFilter) : null}
                  onChange={(date) =>
                    setDateFilter(date ? date.toISOString().split("T")[0] : "")
                  }
                  placeholderText="Select exam date (e.g., 2025-05-11)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base backdrop-blur-sm"
                  dateFormat="yyyy-MM-dd"
                />
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
                selectAllCourses={selectAllCourses}
                deselectAllCourses={deselectAllCourses}
              />
            </div>
            {selectedCourses.length > 0 && (
              <div className="w-full px-4 sm:px-6 mt-8">
                <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} />
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

export default MainPage;