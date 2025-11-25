"use server";

import { api_url, front_url, HttpRequest } from "../../request/request";

export const findAllSuggestions = async () =>
  await HttpRequest(`suggestion`, "GET");

/**
 * Récupère les suggestions avec pagination
 * @param page - Numéro de page (défaut: 1)
 * @param limit - Nombre d'éléments par page (défaut: 10)
 */
export const getSuggestionsApi = async (page = 1, limit = 1000) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();
  const res = await HttpRequest(`suggestion?${query}`, "GET");

  if (!res || (res.statusCode && res.statusCode >= 400)) {
    throw new Error(res?.message || "Erreur lors de la récupération des suggestions");
  }

  return res;
};

/**
 * Répondre à une suggestion utilisateur
 * @param suggestionId - ID de la suggestion
 * @param data - Données de la réponse (message)
 */
export async function respondToUserSuggestion(
  suggestionId: number,
  data: { message: string }
) {
  try {
    const res = await HttpRequest(
      `suggestion/user/${suggestionId}`,
      "POST",
      data
    );

    if (!res || (res.statusCode && res.statusCode >= 400)) {
      const errorMessage =
        typeof res?.message === "object"
          ? res.message.join(", ")
          : res?.message || "Erreur lors de l'envoi de la réponse";
      throw new Error(errorMessage);
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur lors de l'envoi de la réponse");
  }
}
