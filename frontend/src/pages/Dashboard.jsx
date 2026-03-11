import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, CloudRain, Activity, Camera, CheckCircle, Radio, Play } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import Header from '/Users/TANISHK TIWARI/Desktop/Tanishk/Git/indiainno/FloodPreventionSystem/frontend/src/components/Header'; // Adjust the path if necessary

const initialSensorData = [
  { time: '10:00', waterLevel: 20, rainIntensity: 5 },
  { time: '10:15', waterLevel: 25, rainIntensity: 15 },
  { time: '10:30', waterLevel: 35, rainIntensity: 25 },
  { time: '10:45', waterLevel: 55, rainIntensity: 40 },
  { time: '11:00', waterLevel: 65, rainIntensity: 35 },
];

const Dashboard = () => {
  // --- CORE STATES ---
  const [isDemoMode, setIsDemoMode] = useState(true); // TOGGLE STATE
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [currentStats, setCurrentStats] = useState({
    waterLevel: 65,
    rainIntensity: 35,
    blockedDrains: 1,
  });
  const [wardScore, setWardScore] = useState(85);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [garbageDetected, setGarbageDetected] = useState(false);
  const [simulationTime, setSimulationTime] = useState(new Date().setHours(11, 0, 0, 0));

  const mapCenter = [28.6139, 77.2090]; 

  // --- SIMULATION ENGINE (DEMO MODE ONLY) ---
  useEffect(() => {
    // If we are in LIVE mode, stop the simulation immediately
    if (!isDemoMode) return;

    const demoInterval = setInterval(() => {
      setSimulationTime(prevTime => {
        const nextTime = new Date(prevTime + 15 * 60000); 
        const timeString = nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setSensorData(prevData => {
          const lastWater = prevData[prevData.length - 1].waterLevel;
          const newRain = Math.max(0, Math.floor(Math.random() * 60) + 20); 
          const newWater = Math.min(100, lastWater + Math.floor(newRain / 5) + (garbageDetected ? 5 : -2)); 
          
          setCurrentStats({
            waterLevel: newWater,
            rainIntensity: newRain,
            blockedDrains: garbageDetected ? 3 : 1,
          });

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
  }, [isDemoMode, garbageDetected]); // Added isDemoMode to dependency array

  // --- LIVE WEBSOCKET LISTENER (PLACEHOLDER) ---
  useEffect(() => {
    if (isDemoMode) return;
    
    // Here is where we will add the Socket.io connection later!
    console.log("Connecting to live hardware feed...");
    // socket.on('sensorUpdate', (data) => { ... update states ... })

  }, [isDemoMode]);

  const mapRadius = currentStats.waterLevel * 8; 
  const mapColor = currentStats.waterLevel > 75 ? 'red' : currentStats.waterLevel > 50 ? 'orange' : '#3b82f6';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
    <Header activeAlerts={activeAlerts} systemStatus={isDemoMode ? 'operational' : 'degraded'} />
      
      {/* HEADER & CONTROLS */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-400">Hydrology Intelligence System</h1>
            {/* Live/Demo Badge */}
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border flex items-center gap-2 ${isDemoMode ? 'bg-indigo-900/50 text-indigo-400 border-indigo-700' : 'bg-red-900/50 text-red-400 border-red-700 animate-pulse'}`}>
              {isDemoMode ? <Play size={12} /> : <Radio size={12} />}
              {isDemoMode ? 'Demo Mode' : 'Live Feed'}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Real-time Urban Flood Monitoring & Prediction</p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* TOGGLE BUTTON */}
          <button 
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 ${isDemoMode ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'}`}
          >
            {isDemoMode ? <Radio size={18} /> : <Play size={18} />}
            {isDemoMode ? 'Connect Live Hardware' : 'Start Simulation'}
          </button>

          <div className={`p-4 rounded-xl border text-center shadow-lg transition-colors duration-500 ${wardScore > 70 ? 'bg-slate-800 border-slate-700' : 'bg-red-900/20 border-red-500/50'}`}>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ward Readiness Score</p>
            <div className={`text-3xl font-bold transition-colors duration-500 ${wardScore > 75 ? 'text-green-400' : wardScore > 50 ? 'text-orange-400' : 'text-red-500'}`}>
              {wardScore}/100
            </div>
          </div>
        </div>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Droplets />} title="Live Water Level" value={`${currentStats.waterLevel} cm`} color={currentStats.waterLevel > 75 ? "text-red-400" : "text-blue-400"} />
        <StatCard icon={<CloudRain />} title="Rainfall Intensity" value={`${currentStats.rainIntensity} mm/h`} color="text-teal-400" />
        <StatCard icon={<Camera />} title="Detected Blockages" value={`${currentStats.blockedDrains} Drains`} color={garbageDetected ? "text-orange-400" : "text-green-400"} />
        <StatCard icon={<AlertTriangle />} title="Active Micro-Hotspots" value={activeAlerts} color={activeAlerts > 0 ? "text-red-500" : "text-slate-500"} />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Map */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Live Flood Risk Map
            </h2>
          </div>
          <div className="grow rounded-lg overflow-hidden min-h-100">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={[28.6139, 77.2090]}>
                <Popup className="text-slate-900 font-semibold">Sensor Node alpha-01<br/>Water Level: {currentStats.waterLevel}cm</Popup>
              </Marker>
              <Circle 
                center={[28.6200, 77.2100]} 
                radius={mapRadius} 
                pathOptions={{ color: mapColor, fillColor: mapColor, fillOpacity: 0.4 }} 
              />
            </MapContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: Camera Feed & Charts */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* AI Drain Monitoring */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Camera size={18} className={garbageDetected ? "text-orange-400" : "text-green-400"} />
              AI Drain Monitoring
            </h2>
            <div className={`w-full h-48 rounded-lg relative overflow-hidden flex items-center justify-center border-2 transition-colors duration-300 ${garbageDetected ? 'border-orange-500/50 bg-orange-900/20' : 'border-slate-600 bg-black'}`}>
              <p className="text-slate-500 text-sm absolute z-10">
                {!isDemoMode ? 'Awaiting Live Camera Feed...' : garbageDetected ? 'Processing CV Stream...' : 'CCTV Feed Active - Clear'}
              </p>
              
              {garbageDetected && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse">
                  GARBAGE DETECTED (94%)
                </div>
              )}
              {garbageDetected && <div className="absolute w-24 h-24 border-2 border-orange-500 border-dashed rounded opacity-70"></div>}
            </div>
          </div>

          {/* Sensor Trends Chart */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg grow">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Sensor Telemetry</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} yAxisId="left" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                  <Line yAxisId="left" type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Water Level (cm)" animationDuration={300} />
                  <Line yAxisId="left" type="monotone" dataKey="rainIntensity" stroke="#2dd4bf" strokeWidth={2} dot={false} name="Rainfall (mm/h)" animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex items-center gap-4 transition-all duration-300">
    <div className={`p-3 rounded-lg bg-slate-900/50 shadow-inner ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm whitespace-nowrap">{title}</p>
      <p className={`text-2xl font-bold transition-colors duration-300 ${color}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;