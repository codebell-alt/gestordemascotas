export default function SidebarDueno({ selected, onSelect }) {
  return (
    <nav className="sidebar">
      <ul className="nav flex-column">
        <li>
          <button
            className={`nav-link ${selected === "registrar" ? "active" : ""}`}
            onClick={() => onSelect("registrar")}
          >
            <i className="bi bi-heart-fill me-2"></i> Registrar Mascota
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "historial" ? "active" : ""}`}
            onClick={() => onSelect("historial")}
          >
            <i className="bi bi-clock-history me-2"></i> Historial Mascota
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "consultar" ? "active" : ""}`}
            onClick={() => onSelect("consultar")}
          >
            <i className="bi bi-search me-2"></i> Consultar Mascota
          </button>
        </li>
      </ul>
    </nav>
  );
}
