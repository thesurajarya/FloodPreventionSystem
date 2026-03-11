import React, { useState, useEffect } from 'react';
import { Shield, Bell, User, Clock, Settings, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Header = ({ activeAlerts = 0, systemStatus = 'operational' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Live clock for the command center
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-700 text-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      
      {/* LEFT: Official Branding */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-700 shadow-[0_0_10px_rgba(29,78,216,0.3)]">
          <Shield className="text-blue-400" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
            Municipal Flood Control Board
          </h1>
          <p className="text-xs text-blue-400 font-semibold tracking-wider">
            Hydrology Command Center • Ward Authority
          </p>
        </div>
      </div>

      {/* CENTER: Live Clock & Status (Hidden on small screens) */}
      <div className="hidden md:flex items-center gap-6 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock size={16} className="text-slate-400" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleDateString('en-GB')} {currentTime.toLocaleTimeString('en-GB')}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-600"></div>
        <div className="flex items-center gap-2">
          {systemStatus === 'operational' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              API Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              API Degraded
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Interactive Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={20} className="text-slate-300" />
            {activeAlerts > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold animate-bounce">
                {activeAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-sm">Actionable Alerts</span>
                <span className="text-xs text-slate-400">{activeAlerts} pending</span>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {activeAlerts > 0 ? (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3 mb-2">
                    <AlertTriangle size={16} className="text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-200">Micro-Hotspot Detected</p>
                      <p className="text-xs text-slate-400 mt-1">Water level exceeded 75cm at Node Alpha-01.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 size={24} className="text-green-500/50" />
                    <span className="text-sm">No active flood alerts</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-3 pl-4 border-l border-slate-700 hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">A. Sharma</p>
              <p className="text-xs text-slate-400">Chief Engineer</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300">
              <User size={18} />
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
                  <Settings size={16} /> Dashboard Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1">
                  <LogOut size={16} /> Secure Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;