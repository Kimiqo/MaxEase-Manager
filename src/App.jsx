import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LectureTimetablePage from "./pages/LectureTimetablePage";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/lecture" element={<LectureTimetablePage />} />
      </Routes>
              {/* Vercel Speed Insights and Analytics*/}
              <SpeedInsights />
              <Analytics/>
    </Router>
  );
}

export default App;