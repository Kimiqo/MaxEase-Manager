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
  const [showMiniTimetableModal, setShowMiniTimetableModal] = useState(false);
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
    if (showMiniTimetableModal || showModal || showBlockCodeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMiniTimetableModal, showModal, showBlockCodeModal]);

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
            Exam Timetable <span className="text-white/50 font-normal mx-1">|</span> <span className="text-teal-300 font-medium">{campus.charAt(0).toUpperCase() + campus.slice(1)}</span>
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
          <Link
            to={`/lecture?campus=${campus}`}
            className="px-5 py-2 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-100 transition-all text-sm shadow-md hover:shadow-lg ml-2"
          >
            Lecture Timetable →
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
            <Link to={`/lecture?campus=${campus}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white rounded hover:bg-white/5">View Lecture Timetable</Link>
          </div>
        )}
      </header>

      <div className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 max-w-screen-2xl mx-auto w-full fade-in">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          Find your exams
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm sm:text-base">
            Loading timetable data for {campus}...
          </p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-1/3">
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
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Search</label>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">Date</label>
                <DatePicker
                  selected={dateFilter ? new Date(dateFilter) : null}
                  onChange={(date) =>
                    setDateFilter(date ? date.toISOString().split("T")[0] : "")
                  }
                  placeholderText="Filter by Date"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium cursor-pointer"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h4 className="text-lg font-medium text-gray-700">
                {filteredTimetable.length} {filteredTimetable.length === 1 ? 'exam' : 'exams'} found
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

      {/* Mini Timetable Modal */}
      {showMiniTimetableModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
          <div className="relative w-full h-full max-h-screen bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden fade-in border border-gray-200">
            <div className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Your Selected Exams</h3>
              <button onClick={closeMiniTimetableModal} className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
              <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} />
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

export default MainPage;