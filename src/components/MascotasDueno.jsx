import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Swal from "sweetalert2";

export default function MascotasDueno({ idDueno }) {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [color, setColor] = useState("");
  const [estado, setEstado] = useState("");
  const [estadoAdopcion, setEstadoAdopcion] = useState(""); 
  const [nota, setNota] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const razasPorAnimal = {
    Perro: ["Labrador", "Bulldog", "Pastor Alemán", "Poodle", "Beagle"],
    Gato: ["Persa", "Siames", "Maine Coon", "Bengalí", "Sphynx"],
    Loro: ["Guacamayo", "Cacatúa", "Periquito", "Amazona"],
    Serpiente: ["Pitón", "Boa", "Cascabel", "Maicera"],
    Otro: ["Desconocida"]
  };

  const getMascotas = async () => {
    const querySnapshot = await getDocs(collection(db, "mascotas"));
    const mascotasData = [];
    querySnapshot.forEach((mascotaDoc) => {
      const mascota = { id: mascotaDoc.id, ...mascotaDoc.data() };
      if (mascota.idDueno === idDueno) mascotasData.push(mascota);
    });
    setMascotas(mascotasData);
  };

  useEffect(() => {
    getMascotas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !tipo || !raza) {
      Swal.fire("Error", "Completa al menos Nombre, Tipo y Raza", "error");
      return;
    }
    try {
      let fotoURL = fotoPreview;
      if (fotoFile) {
        const storageRef = ref(storage, `mascotas/${idDueno}_${Date.now()}_${fotoFile.name}`);
        await uploadBytes(storageRef, fotoFile);
        fotoURL = await getDownloadURL(storageRef);
      }

      const mascotaData = {
        idDueno,
        nombre,
        tipo,
        raza,
        sexo,
        edad,
        peso,
        color,
        estado,
        estadoAdopcion, 
        nota,
        foto: fotoURL || "",
        fechaRegistro: new Date(),
        historial: []
      };

      if (editandoId) {
        const mascotaRef = doc(db, "mascotas", editandoId);
        await updateDoc(mascotaRef, mascotaData);
        Swal.fire("Actualizado", "Mascota actualizada con éxito", "success");
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "mascotas"), mascotaData);
        Swal.fire("Guardado", "Mascota registrada con éxito", "success");
      }

      limpiarFormulario();
      getMascotas();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (m) => {
    setNombre(m.nombre);
    setTipo(m.tipo);
    setRaza(m.raza);
    setSexo(m.sexo);
    setEdad(m.edad);
    setPeso(m.peso);
    setColor(m.color);
    setEstado(m.estado);
    setEstadoAdopcion(m.estadoAdopcion || "");
    setNota(m.nota);
    setFotoPreview(m.foto || null);
    setFotoFile(null);
    setEditandoId(m.id);
  };

  const handleDelete = async (m) => {
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
      try {
        if (m.foto) {
          const fotoRef = ref(storage, m.foto);
          try { await deleteObject(fotoRef); } catch {}
        }
        await deleteDoc(doc(db, "mascotas", m.id));
        Swal.fire("Eliminado", "La mascota ha sido eliminada", "success");
        if (editandoId === m.id) limpiarFormulario();
        getMascotas();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar la mascota: " + error.message, "error");
      }
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setTipo("");
    setRaza("");
    setSexo("");
    setEdad("");
    setPeso("");
    setColor("");
    setEstado("");
    setEstadoAdopcion("");
    setNota("");
    setFotoFile(null);
    setFotoPreview(null);
    setEditandoId(null);
  };

  return (
    <div>
      <h2>Mis Mascotas</h2>

      {/* Formulario */}
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFotoFile(e.target.files[0]);
                  setFotoPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #ccc",
                margin: "0 auto"
              }}>
                {fotoPreview ? (
                  <img src={fotoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ lineHeight: "120px", display: "block", color: "#888" }}>Foto</span>
                )}
              </div>
            </label>
          </div>

          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <select value={tipo} onChange={(e) => { setTipo(e.target.value); setRaza(""); }} style={{ width: "100%", marginBottom: "10px" }}>
            <option value="">Elige un animal</option>
            {Object.keys(razasPorAnimal).map((animal) => (
              <option key={animal} value={animal}>{animal}</option>
            ))}
          </select>
          <select value={raza} onChange={(e) => setRaza(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
            <option value="">Elige una raza</option>
            {tipo && razasPorAnimal[tipo]?.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
            <option value="">Sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          <input type="number" placeholder="Edad (años)" value={edad} onChange={(e) => setEdad(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
            <option value="">Estado reproductivo</option>
            <option value="Intacto">Intacto</option>
            <option value="Castrado">Castrado</option>
          </select>
          <select value={estadoAdopcion} onChange={(e) => setEstadoAdopcion(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
            <option value="">Situación</option>
            <option value="En adopción">En adopción</option>
            <option value="Adoptado">Adoptado</option>
            <option value="Con voluntario temporal">Con voluntario temporal</option>
          </select>
          <textarea placeholder="Añadir nota" value={nota} onChange={(e) => setNota(e.target.value)} style={{ width: "100%", marginBottom: "15px" }} />
          <div style={{ textAlign: "right" }}>
            <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}>
              {editandoId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de mascotas */}
      {mascotas.length === 0 && <p>No tienes mascotas registradas</p>}
      {mascotas.map((m) => (
        <div key={m.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h3>{m.nombre} ({m.tipo})</h3>
          {m.foto && <img src={m.foto} alt={m.nombre} style={{ width: "100px", borderRadius: "50%" }} />}
          <p>Raza: {m.raza}</p>
          <p>Sexo: {m.sexo} | Edad: {m.edad} años | Peso: {m.peso} kg</p>
          <p>Color: {m.color} | Estado reproductivo: {m.estado}</p>
          <p>Situación: {m.estadoAdopcion || "No especificado"}</p>
          <p>Nota: {m.nota}</p>
          <button onClick={() => handleEdit(m)} style={{ marginRight: "10px" }}>Editar</button>
          <button onClick={() => handleDelete(m)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
