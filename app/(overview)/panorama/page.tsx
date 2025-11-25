import { getAllPanoramasApi } from "@/app/lib/actions/panorama/panorama.req";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PanoramaPageClient from "./page.client";

export default async function PanoramaPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  try {
    // La fonction getAllPanoramasApi retourne maintenant toujours un tableau normalisé
    const data = await getAllPanoramasApi();
    return <PanoramaPageClient initialData={data} />;
  } catch (error) {
    console.error("Erreur lors de la récupération des panoramas:", error);
    return <PanoramaPageClient initialData={[]} />;
  }
}

