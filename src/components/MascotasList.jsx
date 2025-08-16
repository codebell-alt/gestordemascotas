// src/components/MascotasList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";

export default function MascotasList() {
  const [mascotas, setMascotas] = useState([]);

  const getMascotas = async () => {
    const querySnapshot = await getDocs(collection(db, "mascotas"));
    setMascotas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const eliminarMascota = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "mascotas", id));
      Swal.fire("Eliminado!", "La mascota ha sido eliminada.", "success");
      getMascotas();
    }
  };

  useEffect(() => {
    getMascotas();
  }, []);

  return (
    <div>
      <h2>Lista de Mascotas</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {mascotas.map(m => (
          <li key={m.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #ccc", padding: "5px 0" }}>
            <img 
              src={m.foto} 
              alt={m.nombre} 
              style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "10px" }} 
            />
            <span style={{ flex: 1 }}>{m.nombre} {m.descripcion && `- ${m.descripcion}`}</span>
            <button 
              onClick={() => eliminarMascota(m.id)} 
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "red", fontSize: "1.2rem" }}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
