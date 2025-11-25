import { NextRequest, NextResponse } from "next/server";
import { api_url } from "@/app/lib/request/request";
import { auth } from "@/auth";

/**
 * Route API pour uploader un panorama (vidéo biblique)
 * POST /api/panorama
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const token = session?.user?.access_token;

    if (!token) {
      return NextResponse.json(
        { message: "Utilisateur non connecté" },
        { status: 401 }
      );
    }

    // Récupérer le FormData depuis la requête
    const formData = await req.formData();

    // Récupérer les fichiers
    const panoramaFile = formData.get("panorama") as File | null;
    const imageFile = formData.get("image") as File | null;

    // Vérifier qu'au moins un fichier panorama est présent
    if (!panoramaFile) {
      return NextResponse.json(
        { message: "Aucun fichier panorama fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier panorama (vidéo)
    const validVideoTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!validVideoTypes.includes(panoramaFile.type)) {
      return NextResponse.json(
        {
          message: `Type de fichier panorama non supporté. Types acceptés: ${validVideoTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier panorama (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (panoramaFile.size > maxSize) {
      return NextResponse.json(
        { message: "Le fichier panorama est trop volumineux (max 500MB)" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier image si présent
    if (imageFile) {
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            message: `Type de fichier image non supporté. Types acceptés: ${validImageTypes.join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Vérifier la taille de l'image (max 10MB)
      const maxImageSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxImageSize) {
        return NextResponse.json(
          { message: "Le fichier image est trop volumineux (max 10MB)" },
          { status: 400 }
        );
      }
    }

    // Créer un nouveau FormData pour l'envoyer au backend
    const backendFormData = new FormData();
    backendFormData.append("panorama", panoramaFile);
    
    if (imageFile) {
      backendFormData.append("image", imageFile);
    }

    // Récupérer les champs JSON optionnels
    const type = formData.get("type") as string | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    // Créer l'objet JSON pour les données (comme spécifié: "Champs de données (JSON body)")
    const jsonData: {
      type?: string;
      title?: string;
      description?: string;
    } = {};

    if (type && (type === "New-testament" || type === "Old-testament")) {
      jsonData.type = type;
    }
    if (title && title.trim()) {
      jsonData.title = title.trim();
    }
    if (description && description.trim()) {
      jsonData.description = description.trim();
    }

    // Ajouter les données JSON au FormData (sérialisées dans un champ "data")
    // L'API backend pourra parser ce JSON
    if (Object.keys(jsonData).length > 0) {
      backendFormData.append("data", JSON.stringify(jsonData));
    }

    // Appel au backend
    const res = await fetch(`${api_url}panorama`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    // Récupérer la réponse
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = { message: text || "Erreur inconnue du backend" };
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

