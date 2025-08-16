// src/components/SidebarVoluntario.jsx
export default function SidebarVoluntario({ selected, onSelect }) {
  return (
    <nav className="sidebar">
      <ul className="nav flex-column">
        <li>
          <button
            className={`nav-link ${selected === "tareas" ? "active" : ""}`}
            onClick={() => onSelect("tareas")}
          >
            <i className="bi bi-check2-square me-2"></i> Tareas Asignadas
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "consultarMascota" ? "active" : ""}`}
            onClick={() => onSelect("consultarMascota")}
          >
            <i className="bi bi-search-heart me-2"></i> Consultar Mascota
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "observaciones" ? "active" : ""}`}
            onClick={() => onSelect("observaciones")}
          >
            <i className="bi bi-journal-text me-2"></i> Registro Observaciones
          </button>
        </li>
      </ul>
    </nav>
  );
}
