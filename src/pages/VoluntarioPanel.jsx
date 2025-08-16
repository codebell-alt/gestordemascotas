import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useState } from "react";
import SidebarVoluntario from "../components/SidebarVoluntario";
import TareasVoluntario from "../components/TareasVoluntario";
import MascotasList from "../components/MascotasList";
import ObservacionesForm from "../components/ObservacionesForm";
import logo from "../assets/logo.png";
import "../styles/Dashboard.css";

export default function VoluntarioPanel({ idVoluntario }) {
  const [selected, setSelected] = useState("tareas");

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
          <h4>Panel del Voluntario</h4>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
        </button>
      </header>

      {/* Sidebar + Contenido */}
      <div className="dashboard-content">
        <SidebarVoluntario selected={selected} onSelect={setSelected} />

        <div className="dashboard-main">
          <div className="dashboard-card">
            {selected === "tareas" && <TareasVoluntario idVoluntario={idVoluntario} />}
            {selected === "consultarMascota" && <MascotasList />}
            {selected === "observaciones" && <ObservacionesForm idVoluntario={idVoluntario} />}
          </div>
        </div>
      </div>
    </div>
  );
}
