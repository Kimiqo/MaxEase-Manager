import React, { useState } from "react";
import { FaGithub, FaEnvelope, FaLinkedin, FaTimes } from "react-icons/fa";

function DeveloperBadge() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((s) => !s);

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") toggle();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("michael12darko@gmail.com");
      // small non-blocking feedback
      const el = document.createElement("div");
      el.textContent = "Email copied to clipboard";
      el.className = "fixed right-4 bottom-24 bg-black text-white px-3 py-1 rounded shadow-lg text-sm";
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 1800);
    } catch {
      // fallback
      alert("Copy failed. Please copy manually: michael12darko@gmail.com");
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div
        className={`flex items-center gap-3 transition-all ${open ? "w-72 p-3 rounded-2xl" : "w-12 p-1 rounded-full"} bg-black/80 backdrop-blur-md border border-white/10 shadow-lg`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          aria-expanded={open}
          onClick={toggle}
          onKeyDown={onKey}
          tabIndex={0}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 text-white font-semibold focus:outline-none"
          title={open ? "Close" : "Developer"}
        >
          {open ? <FaTimes /> : <span>MD</span>}
        </button>

        {open && (
          <div className="flex-1 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Michael Darko</div>
                <div className="text-xs text-gray-300">Developer</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <a href="https://github.com/Kimiqo" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="mailto:michael12darko@gmail.com" className="text-blue-300 hover:text-blue-200" aria-label="Email">
                <FaEnvelope />
              </a>
              <a href="https://www.linkedin.com/in/mkkd-michael-darko/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200" aria-label="LinkedIn">
                <FaLinkedin />
              </a>

              <button onClick={copyEmail} className="ml-auto text-xs text-gray-300 hover:text-white">Copy Email</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeveloperBadge;
