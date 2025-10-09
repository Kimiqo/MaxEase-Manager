import React from "react";
import { Link } from "react-router-dom";
import { FaUniversity, FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";

function LandingPage() {
  const campuses = [
    { name: "Accra - Greenhill Campus", icon: FaUniversity, path: "/lecture?campus=accra" },
    { name: "Tema Campus", icon: FaUniversity, path: "/lecture?campus=tema" },
    { name: "Kumasi Campus", icon: FaUniversity, path: "/lecture?campus=kumasi" },
    { name: "Takoradi Campus", icon: FaUniversity, path: "/lecture?campus=takoradi" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-6 relative">

      {/* New header: logo tile + two-line title + decorative gradient bar */}
      <header className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-md">
            <img src="/logo.jpg" alt="GIMPA" className="w-32 h-32 object-cover rounded" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              GIMPA
              <span className="block text-lg sm:text-xl md:text-2xl font-normal text-gray-200">Timetable Manager</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Organize lectures and exams with ease</p>
          </div>
        </div>

        <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 opacity-80" />
      </header>

      <b><p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Select your campus to get started.
      </p></b>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mb-8">
        {campuses.map((campus) => {
          const Icon = campus.icon;
          return (
            <Link
              key={campus.name}
              to={campus.path}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-4"
            >
              <Icon className="text-2xl text-blue-400" />
              <span className="text-lg font-semibold text-white">{campus.name}</span>
            </Link>
          );
        })}
      </div>
      {/* Floating developer badge */}
      <div className="fixed right-6 bottom-6 bg-white/6 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg flex items-center gap-3 hover:scale-105 transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-semibold">MD</div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold">Michael Darko</div>
            <div className="text-xs text-gray-300">Developer</div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <a href="https://github.com/Kimiqo" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="mailto:michael12darko@gmail.com" className="text-blue-300 hover:text-blue-200" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://www.linkedin.com/in/mkkd-michael-darko/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


