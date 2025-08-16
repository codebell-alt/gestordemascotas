// Importa los módulos necesarios de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage"; // 

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCoqRQbyqesdtCfMdmy-36QmxWIeBfIJQ8",
  authDomain: "gestor-mascotas-440b9.firebaseapp.com",
  projectId: "gestor-mascotas-440b9",
  storageBucket: "gestor-mascotas-440b9.appspot.com",
  messagingSenderId: "490617089821",
  appId: "1:490617089821:web:076c2cec2c73df23d7bbf4",
  measurementId: "G-XYYG9F3FP3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app); // 
