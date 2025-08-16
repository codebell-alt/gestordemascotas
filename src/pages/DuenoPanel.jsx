import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import logo from "../assets/logo.png";
import "../styles/Dashboard.css";
import SidebarDueno from "../components/SidebarDueno";
import MascotaForm from "../components/MascotaForm";
import HistorialMascota from "../components/HistorialMascota";
import ConsultarMascota from "../components/ConsultarMascota";

export default function DuenoPanel({ idDueno }) {
  const [selected, setSelected] = useState("registrar");

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <img src={logo} alt="Logo" />
          <h4>Panel del Dueño</h4>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
        </button>
      </header>

      {/* Contenido */}
      <div className="dashboard-content">
        <SidebarDueno selected={selected} onSelect={setSelected} />
        <div className="dashboard-main">
          <div className="dashboard-card">
            {selected === "registrar" && <MascotaForm idDueno={idDueno} />}
            {selected === "historial" && <HistorialMascota idDueno={idDueno} />}
            {selected === "consultar" && <ConsultarMascota idDueno={idDueno} />}
          </div>
        </div>
      </div>
    </div>
  );
}
