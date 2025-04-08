import React, { useState, useRef } from "react";
import domtoimage from "dom-to-image";
import FileUpload from "../components/FileUpload";
import SearchBar from "../components/SearchBar";
import TimetableTable from "../components/TimetableTable";
import MiniTimetable from "../components/MiniTimetable";

function MainPage() {
  const [timetableData, setTimetableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const miniTimetableRef = useRef(null);

  // Filter timetable based on search term
  const filteredTimetable = timetableData.filter((exam) =>
    [
      exam.courseName,
      exam.courseCode,
      exam.blockCode,
      exam.lecturerName,
      exam.programmeCode,
    ].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Toggle course selection
  const toggleCourseSelection = (exam) => {
    if (selectedCourses.includes(exam)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== exam));
    } else {
      setSelectedCourses([...selectedCourses, exam]);
    }
  };

  // Download MiniTimetable as PNG
  const downloadMiniTimetable = () => {
    if (!miniTimetableRef.current) {
      alert("No mini-timetable available to download.");
      return;
    }

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

  // Scroll to MiniTimetable
  const scrollToMiniTimetable = () => {
    if (miniTimetableRef.current) {
      miniTimetableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold text-center tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 animate-pulse">
          MaxEase Exam Timetable Management
        </h1>
      </header>

      <div className="flex-1 p-6 pb-16">
        <FileUpload onDataParsed={setTimetableData} setIsLoading={setIsLoading} />

        {isLoading ? (
          <p className="text-center text-gray-500">Processing Excel file...</p>
        ) : timetableData.length > 0 ? (
          <>
            <div className="max-w-2xl mx-auto mb-6 flex flex-col sm:flex-row gap-4">
              {selectedCourses.length > 0 && (
                <>
                  <button
                    onClick={downloadMiniTimetable}
                    className="w-full sm:w-auto p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Download Mini-Timetable as PNG
                  </button>
                  <button
                    onClick={scrollToMiniTimetable}
                    className="w-full sm:w-auto p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Mini-Timetable
                  </button>
                </>
              )}
            </div>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <TimetableTable
              timetableData={filteredTimetable}
              selectedCourses={selectedCourses}
              toggleCourseSelection={toggleCourseSelection}
            />
            {selectedCourses.length > 0 && (
              <MiniTimetable ref={miniTimetableRef} selectedCourses={selectedCourses} />
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">
            Please upload an Excel file to view the timetable.
          </p>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 text-center shadow-lg">
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
    </div>
  );
}

export default MainPage;