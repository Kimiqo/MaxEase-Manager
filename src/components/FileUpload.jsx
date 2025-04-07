// src/components/FileUpload.js
import React from "react";
import * as XLSX from "xlsx";

function FileUpload({ onDataParsed, setIsLoading }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Find header row dynamically
      let headerRowIndex = jsonData.findIndex((row) =>
        row.some((cell) => cell === "Block Code")
      );
      if (headerRowIndex === -1) {
        alert("Header row with 'Block Code' not found.");
        setIsLoading(false);
        return;
      }

      const headers = jsonData[headerRowIndex];
      const dataRows = jsonData
        .slice(headerRowIndex + 1)
        .filter((row) => row.length > 0 && row[0]);

      const formattedData = dataRows.map((row) => ({
        blockCode: row[headers.indexOf("Block Code")] || "",
        examsDay: row[headers.indexOf("Exams Day")] || "",
        examsDate: row[headers.indexOf("Exams Date")] || "",
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
      }));

      onDataParsed(formattedData);
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <label className="block text-lg font-medium mb-2">
        Upload Exam Timetable (Excel File):
      </label>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="w-full p-3 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      />
    </div>
  );
}

export default FileUpload;