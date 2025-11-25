import { NextRequest, NextResponse } from "next/server";
import { api_url } from "@/app/lib/request/request";
import { auth } from "@/auth";

/**
 * Route API pour marquer un signalement comme résolu
 * PATCH /api/signalement/[id]/resolve
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const token = session?.user?.access_token;

    if (!token) {
      return NextResponse.json(
        { message: "Utilisateur non connecté" },
        { status: 401 }
      );
    }

    const signalementId = params.id;

    if (!signalementId) {
      return NextResponse.json(
        { message: "ID du signalement manquant" },
        { status: 400 }
      );
    }

    // Appel au backend
    const res = await fetch(`${api_url}signale/${signalementId}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resolved: true }),
    });

    // Récupérer la réponse
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = { message: text || "Erreur inconnue du backend" };
    }

    // Si l'endpoint n'existe pas (404), on peut essayer une alternative
    if (res.status === 404) {
      // Essayer avec PUT au lieu de PATCH
      const resPut = await fetch(`${api_url}signale/${signalementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolved: true }),
      });

      let dataPut;
      try {
        dataPut = await resPut.json();
      } catch {
        const text = await resPut.text();
        dataPut = { message: text || "Erreur inconnue du backend" };
      }

      return NextResponse.json(dataPut, { status: resPut.status });
    }

    // Logs pour debug
    console.log("Backend status:", res.status);
    console.log("Backend response:", data);

    // Retourner la réponse avec le status du backend
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Erreur serveur Next.js:", err);
    return NextResponse.json(
      { message: "Erreur serveur Next.js, réessayez plus tard" },
      { status: 500 }
    );
  }
}

