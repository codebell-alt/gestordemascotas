// src/components/TareaForm.jsx
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function TareaForm() {
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [veces, setVeces] = useState(1);
  const [frecuencia, setFrecuencia] = useState("Día");
  const [fechaFin, setFechaFin] = useState("");
  const [notifTiempo, setNotifTiempo] = useState(10);
  const [idMascota, setIdMascota] = useState("");
  const [idVoluntario, setIdVoluntario] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      background: "#fff",
      padding: "25px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
      color: "#333"
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginTop: "15px",
      marginBottom: "5px",
      color: "#444"
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
      fontSize: "14px",
      transition: "border-color 0.3s"
    },
    inputFocus: {
      borderColor: "#4da3ff"
    },
    row: {
      display: "flex",
      gap: "15px"
    },
    button: {
      width: "100%",
      background: "#28a745",
      color: "#fff",
      padding: "12px",
      marginTop: "20px",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: "15px",
      cursor: "pointer",
      transition: "background 0.3s"
    },
    buttonHover: {
      background: "#218838"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const mascotasData = await getDocs(collection(db, "mascotas"));
      setMascotas(mascotasData.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const voluntariosData = await getDocs(collection(db, "voluntarios"));
      setVoluntarios(voluntariosData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tareas"), {
        tipo,
        fecha,
        hora,
        veces,
        frecuencia,
        fechaFin,
        notifTiempo,
        idMascota,
        idVoluntario
      });
      alert("Tarea asignada con éxito");
      setTipo("");
      setFecha("");
      setHora("");
      setVeces(1);
      setFrecuencia("Día");
      setFechaFin("");
      setNotifTiempo(10);
      setIdMascota("");
      setIdVoluntario("");
    } catch (error) {
      alert("Error al asignar tarea: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Asignar Tarea</h2>
      <form onSubmit={handleSubmit}>
        {/* Mascota */}
        <label style={styles.label}>Mascota</label>
        <select style={styles.input} value={idMascota} onChange={(e) => setIdMascota(e.target.value)} required>
          <option value="">Seleccionar mascota</option>
          {mascotas.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        {/* Voluntario */}
        <label style={styles.label}>Voluntario</label>
        <select style={styles.input} value={idVoluntario} onChange={(e) => setIdVoluntario(e.target.value)} required>
          <option value="">Seleccionar voluntario</option>
          {voluntarios.map(v => (
            <option key={v.id} value={v.id}>{v.nombre}</option>
          ))}
        </select>

        {/* Categoría */}
        <label style={styles.label}>Categoría</label>
        <select style={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Seleccione</option>
          <option value="Higiene">Higiene</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Actividades">Actividades</option>
          <option value="Médico">Médico</option>
          <option value="Visitas Veterinarias">Visitas Veterinarias</option>
          <option value="Comida">Comida</option>
          <option value="Otro">Otro</option>
        </select>

        {/* Fecha y hora */}
        <label style={styles.label}>Fecha</label>
        <input style={styles.input} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

        <label style={styles.label}>Hora</label>
        <input style={styles.input} type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />

        {/* Veces y frecuencia */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Veces</label>
            <input style={styles.input} type="number" min="1" value={veces} onChange={(e) => setVeces(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Frecuencia</label>
            <select style={styles.input} value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
              <option>Día</option>
              <option>Semana</option>
              <option>Mes</option>
            </select>
          </div>
        </div>

        {/* Fecha de fin */}
        <label style={styles.label}>Fecha Fin</label>
        <input style={styles.input} type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

        {/* Notificación */}
        <label style={styles.label}>Notificación antes (minutos)</label>
        <input style={styles.input} type="number" value={notifTiempo} onChange={(e) => setNotifTiempo(e.target.value)} />

        {/* Botón */}
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
          onMouseOut={(e) => (e.target.style.background = styles.button.background)}
          type="submit"
        >
          Asignar
        </button>
      </form>
    </div>
  );
}
