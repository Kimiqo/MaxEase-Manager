// src/App.js
import React, { useState, useRef } from "react";
import domtoimage from 'dom-to-image';
import FileUpload from "./components/FileUpload";
import SearchBar from "./components/SearchBar";
import TimetableTable from "./components/TimetableTable";
import MiniTimetable from "./components/MiniTimetable";

function App() {
  const [timetableData, setTimetableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const miniTimetableRef = useRef(null); // Ref for MiniTimetable table

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
  
    domtoimage.toPng(miniTimetableRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'mini_timetable.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating image:', error);
        alert('Failed to generate timetable image. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        MaxEase Exam Timetable Management
      </h1>

      <FileUpload onDataParsed={setTimetableData} setIsLoading={setIsLoading} />

      {isLoading ? (
        <p className="text-center text-gray-500">Processing Excel file...</p>
      ) : timetableData.length > 0 ? (
        <>
          {selectedCourses.length > 0 && (
            <div className="max-w-2xl mx-auto mb-6">
              <button
                onClick={downloadMiniTimetable}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Download Mini-Timetable as PNG
              </button>
            </div>
          )}

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
  );
}

export default App;