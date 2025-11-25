import { NextRequest, NextResponse } from "next/server";
import { api_url } from "@/app/lib/request/request";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const token = session?.user?.access_token;

    console.log("vrai token : ", token);
    

    console.log("Token envoyé au backend:", token);

    if (!token) {
      return NextResponse.json(
        { message: "Utilisateur non connecté" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Appel réel au backend
    const res = await fetch(`${api_url}admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // On récupère la réponse soit en JSON soit en texte
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = { message: text || "Erreur inconnue du backend" };
    }

    // Logs pour debug complet
    console.log("Backend status:", res.status);
    console.log("Backend response:", data);

    // On renvoie le status réel du backend
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Erreur serveur Next.js:", err);
    return NextResponse.json(
      { message: "Erreur serveur Next.js, réessayez plus tard" },
      { status: 500 }
    );
  }
}
