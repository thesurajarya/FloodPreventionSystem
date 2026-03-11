import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CitizenDashboard from "./pages/CitizenDashboard";

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
          element={<CitizenDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
