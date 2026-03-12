import React from 'react';
import { LayoutDashboard, Map, Video, TerminalSquare } from 'lucide-react';

const NavBar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={18} /> },
    { id: 'map', label: 'Live GIS Map', icon: <Map size={18} /> },
    { id: 'cctv', label: 'CCTV Analytics', icon: <Video size={18} /> },
    { id: 'logs', label: 'System Logs', icon: <TerminalSquare size={18} /> },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 overflow-x-auto hide-scrollbar z-40">
      <ul className="flex items-center gap-2 min-w-max py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;