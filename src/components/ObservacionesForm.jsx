import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

export default function ObservacionesForm() {
  const [mascotas, setMascotas] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [idMascota, setIdMascota] = useState("");
  const [texto, setTexto] = useState("");
  const [editId, setEditId] = useState(null);

  // Cargar todas las mascotas
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mascotas"));
        setMascotas(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      }
    };
    fetchMascotas();
    fetchObservaciones();
  }, []);

  // Cargar observaciones
  const fetchObservaciones = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "observaciones"));
      setObservaciones(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error al cargar observaciones:", error);
    }
  };

  // Guardar o actualizar observación
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "No autenticado",
        text: "Debes iniciar sesión para registrar una observación.",
      });
      return;
    }

    const idVoluntario = user.uid;
    const rol = "voluntario";

    if (!idMascota || !texto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Debes seleccionar una mascota y escribir una observación.",
      });
      return;
    }

    try {
      if (editId) {
        // 🔄 Actualizar observación
        const obsRef = doc(db, "observaciones", editId);
        await updateDoc(obsRef, { idMascota, texto });
        Swal.fire("Actualizado", "La observación fue actualizada", "success");
        setEditId(null);
      } else {
        // ➕ Crear nueva observación
        await addDoc(collection(db, "observaciones"), {
          idMascota,
          idVoluntario,
          rol,
          texto,
          fecha: serverTimestamp(),
        });
        Swal.fire("Guardado", "La observación fue registrada", "success");
      }

      setTexto("");
      setIdMascota("");
      fetchObservaciones();
    } catch (error) {
      console.error("Error al guardar observación:", error);
      Swal.fire("Error", "No se pudo guardar la observación", "error");
    }
  };

  // Eliminar observación
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "observaciones", id));
          Swal.fire("Eliminado", "La observación fue eliminada", "success");
          fetchObservaciones();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    });
  };

  // Editar observación
  const handleEdit = (obs) => {
    setIdMascota(obs.idMascota);
    setTexto(obs.texto);
    setEditId(obs.id);
  };

  // Buscar nombre de mascota
  const getNombreMascota = (id) => {
    const m = mascotas.find((mascota) => mascota.id === id);
    return m ? m.nombre : "Desconocida";
  };

  return (
    <div>
      <h3>Registro de Observaciones</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <label>Mascota</label>
          <select
            className="form-select"
            value={idMascota}
            onChange={(e) => setIdMascota(e.target.value)}
          >
            <option value="">Seleccione una mascota</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} - {m.especie}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Observación</label>
          <textarea
            className="form-control"
            rows="3"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          ></textarea>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="btn btn-success w-100">
            {editId ? "Actualizar Observación" : "Guardar Observación"}
          </button>
        </div>
      </form>

      {/* 📋 Tabla de observaciones */}
      <h4 className="mt-4">Lista de Observaciones</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Mascota</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {observaciones.map((obs) => (
            <tr key={obs.id}>
              <td>{getNombreMascota(obs.idMascota)}</td>
              <td>{obs.texto}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(obs)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(obs.id)}
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
