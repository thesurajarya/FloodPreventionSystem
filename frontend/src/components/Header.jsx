import React, { useState, useEffect } from 'react';
import { Shield, Bell, Clock, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ activeAlerts = 0, systemStatus = 'operational' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-700 text-slate-100 px-6 py-3 flex items-center justify-between z-50 shadow-md">
      
      {/* LEFT: Branding */}
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

      {/* CENTER: Live Clock & Status */}
      <div className="hidden md:flex items-center gap-6 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock size={16} className="text-slate-400" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleTimeString('en-GB')}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-600"></div>
        <div className="flex items-center gap-2">
          {systemStatus === 'operational' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Telemetry
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
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
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center rounded-t-xl">
                <span className="font-semibold text-sm">Alerts</span>
                <span className="text-xs text-slate-400">{activeAlerts} pending</span>
              </div>
              <div className="p-2">
                {activeAlerts > 0 ? (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex gap-3">
                    <AlertTriangle size={16} className="text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-200">High Water Level</p>
                      <p className="text-xs text-slate-400 mt-1">Check Alpha-01 Node.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 size={24} className="text-green-500/50" />
                    <span className="text-sm">No active alerts</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Exit Button */}
        <Link to="/" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors border-l border-slate-700 ml-2 pl-4">
          <LogOut size={16} /> <span className="hidden sm:inline">Exit Portal</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;