import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export default function HistorialMascota({ idDueno }) {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      // 1️⃣ Obtener mascotas del dueño
      const mascotasQuery = query(
        collection(db, "mascotas"),
        where("idDueno", "==", idDueno)
      );
      const mascotasSnap = await getDocs(mascotasQuery);

      const mascotasData = await Promise.all(
        mascotasSnap.docs.map(async (docMascota) => {
          const mascota = { id: docMascota.id, ...docMascota.data() };

          // 2️⃣ Obtener tareas de esta mascota
          const tareasQuery = query(
            collection(db, "tareas"),
            where("idMascota", "==", mascota.id)
          );
          const tareasSnap = await getDocs(tareasQuery);
          mascota.tareas = tareasSnap.docs.map((t) => ({
            id: t.id,
            ...t.data(),
          }));

          return mascota;
        })
      );

      setMascotas(mascotasData);
    };

    fetchHistorial();
  }, [idDueno]);

  return (
    <div>
      <h3>Historial de Mascotas</h3>
      {mascotas.length === 0 ? (
        <p>No hay mascotas registradas.</p>
      ) : (
        mascotas.map((m) => (
          <div
            key={m.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>{m.nombre}</strong> - {m.especie}
            <p>Edad: {m.edad}</p>
            <p>Disponible: {m.disponible}</p>

            {/* 3️⃣ Mostrar historial de tareas */}
            <h5>Tareas asignadas:</h5>
            {m.tareas.length === 0 ? (
              <p>No hay tareas registradas para esta mascota.</p>
            ) : (
              <ul>
                {m.tareas.map((t) => (
                  <li key={t.id}>
                    {t.descripcion} - Estado: {t.estado}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
