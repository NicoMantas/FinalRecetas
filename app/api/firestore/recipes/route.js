import { getFirestore, collection, doc, setDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { app } from "../../../../firebase/firebase.js";
import { NextResponse } from "next/server";

const firestore = getFirestore(app);

export async function POST(req) {
  try {
    const data = await req.json();

    // Validación básica
    if (!data.title || !data.ingredients || !data.createdBy) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Generar el documento de Firestore
    const docRef = doc(collection(firestore, "recipes"));
    
    // Crear el documento en Firestore con los datos
    await setDoc(docRef, {
      ...data,
      id: docRef.id,  // Asignar ID aquí después de la creación
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error al guardar la receta" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(firestore, "recipes"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,  // Incluye el ID del documento para cada receta
      ...doc.data(),
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error al obtener recetas" }, { status: 500 });
  }
}
