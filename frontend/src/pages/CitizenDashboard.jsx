import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import { AlertCircle, Navigation, MapPin, Search, CloudRain, Info, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Custom component to dynamically pan the map when user location is found
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { animate: true });
  }, [center, map]);
  return null;
};

const CitizenDashboard = () => {
  const [routeActive, setRouteActive] = useState(false);
  
  // Dynamic Geolocation States
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default: New Delhi
  const [isLocating, setIsLocating] = useState(true);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock flooded zones
  const floodedZones = [
    { id: 1, center: [28.5800, 77.2200], radius: 1200, severity: 'High' },
    { id: 2, center: [28.5600, 77.2600], radius: 800, severity: 'Moderate' },
  ];

  // Request browser location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Location access denied or failed:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  // Free OpenStreetMap Geocoding Search
  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      // Free Nominatim API - perfectly fine for hackathon demos!
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const destCoords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setDestination(destCoords);
        setRouteActive(true);
      } else {
        alert("Location not found. Try a different search term.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Safe route mockup between User and Destination
  const safeRouteCoords = destination ? [
    userLocation,
    [(userLocation[0] + destination[0]) / 2, (userLocation[1] + destination[1]) / 2 + 0.02], // A slight curve detour
    destination,
  ] : [];

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-20 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <CloudRain size={24} /> HydroGuard <span className="text-slate-100 text-sm font-normal ml-1 border-l border-slate-600 pl-2">Citizen</span>
          </h1>
        </div>
        <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Exit</Link>
      </header>

      {/* ALERT BANNER */}
      <div className="bg-red-900/80 border-b border-red-500 text-red-100 px-4 py-2 text-sm flex items-center justify-center gap-2 z-20">
        <AlertCircle size={16} className="animate-pulse" />
        <strong>Heavy Rainfall Alert:</strong> Multiple waterlogging incidents reported nearby.
      </div>

      {/* MAP AREA */}
      <div className="flex-grow relative z-0">
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          {/* Light Theme Map */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          
          {/* Dynamic Map Panner */}
          <MapUpdater center={destination || userLocation} />
          
          {/* User Location */}
          <Marker position={userLocation}>
            <Popup className="text-slate-900 font-bold">Your Live Location</Popup>
          </Marker>

          {/* Searched Destination Marker */}
          {destination && (
            <Marker position={destination}>
              <Popup className="text-slate-900 font-bold">Destination</Popup>
            </Marker>
          )}

          {/* Flooded Zones */}
          {floodedZones.map(zone => (
            <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={{ color: zone.severity === 'High' ? 'red' : 'orange', fillColor: zone.severity === 'High' ? 'red' : 'orange', fillOpacity: 0.4 }}>
              <Popup className="text-slate-900 font-semibold">Avoid: {zone.severity} Flood Zone</Popup>
            </Circle>
          ))}

          {/* Mocked Safe Route Line */}
          {routeActive && destination && (
            <Polyline positions={safeRouteCoords} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.8, dashArray: '10, 10', lineCap: 'round' }} />
          )}
        </MapContainer>

        {/* INTERACTIVE ROUTING PANEL */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-5 z-[400] transition-all duration-300">
          
          {!routeActive ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Find Safe Route</h2>
              
              <div className="relative flex items-center">
                <MapPin size={18} className="absolute left-3 text-blue-400" />
                <input type="text" value={isLocating ? "Fetching GPS..." : "Current Location"} disabled className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg py-3 pl-10 pr-4 text-sm opacity-70" />
                {isLocating && <Loader size={16} className="absolute right-3 text-blue-400 animate-spin" />}
              </div>
              
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Enter destination (e.g., India Gate)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {isSearching ? <Loader size={18} className="animate-spin" /> : <Navigation size={18} />}
                {isSearching ? 'Routing...' : 'Calculate Safe Route'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-green-400">Route Ready</h2>
                  <p className="text-sm text-slate-400">Safest path generated avoiding current floods.</p>
                </div>
                <button 
                  onClick={() => { setRouteActive(false); setDestination(null); setSearchQuery(''); }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg p-3 text-sm flex gap-3 border border-slate-700">
                <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">Route altered:</strong> High water level detected ahead. Follow the green bypass line.
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