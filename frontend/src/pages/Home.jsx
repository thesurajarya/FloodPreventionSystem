import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users } from "lucide-react";
import Galaxy from "../components/Galaxy"; // FIX 1: Removed curly braces

const Home = () => {
  return (
    // FIX 2: Added 'relative' and 'overflow-hidden' to contain the background
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden text-slate-100 font-sans p-6">
      {/* --- BACKGROUND LAYER --- */}
      {/* FIX 3: absolute inset-0 stretches the canvas behind everything */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
        {/* Dark overlay to make the text pop against the bright stars */}
        <div className="absolute inset-0 bg-slate-900/40 pointer-events-none"></div>
      </div>

      {/* --- FOREGROUND LAYER --- */}
      {/* relative z-10 ensures your buttons and text stay on top and clickable */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Title Section */}
        <div className="text-center mb-16 drop-shadow-lg">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Hydro<span className="text-blue-500">Guard</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-400 font-medium tracking-wide">
            Urban Flooding & Hydrology Intelligence System
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* CITIZEN PORTAL CARD */}
          <Link
            to="/citizen"
            className="group relative bg-slate-800/60 backdrop-blur-md border-2 border-slate-700 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-slate-800 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4">
              <Users
                size={48}
                className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 group-hover:text-white mb-3 transition-colors duration-300">
              Citizen Portal
            </h2>
            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              Live Flood Risk Maps & Safe Route Navigation
            </p>
          </Link>

          {/* OFFICIAL PORTAL CARD */}
          <Link
            to="/official"
            className="group relative bg-slate-800/60 backdrop-blur-md border-2 border-slate-700 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-slate-800 hover:border-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4">
              <ShieldAlert
                size={48}
                className="text-slate-400 group-hover:text-teal-400 transition-colors duration-300"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 group-hover:text-white mb-3 transition-colors duration-300">
              Official Portal
            </h2>
            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              Ward Readiness Analytics & AI Drain Monitoring
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
