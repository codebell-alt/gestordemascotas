import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Swal from "sweetalert2";

export default function ObservacionesForm({ idVoluntario }) {
  const [mascotas, setMascotas] = useState([]);
  const [idMascota, setIdMascota] = useState("");
  const [texto, setTexto] = useState("");

  // Cargar todas las mascotas
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mascotas"));
        setMascotas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      }
    };
    fetchMascotas();
  }, []);

  // Guardar observación
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idMascota || !texto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Debes seleccionar una mascota y escribir una observación.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "observaciones"), {
        idMascota,
        idVoluntario,
        texto,
        fecha: new Date()
      });

      Swal.fire({
        icon: "success",
        title: "¡Observación registrada!",
        text: "La observación se ha guardado correctamente.",
      });

      setTexto("");
      setIdMascota("");
    } catch (error) {
      console.error("Error al guardar observación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la observación.",
      });
    }
  };

  return (
    <div>
      <h3>Registro de Observaciones</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        <div>
          <label>Mascota</label>
          <select
            className="form-select"
            value={idMascota}
            onChange={(e) => setIdMascota(e.target.value)}
            style={{ border: "1px solid green" }}
          >
            <option value="">Seleccione una mascota</option>
            {mascotas.map(m => (
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
            Guardar Observación
          </button>
        </div>
      </form>
    </div>
  );
}
