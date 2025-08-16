import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

import Sidebar from "../components/Sidebar";
import AdminRegisterUser from "../components/AdminRegisterUser";
import MascotaForm from "../components/MascotaForm";
import VoluntarioForm from "../components/VoluntarioForm";
import TareaForm from "../components/TareaForm";
import MascotasList from "../components/MascotasList";

import logo from "../assets/logo.png";
import "../styles/Dashboard.css";

export default function AdminPanel() {
  const [selectedPanel, setSelectedPanel] = useState("usuario");

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const renderPanel = () => {
    switch (selectedPanel) {
      case "usuario":
        return <AdminRegisterUser inputClass="form-control mb-3" buttonClass="btn btn-success" labelClass="form-label" />;
      case "mascota":
        return <MascotaForm inputClass="form-control mb-3" buttonClass="btn btn-success" labelClass="form-label" />;
      case "voluntario":
        return <VoluntarioForm inputClass="form-control mb-3" buttonClass="btn btn-success" labelClass="form-label" />;
      case "tarea":
        return <TareaForm inputClass="form-control mb-3" buttonClass="btn btn-success" labelClass="form-label" />;
      case "lista":
        return <MascotasList />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <img src={logo} alt="Logo" />
          <h4>Panel de Administración</h4>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
        </button>
      </header>

      {/* Contenido con sidebar */}
      <div className="dashboard-content">
        <Sidebar selected={selectedPanel} onSelect={setSelectedPanel} />
        <div className="dashboard-main">
          <div className="dashboard-card">
            {renderPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}
