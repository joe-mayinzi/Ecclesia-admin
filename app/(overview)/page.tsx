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

    // Logs de débogage (à retirer en production si nécessaire)
    console.log("Users result structure:", {
      isArray: Array.isArray(usersResult),
      hasData: !!usersResult?.data,
      hasMeta: !!usersResult?.meta,
      metaTotal: usersResult?.meta?.total,
      dataLength: Array.isArray(usersResult?.data) ? usersResult.data.length : null,
      directLength: Array.isArray(usersResult) ? usersResult.length : null,
    });
    console.log("Admins result structure:", {
      isArray: Array.isArray(adminsResult),
      hasData: !!adminsResult?.data,
      hasMeta: !!adminsResult?.meta,
      metaTotal: adminsResult?.meta?.total,
      dataLength: Array.isArray(adminsResult?.data) ? adminsResult.data.length : null,
      directLength: Array.isArray(adminsResult) ? adminsResult.length : null,
    });

    // Fonction helper pour extraire le total d'une réponse paginée
    const getTotalFromResponse = (response: any): number => {
      // Priorité 1: meta.total (le vrai total)
      if (response?.meta?.total !== undefined && typeof response.meta.total === 'number') {
        return response.meta.total;
      }
      // Priorité 2: total direct
      if (response?.total !== undefined && typeof response.total === 'number') {
        return response.total;
      }
      // Priorité 3: compter les éléments dans data
      if (response?.data && Array.isArray(response.data)) {
        return response.data.length;
      }
      // Priorité 4: compter les éléments si c'est un tableau direct
      if (Array.isArray(response)) {
        return response.length;
      }
      // Priorité 5: autres structures possibles
      if (response?.suggestions && Array.isArray(response.suggestions)) {
        return response.suggestions.length;
      }
      return 0;
    };

    // Compter les utilisateurs (prioriser meta.total)
    const totalUsers = getTotalFromResponse(usersResult);

    // Compter les admins (prioriser meta.total)
    const totalAdmins = getTotalFromResponse(adminsResult);

    // Compter les vidéos et audios
    const totalVideos = getTotalFromResponse(videos);
    const totalAudios = getTotalFromResponse(audios);

    // Compter les suggestions (prioriser meta.total)
    const totalSuggestions = getTotalFromResponse(suggestionsResult);

    // Récupérer tous les signalements (tous types confondus)
    let totalSignals = 0;
    try {
      const signalTypes = ["videos", "audios", "images", "forum", "testimonials"];
      const signalPromises = signalTypes.map(type => getSignalesApi(type, 1, 1000));
      const allSignals = await Promise.all(signalPromises);
      totalSignals = allSignals.reduce((sum, signals) => {
        return sum + getTotalFromResponse(signals);
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

    // Log des totaux calculés pour débogage
    console.log("Stats calculées:", stats);

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

