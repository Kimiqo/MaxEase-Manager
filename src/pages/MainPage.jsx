// src/pages/MainPage.js
import React, { useState, useRef, useEffect } from "react";
import domtoimage from "dom-to-image";
import * as XLSX from "xlsx";
import SearchBar from "../components/SearchBar";
import TimetableTable from "../components/TimetableTable";
import MiniTimetable from "../components/MiniTimetable";
import HowToUseModal from "../components/HowToUseModal";

function MainPage() {
  const [timetableData, setTimetableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const miniTimetableRef = useRef(null);

  useEffect(() => {
    const fetchTimetableData = async () => {
      setIsLoading(true);
      try {
        const proxyUrl = "http://localhost:3001/timetable";
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Failed to fetch timetable from proxy");
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
        const dataRows = jsonData.slice(headerRowIndex + 1).filter((row) => row.length > 0 && row[0]);

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

        const formattedData = dataRows.map((row) => {
          const rawDate = row[headers.indexOf("Exams Date")];
          const examsDate = excelSerialToDate(rawDate);
          return {
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
        console.error("Error fetching timetable:", error);
        alert("Failed to load timetable data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetableData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredTimetable = timetableData.filter((exam) =>
    [exam.courseName, exam.courseCode, exam.blockCode, exam.lecturerName, exam.programmeCode].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleCourseSelection = (exam) => {
    setSelectedCourses((prev) =>
      prev.includes(exam) ? prev.filter((c) => c !== exam) : [...prev, exam]
    );
  };

  const downloadMiniTimetable = () => {
    if (!miniTimetableRef.current) return alert("No mini-timetable available to download.");
    domtoimage
      .toPng(miniTimetableRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "mini_timetable.png";
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 animate-pulse text-center sm:text-left">
          MaxEase Exam Timetable Management
        </h1>
        <button
          onClick={openModal}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base"
        >
          How to Use
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 pb-16">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 animate-pulse tracking-wide">
          Exam Scheduling Made Easy
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-500 text-sm sm:text-base">Loading timetable data...</p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center">
              {selectedCourses.length > 0 && (
                <>
                  <button
                    onClick={downloadMiniTimetable}
                    className="w-full sm:w-auto px-4 py-2 sm:p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                  >
                    Download Mini-Timetable as PNG
                  </button>
                  <button
                    onClick={scrollToMiniTimetable}
                    className="w-full sm:w-auto px-4 py-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                  >
                    View Mini-Timetable
                  </button>
                </>
              )}
            </div>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="overflow-x-auto">
              <TimetableTable
                timetableData={filteredTimetable}
                selectedCourses={selectedCourses}
                toggleCourseSelection={toggleCourseSelection}
              />
            </div>
            {selectedCourses.length > 0 && (
              <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} />
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No timetable data available. Please check back later.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 text-center shadow-lg text-xs sm:text-sm">
        <p>
          Developed by Michael Darko • © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/Kimiqo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            GitHub
          </a>{" "}
          {" "}
          <a
            href="mailto:michael12darko@gmail.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Contact
          </a>
        </p>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 p-3 sm:p-4 bg-black text-white rounded-2xl shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-sm sm:text-base"
        >
          ↑ Top
        </button>
      )}

      {/* How to Use Modal */}
      <HowToUseModal isOpen={showModal} onClose={closeModal} />
    </div>
  );
}

export default MainPage;