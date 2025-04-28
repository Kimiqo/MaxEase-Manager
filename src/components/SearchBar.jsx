// src/components/SearchBar.js
import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="max-w-2xl mx-auto mb-6">
      <input
        type="text"
        placeholder="Search by course name, date, course code, block, programme code, lecturer or class size..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;