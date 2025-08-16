// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminPanel from "./pages/AdminPanel";
import VoluntarioPanel from "./pages/VoluntarioPanel";
import DuenoPanel from "./pages/DuenoPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/voluntario" element={<VoluntarioPanel />} />
        <Route path="/dueno" element={<DuenoPanel />} />
      </Routes>
    </Router>
  );
}
