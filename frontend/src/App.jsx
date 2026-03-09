import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Dashboard from "./pages/Dashboard";
// You can uncomment these when you are ready to build them:
// import Home from './pages/Home';
// import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* We are setting the Dashboard as the main page for now so you can see it */}
        <Route path="/" element={<Dashboard />} />

        {/* Future routes for your other pages */}
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
