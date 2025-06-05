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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 animate-pulse">
        MaxEase Manager
      </h1>
      
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Transform your exam and lecture chaos into seamless schedules with a single upload across multiple campuses.
      </p>
      
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Select your campus to get started.
      </p>

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

      <footer className="mt-12 text-white text-sm">
        <p className="flex justify-center items-center gap-4">
          Developed by Michael Darko • © {new Date().getFullYear()}
          <a
            href="https://github.com/Kimiqo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="mailto:michael12darko@gmail.com"
            className="text-blue-400 hover:text-blue-300"
          >
            <FaEnvelope size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/mkkd-michael-darko/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            <FaLinkedin size={20} />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;

