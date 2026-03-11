import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { AlertCircle, Navigation, MapPin, Search, CloudRain, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const CitizenDashboard = () => {
  const [routeActive, setRouteActive] = useState(false);

  // --- MOCK NAVIGATION DATA ---
  // Coordinates based around New Delhi
  const userLocation = [28.5355, 77.2410]; // South Delhi (Start)
  const destination = [28.6139, 77.2090]; // Connaught Place (End)
  
  // High-risk flooded areas to avoid
  const floodedZones = [
    { id: 1, center: [28.5800, 77.2200], radius: 1200, severity: 'High' },
    { id: 2, center: [28.5600, 77.2600], radius: 800, severity: 'Moderate' },
  ];

  // A simulated "Safe Route" that snakes around the red flooded zones
  const safeRouteCoords = [
    [28.5355, 77.2410], // Start
    [28.5450, 77.2100], // Detour West
    [28.5900, 77.1900], // Bypass flood zone 1
    [28.6139, 77.2090], // End
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* MOBILE-FRIENDLY HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-20 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <CloudRain size={24} />
            HydroGuard <span className="text-slate-100 text-sm font-normal ml-1 border-l border-slate-600 pl-2">Citizen</span>
          </h1>
        </div>
        <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
          Exit
        </Link>
      </header>

      {/* EMERGENCY ALERT BANNER */}
      <div className="bg-red-900/80 border-b border-red-500 text-red-100 px-4 py-2 text-sm flex items-center justify-center gap-2 z-20">
        <AlertCircle size={16} className="animate-pulse" />
        <strong>Heavy Rainfall Alert:</strong> Multiple waterlogging incidents reported in South & Central zones.
      </div>

      {/* MAIN MAP AREA */}
      <div className="flex-grow relative z-0">
        <MapContainer center={[28.5700, 77.2200]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          
          {/* User Start Location */}
          <Marker position={userLocation}>
            <Popup className="text-slate-900 font-bold">Your Location</Popup>
          </Marker>

          {/* Destination Marker */}
          {routeActive && (
            <Marker position={destination}>
              <Popup className="text-slate-900 font-bold">Destination</Popup>
            </Marker>
          )}

          {/* Render Flooded Zones */}
          {floodedZones.map(zone => (
            <Circle 
              key={zone.id}
              center={zone.center} 
              radius={zone.radius} 
              pathOptions={{ 
                color: zone.severity === 'High' ? 'red' : 'orange', 
                fillColor: zone.severity === 'High' ? 'red' : 'orange', 
                fillOpacity: 0.4 
              }} 
            >
              <Popup className="text-slate-900 font-semibold">
                Avoid: {zone.severity} Waterlogging Detected
              </Popup>
            </Circle>
          ))}

          {/* Render Safe Route Line */}
          {routeActive && (
            <Polyline 
              positions={safeRouteCoords} 
              pathOptions={{ color: '#10b981', weight: 6, opacity: 0.8, dashArray: '10, 10', lineCap: 'round' }} 
            />
          )}
        </MapContainer>

        {/* FLOATING ROUTING PANEL (Positioned over the map) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-5 z-[400] transition-all duration-300">
          
          {!routeActive ? (
            // Search Mode
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Find Safe Route</h2>
              
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-blue-400" />
                <input type="text" value="Current Location" disabled className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg py-2 pl-10 pr-4 text-sm opacity-70" />
              </div>
              
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Where to?" defaultValue="Connaught Place, New Delhi" className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <button 
                onClick={() => setRouteActive(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <Navigation size={18} />
                Calculate Safe Route
              </button>
            </div>
          ) : (
            // Active Navigation Mode
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-green-400">42 min</h2>
                  <p className="text-sm text-slate-400">18 km • Fastest route avoiding floods</p>
                </div>
                <button 
                  onClick={() => setRouteActive(false)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg p-3 text-sm flex gap-3 border border-slate-700">
                <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">Route altered:</strong> We have bypassed the submerged underpass at South Ext. Please follow the green dotted line.
                </p>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(22,163,74,0.4)]">
                <ArrowRight size={18} />
                Start Navigation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;