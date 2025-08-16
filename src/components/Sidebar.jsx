export default function Sidebar({ selected, onSelect }) {
  return (
    <nav className="sidebar">
      <ul className="nav flex-column">
        <li>
          <button
            className={`nav-link ${selected === "usuario" ? "active" : ""}`}
            onClick={() => onSelect("usuario")}
          >
            <i className="bi bi-person-plus-fill me-2"></i> Registrar Usuario
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "mascota" ? "active" : ""}`}
            onClick={() => onSelect("mascota")}
          >
            <i className="bi bi-heart-fill me-2"></i> Registrar Mascota
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "voluntario" ? "active" : ""}`}
            onClick={() => onSelect("voluntario")}
          >
            <i className="bi bi-people-fill me-2"></i> Registrar Voluntario
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "tarea" ? "active" : ""}`}
            onClick={() => onSelect("tarea")}
          >
            <i className="bi bi-check2-square me-2"></i> Gestión de Tareas
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${selected === "lista" ? "active" : ""}`}
            onClick={() => onSelect("lista")}
          >
            <i className="bi bi-list-ul me-2"></i> Listado de Mascotas
          </button>
        </li>
      </ul>
    </nav>
  );
}
