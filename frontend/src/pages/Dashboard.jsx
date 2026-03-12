import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, CloudRain, Activity, Camera, Radio, Play } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Import our layout components
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const initialSensorData = [
  { time: '10:00', waterLevel: 20, rainIntensity: 5 },
  { time: '10:15', waterLevel: 25, rainIntensity: 15 },
  { time: '10:30', waterLevel: 35, rainIntensity: 25 },
  { time: '10:45', waterLevel: 55, rainIntensity: 40 },
  { time: '11:00', waterLevel: 65, rainIntensity: 35 },
];

const Dashboard = () => {
  // --- CORE LAYOUT STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- CORE DATA STATES ---
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [currentStats, setCurrentStats] = useState({ waterLevel: 65, rainIntensity: 35, blockedDrains: 1 });
  const [wardScore, setWardScore] = useState(85);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [garbageDetected, setGarbageDetected] = useState(false);
  const [simulationTime, setSimulationTime] = useState(new Date().setHours(11, 0, 0, 0));

  const mapCenter = [28.6139, 77.2090]; 

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    if (!isDemoMode) return;
    const demoInterval = setInterval(() => {
      setSimulationTime(prevTime => {
        const nextTime = new Date(prevTime + 15 * 60000); 
        const timeString = nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setSensorData(prevData => {
          const lastWater = prevData[prevData.length - 1].waterLevel;
          const newRain = Math.max(0, Math.floor(Math.random() * 60) + 20); 
          const newWater = Math.min(100, lastWater + Math.floor(newRain / 5) + (garbageDetected ? 5 : -2)); 
          
          setCurrentStats({ waterLevel: newWater, rainIntensity: newRain, blockedDrains: garbageDetected ? 3 : 1 });
          const newScore = Math.max(10, 100 - newWater + (newRain > 50 ? -10 : 0));
          setWardScore(newScore);
          setActiveAlerts(newWater > 80 ? 3 : newWater > 60 ? 1 : 0);

          const newDataArray = [...prevData, { time: timeString, waterLevel: newWater, rainIntensity: newRain }];
          if (newDataArray.length > 6) newDataArray.shift();
          return newDataArray;
        });

        if (Math.random() > 0.6) setGarbageDetected(prev => !prev);
        return nextTime;
      });
    }, 3000); 
    return () => clearInterval(demoInterval);
  }, [isDemoMode, garbageDetected]);

  const mapRadius = currentStats.waterLevel * 8; 
  const mapColor = currentStats.waterLevel > 75 ? 'red' : currentStats.waterLevel > 50 ? 'orange' : '#3b82f6';

  // --- RENDER ---
  return (
    // MASTER WRAPPER: min-h-screen & flex-col ensure footer stays at bottom
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. FIXED TOP COMPONENTS */}
      <Header activeAlerts={activeAlerts} systemStatus={!isDemoMode ? 'operational' : 'degraded'} />
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 2. MAIN SCROLLABLE AREA */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        
        {/* --- TAB: COMMAND CENTER (Your Original Dashboard) --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Controls */}
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 ${isDemoMode ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                >
                  {isDemoMode ? <Radio size={18} /> : <Play size={18} />}
                  {isDemoMode ? 'Connect Live Hardware' : 'Start Simulation'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 uppercase tracking-wider">Ward Readiness</span>
                <div className={`px-4 py-1.5 rounded-lg font-bold text-xl border ${wardScore > 75 ? 'bg-green-900/20 text-green-400 border-green-500/50' : wardScore > 50 ? 'bg-orange-900/20 text-orange-400 border-orange-500/50' : 'bg-red-900/20 text-red-500 border-red-500/50'}`}>
                  {wardScore}/100
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard icon={<Droplets />} title="Live Water Level" value={`${currentStats.waterLevel} cm`} color={currentStats.waterLevel > 75 ? "text-red-400" : "text-blue-400"} />
              <StatCard icon={<CloudRain />} title="Rainfall Intensity" value={`${currentStats.rainIntensity} mm/h`} color="text-teal-400" />
              <StatCard icon={<Camera />} title="Detected Blockages" value={`${currentStats.blockedDrains} Drains`} color={garbageDetected ? "text-orange-400" : "text-green-400"} />
              <StatCard icon={<AlertTriangle />} title="Active Hotspots" value={activeAlerts} color={activeAlerts > 0 ? "text-red-500" : "text-slate-500"} />
            </div>

            {/* Map & Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Map */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col min-h-[400px]">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Activity size={20} className="text-blue-400" /> Live Risk Map</h2>
                <div className="grow rounded-lg overflow-hidden">
                  <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', minHeight: '350px' }}>
                    {/* Replace the dark_all URL with this light_all URL */}
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={mapCenter}>
                      <Popup className="text-slate-900 font-semibold">Node Alpha-01<br/>Water: {currentStats.waterLevel}cm</Popup>
                    </Marker>
                    <Circle center={[28.6200, 77.2100]} radius={mapRadius} pathOptions={{ color: mapColor, fillColor: mapColor, fillOpacity: 0.4 }} />
                  </MapContainer>
                </div>
              </div>

              {/* Right: Camera & Graph */}
              <div className="flex flex-col gap-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Camera size={18} className={garbageDetected ? "text-orange-400" : "text-green-400"} /> AI Monitor
                  </h2>
                  <div className={`w-full h-40 rounded-lg relative flex items-center justify-center border-2 ${garbageDetected ? 'border-orange-500/50 bg-orange-900/20' : 'border-slate-600 bg-black'}`}>
                    <p className="text-slate-500 text-sm z-10">{garbageDetected ? 'Processing CV...' : 'CCTV Active - Clear'}</p>
                    {garbageDetected && <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">GARBAGE (94%)</div>}
                    {garbageDetected && <div className="absolute w-20 h-20 border-2 border-orange-500 border-dashed rounded opacity-70"></div>}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 grow min-h-[200px]">
                  <h2 className="text-lg font-semibold mb-4">Telemetry</h2>
                  <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                    <LineChart data={sensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} yAxisId="left" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                      <Line yAxisId="left" type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Water (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SYSTEM LOGS --- */}
        {activeTab === 'logs' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Live System Logs</h2>
            <div className="flex-1 bg-black rounded-xl border border-slate-700 p-4 font-mono text-sm text-green-500 overflow-y-auto">
               <p className="text-slate-500">[{new Date().toLocaleTimeString()}] SYS: Initializing WebSocket connection...</p>
               <p>[{new Date().toLocaleTimeString()}] MQTT: Connected to broker.hivemq.com on port 1883</p>
               {sensorData.map((data, idx) => (
                <p key={idx}>{`[${data.time}:00] Node Alpha-01: PUBLISH topic=city/ward1/waterlevel payload={val: ${data.waterLevel}, rain: ${data.rainIntensity}}`}</p>               ))}
               {garbageDetected && <p className="text-orange-400">[{new Date().toLocaleTimeString()}] CV_Engine: WARNING - Blockage probability 94% at Drain_B4</p>}
            </div>
          </div>
        )}

        {/* --- INDEPENDENT MAP VIEW --- */}
        {activeTab === 'map' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Live GIS Map</h2>
            </div>
            
            {/* FIX: Added w-full, h-[75vh], and min-h-[500px] to strictly enforce the map's height */}
            <div className="w-full h-[75vh] min-h-[500px] rounded-xl border border-slate-700 overflow-hidden shadow-lg relative bg-slate-800 z-0">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Marker position={mapCenter}>
                  <Popup className="text-slate-900 font-semibold">Node Alpha-01<br/>Water: {currentStats.waterLevel}cm</Popup>
                </Marker>
                <Circle center={[28.6200, 77.2100]} radius={mapRadius} pathOptions={{ color: mapColor, fillColor: mapColor, fillOpacity: 0.4 }} />
              </MapContainer>
            </div>
          </div>
        )}
      </main>

      {/* 3. FIXED BOTTOM COMPONENT */}
      <Footer />
      
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-slate-900/50 ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm whitespace-nowrap">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;