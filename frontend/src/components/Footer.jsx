import React from 'react';
import { Phone, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-3 px-6 text-slate-400 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="text-center md:text-left">
          <p className="font-semibold text-slate-300">Municipal Flood Control Board © {new Date().getFullYear()}</p>
          <p className="text-xs mt-0.5">Hydrology Intelligence System - v1.0.4 Beta</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert size={16} className="text-red-400"/> Dispatch: <span className="font-bold">112</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone size={16} className="text-blue-400"/> Drainage: <span className="font-bold">1800-FLOOD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;