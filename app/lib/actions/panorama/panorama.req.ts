"use server";

import { HttpRequest } from "../../request/request";

/**
 * Fonction utilitaire pour extraire les données d'une réponse API
 * Gère différents formats de réponse (array direct, res.data, res.panoramas, etc.)
 */
function extractData<T>(res: any): T[] {
  if (!res) return [];
  
  // Si c'est déjà un tableau
  if (Array.isArray(res)) return res;
  
  // Si c'est une erreur
  if (res.statusCode >= 400 || res.error) {
    return [];
  }
  
  // Si les données sont dans res.data
  if (Array.isArray(res.data)) return res.data;
  
  // Si les données sont dans res.panoramas
  if (Array.isArray(res.panoramas)) return res.panoramas;
  
  // Si les données sont dans res.items
  if (Array.isArray(res.items)) return res.items;
  
  // Si c'est un objet unique, le retourner dans un tableau
  if (typeof res === "object" && res !== null && !res.statusCode) {
    return [res];
  }
  
  return [];
}

/**
 * Upload un panorama (vidéo biblique)
 * @param formData - FormData contenant le fichier vidéo
 * @returns La réponse du serveur avec les données du panorama créé
 */
export const uploadPanoramaApi = async (formData: FormData) => {
  try {
    const res = await HttpRequest("panorama", "POST", formData);

    if (!res || res.statusCode >= 400) {
      const errorMessage =
        typeof res?.message === "object"
          ? res.message.join(", ")
          : res?.message || "Erreur lors de l'upload du panorama";
      throw new Error(errorMessage);
    }

    return res;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de l'upload du panorama";
    console.error("uploadPanoramaApi:", error);
    throw new Error(errorMessage);
  }
};

/**
 * Récupère tous les panoramas avec pagination et filtrage par type
 * @param type - Type de panorama (ex: "New-testament", "Old-testament", etc.)
 * @param page - Numéro de page (défaut: 1)
 * @param limit - Nombre d'éléments par page (défaut: 50)
 * @returns Liste paginée des panoramas normalisée
 */
export const getAllPanoramasApi = async (
  type?: string,
  page: number = 1,
  limit: number = 50
): Promise<any[]> => {
  try {
    // Construire les paramètres de requête
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Ajouter le type si fourni
    if (type) {
      params.append("type", type);
    }

    // Utiliser la route /panorama/all avec les paramètres
    const res = await HttpRequest(`panorama/all?${params.toString()}`, "GET");

    if (res && (res.statusCode >= 400 || res.error)) {
      const errorMessage =
        typeof res?.message === "object"
          ? res.message.join(", ")
          : res?.message || "Erreur lors de la récupération des panoramas";
      throw new Error(errorMessage);
    }

    // Normaliser la réponse pour toujours retourner un tableau
    return extractData<any>(res);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des panoramas";
    console.error("getAllPanoramasApi:", error);
    throw new Error(errorMessage);
  }
};

/**
 * Récupère tous les panoramas sans pagination
 * @param type - Type de panorama optionnel (ex: "New-testament", "Old-testament", etc.)
 * @returns Liste complète des panoramas normalisée (toujours un tableau)
 */
export const getAllPanoramasWithoutPaginationApi = async (
  type?: string
): Promise<any[]> => {
  try {
    // Construire les paramètres de requête
    const params = new URLSearchParams();

    // Ajouter le type si fourni
    if (type) {
      params.append("type", type);
    }

    // Utiliser la route /panorama/all sans pagination (ou avec une limite très élevée)
    const queryString = params.toString();
    const res = await HttpRequest(
      `panorama/all${queryString ? `?${queryString}` : ""}`,
      "GET"
    );

    if (res && (res.statusCode >= 400 || res.error)) {
      const errorMessage =
        typeof res?.message === "object"
          ? res.message.join(", ")
          : res?.message || "Erreur lors de la récupération des panoramas";
      throw new Error(errorMessage);
    }

    // Normaliser la réponse pour toujours retourner un tableau
    return extractData<any>(res);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des panoramas";
    console.error("getAllPanoramasWithoutPaginationApi:", error);
    throw new Error(errorMessage);
  }
};


/**
 * Supprime un panorama
 * @param id - ID du panorama à supprimer
 * @returns La réponse du serveur
 */
export const deletePanoramaApi = async (id: number | string) => {
  try {
    const panoramaId = typeof id === "string" ? parseInt(id, 10) : id;

    if (isNaN(panoramaId)) {
      throw new Error("ID panorama invalide");
    }

    const res = await HttpRequest(`panorama/${panoramaId}`, "DELETE");

    if (!res || res.statusCode >= 400) {
      throw new Error(res?.message || "Erreur lors de la suppression du panorama");
    }

    return res;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de la suppression du panorama";
    console.error("deletePanoramaApi:", error);
    throw new Error(errorMessage);
  }
};

