import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";

export default function MascotaForm() {
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
  const [fotoBase64, setFotoBase64] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const razasPorAnimal = {
    Perro: ["Labrador", "Bulldog", "Pastor Alemán", "Poodle", "Beagle"],
    Gato: ["Persa", "Siames", "Maine Coon", "Bengalí", "Sphynx"],
    Loro: ["Guacamayo", "Cacatúa", "Periquito", "Amazona"],
    Serpiente: ["Pitón", "Boa", "Cascabel", "Maicera"],
    Otro: ["Desconocida"]
  };

  useEffect(() => {
    const q = collection(db, "mascotas");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMascotas(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result);
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !tipo || !raza || !estadoAdopcion) {
      Swal.fire("Error", "Completa los campos requeridos", "error");
      return;
    }
    if (!fotoBase64) {
      Swal.fire("Error", "Debes seleccionar una foto", "error");
      return;
    }

    try {
      if (editandoId) {
        await updateDoc(doc(db, "mascotas", editandoId), {
          nombre, tipo, raza, sexo, edad, peso, color, estado, estadoAdopcion, nota, foto: fotoBase64
        });
        Swal.fire("Actualizado", "Mascota actualizada con éxito", "success");
      } else {
        await addDoc(collection(db, "mascotas"), {
          nombre, tipo, raza, sexo, edad, peso, color, estado, estadoAdopcion, nota, foto: fotoBase64,
          fechaRegistro: new Date(),
          historial: []
        });
        Swal.fire("Guardado", "Mascota registrada con éxito", "success");
      }
      limpiarFormulario();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
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
    setFotoBase64(null);
    setFotoPreview(null);
    setEditandoId(null);
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
    }
  };

  const editarMascota = (m) => {
    setNombre(m.nombre);
    setTipo(m.tipo);
    setRaza(m.raza);
    setSexo(m.sexo);
    setEdad(m.edad);
    setPeso(m.peso);
    setColor(m.color);
    setEstado(m.estado);
    setEstadoAdopcion(m.estadoAdopcion);
    setNota(m.nota);
    setFotoBase64(m.foto);
    setFotoPreview(m.foto);
    setEditandoId(m.id);
  };

  return (
    <div>
      <h2>{editandoId ? "Editar Mascota" : "Registrar Mascota"}</h2>

      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <label style={{ cursor: "pointer" }}>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
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
            {Object.keys(razasPorAnimal).map((animal) => <option key={animal} value={animal}>{animal}</option>)}
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
            <option value="">Estado de adopción</option>
            <option value="En adopción">En adopción</option>
            <option value="Adoptado">Adoptado</option>
            <option value="Voluntario temporal">Voluntario temporal</option>
          </select>
          <textarea placeholder="Añadir nota" value={nota} onChange={(e) => setNota(e.target.value)} style={{ width: "100%", marginBottom: "15px" }} />

          <div style={{ textAlign: "right" }}>
            <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}>
              {editandoId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      <h3>Lista de Mascotas</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Raza</th>
            <th>Estado adopción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td><img src={m.foto} alt={m.nombre} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} /></td>
              <td>{m.nombre}</td>
              <td>{m.tipo}</td>
              <td>{m.raza}</td>
              <td>{m.estadoAdopcion}</td>
              <td>
                <button onClick={() => editarMascota(m)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#007bff" }}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button onClick={() => eliminarMascota(m.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "red" }}>
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
