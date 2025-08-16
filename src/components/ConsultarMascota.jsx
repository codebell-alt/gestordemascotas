// src/components/ConsultarMascota.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ConsultarMascota({ idDueno }) {
  const [mascotas, setMascotas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchMascotas = async () => {
      const q = query(collection(db, "mascotas"), where("idDueno", "==", idDueno));
      const querySnapshot = await getDocs(q);
      setMascotas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMascotas();
  }, [idDueno]);

  const mascotasFiltradas = mascotas.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h3>Consultar Mascotas</h3>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {mascotasFiltradas.length === 0 ? (
        <p>No hay mascotas que coincidan.</p>
      ) : (
        mascotasFiltradas.map((m) => (
          <div key={m.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <strong>{m.nombre}</strong> - {m.especie} ({m.raza})
          </div>
        ))
      )}
    </div>
  );
}
