// src/components/TareasVoluntario.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function TareasVoluntario({ idVoluntario }) {
  const [tareas, setTareas] = useState([]);
  const [observaciones, setObservaciones] = useState({});

  // Obtener tareas asignadas a este voluntario
  const getTareas = async () => {
    const querySnapshot = await getDocs(collection(db, "tareas"));
    const tareasData = [];

    for (let tareaDoc of querySnapshot.docs) {
      const tarea = { id: tareaDoc.id, ...tareaDoc.data() };
      if (tarea.idVoluntario === idVoluntario) {
        // Obtener datos de la mascota asociada
        if (tarea.idMascota) {
          const mascotaRef = doc(db, "mascotas", tarea.idMascota);
          const mascotaSnap = await getDoc(mascotaRef);
          if (mascotaSnap.exists()) {
            tarea.mascota = mascotaSnap.data().nombre;
          }
        }
        tareasData.push(tarea);
      }
    }

    setTareas(tareasData);
  };

  const guardarObservacion = async (idTarea) => {
    if (!observaciones[idTarea] || observaciones[idTarea].trim() === "") {
      alert("Escribe una observación antes de guardar");
      return;
    }
    await updateDoc(doc(db, "tareas", idTarea), {
      observacion: observaciones[idTarea]
    });
    alert("Observación guardada");
  };

  useEffect(() => {
    getTareas();
  }, []);

  return (
    <div>
      <h2>Mis Tareas Asignadas</h2>
      {tareas.length === 0 && <p>No tienes tareas asignadas</p>}
      {tareas.map((t) => (
        <div key={t.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <p><strong>Mascota:</strong> {t.mascota || "Sin nombre"}</p>
          <p><strong>Tipo:</strong> {t.tipo}</p>
          <p><strong>Fecha:</strong> {t.fecha}</p>
          <p><strong>Hora:</strong> {t.hora}</p>
          <textarea
            placeholder="Escribe observación..."
            value={observaciones[t.id] || ""}
            onChange={(e) => setObservaciones({ ...observaciones, [t.id]: e.target.value })}
          />
          <button onClick={() => guardarObservacion(t.id)}>Guardar Observación</button>
        </div>
      ))}
    </div>
  );
}
