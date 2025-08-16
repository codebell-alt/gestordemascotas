const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 📌 Crear usuario
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Debes iniciar sesión para realizar esta acción."
    );
  }

  const callerDoc = await db.collection("usuarios").doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().rol !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "No tienes permiso para crear usuarios."
    );
  }

  const { email, password, username, rol } = data;
  if (!email || !password || !username || !rol) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Todos los campos (email, password, username, rol) son obligatorios."
    );
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    await db.collection("usuarios").doc(userRecord.uid).set({
      username,
      correo: email,
      rol,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: "Usuario creado exitosamente", uid: userRecord.uid };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Error al crear usuario: " + error.message
    );
  }
});

// 📌 Eliminar usuario
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  console.log("Solicitud de eliminación recibida:", data);

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Debes iniciar sesión para realizar esta acción."
    );
  }

  const callerDoc = await db.collection("usuarios").doc(context.auth.uid).get();
  console.log("Solicitante:", callerDoc.data());

  if (!callerDoc.exists || callerDoc.data().rol !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "No tienes permiso para eliminar usuarios."
    );
  }

  const { uid } = data;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "El UID del usuario es obligatorio."
    );
  }

  try {
    console.log("Verificando existencia del usuario en Auth:", uid);
    await admin.auth().getUser(uid); // Verifica que exista
    console.log("Usuario encontrado en Auth, procediendo a eliminar...");

    await admin.auth().deleteUser(uid);
    await db.collection("usuarios").doc(uid).delete();

    console.log("Usuario eliminado correctamente");
    return { message: "Usuario eliminado exitosamente" };
  } catch (error) {
    console.error("Error exacto al eliminar usuario:", error);

    if (error.code === "auth/user-not-found") {
      throw new functions.https.HttpsError(
        "not-found",
        "El usuario no existe en Authentication"
      );
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error al eliminar usuario: " + error.message
    );
  }
});
