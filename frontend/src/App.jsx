import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page is now the default route "/" */}
        <Route path="/" element={<Home />} />

        {/* The Dashboard we built is mapped to the Official Portal */}
        <Route path="/official" element={<Dashboard />} />

        {/* We can point the Citizen portal to a placeholder for now, or you can build a simpler version later */}
        <Route
          path="/citizen"
          element={
            <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center text-3xl">
              Citizen Dashboard Coming Soon...
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
