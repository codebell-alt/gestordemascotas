// src/components/TareasVoluntario.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function TareasVoluntario() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTareas = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("⚠️ No hay usuario logueado");
        setLoading(false);
        return;
      }

      // 1️⃣ Buscar voluntario con idUsuario = uid actual
      const voluntarioQuery = query(
        collection(db, "voluntarios"),
        where("idUsuario", "==", user.uid)
      );
      const voluntarioSnap = await getDocs(voluntarioQuery);

      if (voluntarioSnap.empty) {
        console.log("⚠️ No se encontró voluntario con este usuario");
        setLoading(false);
        return;
      }

      const voluntarioId = voluntarioSnap.docs[0].id;

      // 2️⃣ Buscar tareas de ese voluntario
      const tareasQuery = query(
        collection(db, "tareas"),
        where("idVoluntario", "==", voluntarioId)
      );
      const tareasSnap = await getDocs(tareasQuery);

      const tareasData = [];
      for (let tareaDoc of tareasSnap.docs) {
        const tarea = { id: tareaDoc.id, ...tareaDoc.data() };

        // traer nombre de mascota
        if (tarea.idMascota) {
          const mascotaRef = doc(db, "mascotas", tarea.idMascota);
          const mascotaSnap = await getDoc(mascotaRef);
          if (mascotaSnap.exists()) {
            tarea.mascota = mascotaSnap.data().nombre;
          }
        }

        tareasData.push(tarea);
      }

      setTareas(tareasData);
    } catch (error) {
      console.error("❌ Error obteniendo tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTareas();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando tareas...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mis Tareas Asignadas</h2>

      {tareas.length === 0 ? (
        <p className="text-center text-muted">No tienes tareas asignadas</p>
      ) : (
        <div className="table-responsive shadow rounded-3">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>Mascota</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((t) => (
                <tr key={t.id}>
                  <td className="fw-bold">{t.mascota || "Sin nombre"}</td>
                  <td>{t.tipo}</td>
                  <td>{t.fecha}</td>
                  <td>{t.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
