import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import Swal from "sweetalert2";

export default function AdminRegisterUser({ inputClass, buttonClass, labelClass }) {
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("dueño");
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);

  // 🔹 Cargar usuarios desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const listaUsuarios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(listaUsuarios);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Registrar o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !correo || (!editando && !password) || !rol) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      if (editando) {
        await updateDoc(doc(db, "usuarios", editando), { username, correo, rol });
        Swal.fire("Actualizado", "Usuario actualizado con éxito", "success");
        setEditando(null);
      } else {
        const credenciales = await createUserWithEmailAndPassword(auth, correo, password);
        const uid = credenciales.user.uid;
        await setDoc(doc(db, "usuarios", uid), { username, correo, rol });
        Swal.fire("Registrado", "Usuario registrado con éxito", "success");
      }

      setUsername("");
      setCorreo("");
      setPassword("");
      setRol("dueño");

    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.code, "error");
    }
  };

  // 🔹 Eliminar usuario solo de Firestore con SweetAlert2
  const handleDelete = async (uid) => {
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
        await deleteDoc(doc(db, "usuarios", uid));
        Swal.fire("Eliminado", "Usuario eliminado de la base de datos", "success");

        if (editando === uid) {
          setUsername("");
          setCorreo("");
          setPassword("");
          setRol("dueño");
          setEditando(null);
        }

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el usuario: " + error.message, "error");
      }
    }
  };

  const handleEdit = (usuario) => {
    setUsername(usuario.username);
    setCorreo(usuario.correo);
    setRol(usuario.rol);
    setEditando(usuario.id);
    setPassword(""); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className={labelClass}>Nombre de usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Correo electrónico:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={inputClass}
        />

        {!editando && (
          <>
            <label className={labelClass}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </>
        )}

        <label className={labelClass}>Rol:</label>
        <select value={rol} onChange={(e) => setRol(e.target.value)} className={inputClass}>
          <option value="admin">Administrador</option>
          <option value="dueño">Dueño</option>
          <option value="voluntario">Voluntario</option>
        </select>

        <button type="submit" className={buttonClass}>
          {editando ? "Actualizar Usuario" : "Registrar Usuario"}
        </button>
      </form>

      <h5 className="mt-4">Lista de Usuarios</h5>
      <table className="table table-striped table-bordered mt-2 align-middle">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td className="text-center">
                <button
                  className="btn btn-warning btn-sm me-2"
                  title="Editar"
                  onClick={() => handleEdit(u)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  title="Eliminar"
                  onClick={() => handleDelete(u.id)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
