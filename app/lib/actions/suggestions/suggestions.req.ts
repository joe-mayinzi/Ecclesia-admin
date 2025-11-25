"use server";

import { api_url, front_url, HttpRequest } from "../../request/request";

export const findAllSuggestions = async () =>
  await HttpRequest(`suggestion`, "GET");

/**
 * Récupère les suggestions avec pagination
 * @param page - Numéro de page (défaut: 1)
 * @param limit - Nombre d'éléments par page (défaut: 10)
 */
export const getSuggestionsApi = async (page = 1, limit = 10) => {
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

export async function respondToUserSuggestion(suggestionId: number, data: { message: string; suggestionId: number }) {
    const staticToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM2Miwibm9tIjoiRG9lIiwicHJlbm9tIjoiSm9obiIsInRlbGVwaG9uZSI6IisyNDM5MTExNDQyMjAiLCJlbWFpbCI6ImpvZWxkaXNpZGkxMjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJqb2UxMjMiLCJwcm9maWwiOm51bGwsInByaXZpbGVnZV91c2VyIjoiYWRtaW5pc3RyYXRldXIiLCJlZ2xpc2UiOnsiaWRfZWdsaXNlIjozMiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0yMlQxOTozOToxMC43OTFaIiwibm9tX2VnbGlzZSI6IkNlbnRyZSBkJ8OpdmFuZ8OpbGlzYXRpb24gbGVzIGVudm95w6lzICIsInNpZ2xlX2VnbGlzZSI6IkMuRSBMZXMgRW52b3nDqXMgIiwicGhvdG9fZWdsaXNlIjoicGhvdG8vZWNjbGVzaWEtcGhvdG8tM2E5YTJlMWMtZWYxMS00MTAzLThkNzgtMTg5Y2FlMDMxMTM1LmpwZyIsImNvdXZlcnR1cmVfZWdsaXNlIjoicGhvdG8vZWNjbGVzaWEtcGhvdG8tYjlhOTc1NzAtMDk2Yy00MDc0LWE1Y2UtNTdkZjA1MzM2ZjBmLnBuZyIsImNvdXZlcnR1cmVfc2l0ZV9lZ2xpc2UiOm51bGwsImFkcmVzc2VfZWdsaXNlIjoiQy5FIExlcyBFbnZvecOpcyAiLCJ2aWxsZV9lZ2xpc2UiOiJLaW5zaGFzYSAiLCJ1c2VybmFtZV9lZ2xpc2UiOiJjZW50cmVfZGV2YW5nZWxpc2F0aW9uX2xlc19lbnZveWVzXyJ9LCJ2aWxsZSI6IlBhcmlzIiwicGF5cyI6IkZyYW5jZSIsImFkcmVzc2UiOiIxMjMgUnVlIGRlIFBhcmlzIiwiaWF0IjoxNzUyMTIyNTQ2LCJleHAiOjE3NTc0NzkzNDZ9.-WM_S3HCYqioj6GufDZoMHbjd4g7HxjkukK6ZaWaP2M"
    const res = await fetch(`${api_url}suggestion/${suggestionId}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${staticToken}`,
        },
        body: JSON.stringify(data),
    });

  if (!res.ok) {
    throw new Error("Erreur lors de l'envoi de la réponse");
  }
  return res.json();
}
