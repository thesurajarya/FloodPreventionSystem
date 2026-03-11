import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users } from 'lucide-react';

const Home = () => {
  return (
    // Radial gradient background to give it that premium, deep look
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 font-sans p-6">
      
      {/* Title Section */}
      <div className="text-center mb-16 animate-fade-in-down">
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
          className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-slate-800 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:-translate-y-1"
        >
          <div className="flex justify-center mb-4">
            <Users size={48} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
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
          className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-slate-800 hover:border-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:-translate-y-1"
        >
          <div className="flex justify-center mb-4">
            <ShieldAlert size={48} className="text-slate-400 group-hover:text-teal-400 transition-colors duration-300" />
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
  );
};

export default Home;