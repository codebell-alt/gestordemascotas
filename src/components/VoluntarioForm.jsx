// src/components/VoluntarioForm.jsx
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VoluntarioForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [voluntarios, setVoluntarios] = useState([]);
  const [editId, setEditId] = useState(null);

  // Cargar voluntarios al montar
  useEffect(() => {
    fetchVoluntarios();
  }, []);

  const fetchVoluntarios = async () => {
    const querySnapshot = await getDocs(collection(db, "voluntarios"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVoluntarios(lista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, "voluntarios", editId), {
          nombre,
          correo,
          telefono,
          direccion,
          ciudad,
          disponibilidad,
        });
        Swal.fire("Actualizado", "El voluntario fue actualizado", "success");
        setEditId(null);
      } else {
        await addDoc(collection(db, "voluntarios"), {
          nombre,
          correo,
          telefono,
          direccion,
          ciudad,
          disponibilidad,
        });
        Swal.fire("Guardado", "Voluntario registrado con éxito", "success");
      }
      resetForm();
      fetchVoluntarios();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (vol) => {
    setNombre(vol.nombre);
    setCorreo(vol.correo);
    setTelefono(vol.telefono);
    setDireccion(vol.direccion);
    setCiudad(vol.ciudad);
    setDisponibilidad(vol.disponibilidad);
    setEditId(vol.id);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar voluntario?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "voluntarios", id));
        fetchVoluntarios();
        Swal.fire("Eliminado", "El voluntario ha sido eliminado", "success");
      }
    });
  };

  const resetForm = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setCiudad("");
    setDisponibilidad("");
  };

  // Estilos inline del formulario
  const formContainer = {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "left",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
  };

  const buttonStyle = {
    gridColumn: "1 / -1",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
  };

  return (
    <div style={formContainer}>
      <h2 style={titleStyle}>
        {editId ? "Editar Voluntario" : "Registrar Voluntario"}
      </h2>
      <form onSubmit={handleSubmit} style={gridStyle}>
        <input
          style={inputStyle}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <input
          style={inputStyle}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          type="email"
          required
        />
        <input
          style={inputStyle}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono"
          required
        />
        <input
          style={inputStyle}
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección"
          required
        />
        <input
          style={inputStyle}
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ciudad"
          required
        />
        <select
          style={inputStyle}
          value={disponibilidad}
          onChange={(e) => setDisponibilidad(e.target.value)}
          required
        >
          <option value="">Seleccione disponibilidad</option>
          <option value="Disponible">Disponible</option>
          <option value="No disponible">No disponible</option>
        </select>

        <button type="submit" style={buttonStyle}>
          {editId ? "Actualizar" : "Guardar"}
        </button>
      </form>

      {/* Tabla de voluntarios */}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {voluntarios.map((vol) => (
            <tr key={vol.id}>
              <td>{vol.nombre}</td>
              <td>{vol.correo}</td>
              <td>{vol.telefono}</td>
              <td>{vol.ciudad}</td>
              <td>{vol.disponibilidad}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(vol)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(vol.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
