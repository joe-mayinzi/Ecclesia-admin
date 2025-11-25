import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./page.client";
import { getAllUsersApi, getAllAdminsApi, getVideoStatsApi, getAudioStatsApi, getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { getSuggestionsApi } from "@/app/lib/actions/suggestions/suggestions.req";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin"); // 🔑 redirection côté serveur vers la page de login
  }

  // Récupération des statistiques
  try {
    const [usersResult, adminsResult, videos, audios, suggestionsResult] = await Promise.all([
      getAllUsersApi(1, 1000), // Récupérer un grand nombre pour compter
      getAllAdminsApi(1, 1000), // Récupérer un grand nombre pour compter
      getVideoStatsApi(),
      getAudioStatsApi(),
      getSuggestionsApi(1, 1000), // Récupérer un grand nombre pour compter
    ]);

    // Compter les utilisateurs
    let totalUsers = 0;
    if (Array.isArray(usersResult)) {
      totalUsers = usersResult.length;
    } else if (usersResult?.data && Array.isArray(usersResult.data)) {
      totalUsers = usersResult.data.length;
    } else if (usersResult?.meta?.total) {
      totalUsers = usersResult.meta.total;
    }

    // Compter les admins
    let totalAdmins = 0;
    if (Array.isArray(adminsResult)) {
      totalAdmins = adminsResult.length;
    } else if (adminsResult?.data && Array.isArray(adminsResult.data)) {
      totalAdmins = adminsResult.data.length;
    } else if (adminsResult?.meta?.total) {
      totalAdmins = adminsResult.meta.total;
    }

    // Compter les vidéos et audios
    const totalVideos = Array.isArray(videos) ? videos.length : 0;
    const totalAudios = Array.isArray(audios) ? audios.length : 0;

    // Compter les suggestions
    let totalSuggestions = 0;
    if (Array.isArray(suggestionsResult)) {
      totalSuggestions = suggestionsResult.length;
    } else if (suggestionsResult?.data && Array.isArray(suggestionsResult.data)) {
      totalSuggestions = suggestionsResult.data.length;
    } else if (suggestionsResult?.meta?.total) {
      totalSuggestions = suggestionsResult.meta.total;
    } else if (suggestionsResult?.suggestions && Array.isArray(suggestionsResult.suggestions)) {
      totalSuggestions = suggestionsResult.suggestions.length;
    }

    // Récupérer tous les signalements (tous types confondus)
    let totalSignals = 0;
    try {
      const signalTypes = ["videos", "audios", "images", "forum", "testimonials"];
      const signalPromises = signalTypes.map(type => getSignalesApi(type, 1, 1000));
      const allSignals = await Promise.all(signalPromises);
      totalSignals = allSignals.reduce((sum, signals) => {
        const count = Array.isArray(signals) ? signals.length : 0;
        return sum + count;
      }, 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error);
    }

    const stats = {
      totalUsers,
      totalAdmins,
      totalVideos,
      totalAudios,
      totalSignals,
      totalSuggestions,
    };

    return <DashboardClient stats={stats} />;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    // En cas d'erreur, afficher avec des valeurs par défaut
    return (
      <DashboardClient
        stats={{
          totalUsers: 0,
          totalAdmins: 0,
          totalVideos: 0,
          totalAudios: 0,
          totalSignals: 0,
          totalSuggestions: 0,
        }}
      />
    );
  }
}

