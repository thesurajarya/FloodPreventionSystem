import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, CloudRain, Activity, Camera } from 'lucide-react';
import 'leaflet/dist/leaflet.css'; // Essential for the map to render correctly!

// --- MOCK DATA ---
const mockSensorData = [
  { time: '10:00', waterLevel: 20, rainIntensity: 5 },
  { time: '10:15', waterLevel: 25, rainIntensity: 15 },
  { time: '10:30', waterLevel: 35, rainIntensity: 25 },
  { time: '10:45', waterLevel: 55, rainIntensity: 40 },
  { time: '11:00', waterLevel: 65, rainIntensity: 35 },
  { time: '11:15', waterLevel: 80, rainIntensity: 50 },
];

const Dashboard = () => {
  // In a real scenario, these will be updated via WebSockets
  const [wardScore, setWardScore] = useState(72); 
  const [activeAlerts, setActiveAlerts] = useState(2);

  // Center map on a generic city coordinate (update to your target city)
  const mapCenter = [28.6139, 77.2090]; 

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Hydrology Intelligence System</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time Urban Flood Monitoring & Prediction</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shadow-lg">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ward Readiness Score</p>
            <div className={`text-3xl font-bold ${wardScore > 70 ? 'text-green-400' : 'text-orange-400'}`}>
              {wardScore}/100
            </div>
          </div>
        </div>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Droplets />} title="Live Water Level" value="80 cm" color="text-blue-400" />
        <StatCard icon={<CloudRain />} title="Rainfall Intensity" value="50 mm/h" color="text-teal-400" />
        <StatCard icon={<Camera />} title="Detected Blockages" value="3 Drains" color="text-orange-400" />
        <StatCard icon={<AlertTriangle />} title="Active Micro-Hotspots" value={activeAlerts} color="text-red-400" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Map (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            Live Flood Risk Map
          </h2>
          <div className="grow rounded-lg overflow-hidden min-h-100">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              
              {/* Example Sensor Marker */}
              <Marker position={[28.6139, 77.2090]}>
                <Popup className="text-slate-900 font-semibold">Node 1: High Water Level</Popup>
              </Marker>
              
              {/* Example Flood Hotspot Radius */}
              <Circle center={[28.6200, 77.2100]} radius={500} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} />
            </MapContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: Camera Feed & Charts */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Camera Feed for Drain Blockage */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Camera size={18} className="text-orange-400" />
              AI Drain Monitoring
            </h2>
            <div className="w-full h-48 bg-black rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-600">
              {/* Placeholder for actual WebRTC/MJPEG stream */}
              <p className="text-slate-500 text-sm absolute z-10">CCTV Feed Disconnected</p>
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded animate-pulse">
                GARBAGE DETECTED (94%)
              </div>
            </div>
          </div>

          {/* Sensor Trends Chart */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg grow">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Sensor Trends (Last Hour)</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSensorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={3} dot={false} name="Water Level (cm)" />
                  <Line type="monotone" dataKey="rainIntensity" stroke="#2dd4bf" strokeWidth={2} dot={false} name="Rainfall (mm/h)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple reusable component for the top stat cards
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-slate-900 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;