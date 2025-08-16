import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; 
import fondo from "../assets/fondo.jpg"; 
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const q = query(collection(db, "usuarios"), where("correo", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const rol = userData.rol;

        switch (rol) {
          case "admin":
            navigate("/admin");
            break;
          case "voluntario":
            navigate("/voluntario");
            break;
          case "dueño":
            navigate("/dueno");
            break;
          default:
            setErrorMsg("Rol no reconocido.");
        }
      } else {
        setErrorMsg("No se encontró el usuario en la base de datos.");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") setErrorMsg("Usuario no registrado.");
      else if (error.code === "auth/wrong-password") setErrorMsg("Contraseña incorrecta.");
      else setErrorMsg("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "15px",
      }}
    >
      <div
        className="card shadow-lg p-4 w-100"
        style={{
          maxWidth: "420px",      
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="img-fluid mb-3" style={{ maxWidth: "120px" }} />
          <h4>Iniciar Sesión</h4>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Ingresar</button>
        </form>

        <div className="text-center mt-3">
          <a href="#" className="text-muted" style={{ fontSize: "0.9rem" }}>¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
