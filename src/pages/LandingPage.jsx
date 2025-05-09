import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 animate-pulse">
        MaxEase
      </h1>
      
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Transform your exam chaos into seamless schedules with a single upload.
      </p>

      <Link to="/exam">
        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300">
          Get Started
        </button>
      </Link>

      <footer className="mt-12 text-gray-400 text-sm">
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

export default LandingPage;