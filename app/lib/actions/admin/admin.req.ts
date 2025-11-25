"use server"

import { log } from "console";
import { HttpRequest } from "../../request/request";
import { api_url } from "../../request/request";



export const getAllAdminsApi = async (page = 1, limit = 50) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() }).toString();
  return await HttpRequest(`admin/all?${query}`, "GET");
};


export const deleteAdminApi = async (id: number) => {
  const res = await HttpRequest(`admin/${id}`, "DELETE");

  if (!res || res.statusCode >= 400) {
    throw new Error(res?.message || "Erreur lors de la suppression");
  }

  return res;
};

/**
 * Mettre à jour un admin
 * @param id - ID de l'admin à mettre à jour
 * @param data - Données à mettre à jour
 */
export const updateAdminApi = async (id: number, data: any) => {
  const res = await HttpRequest(
    `${api_url}/${id}`, // ID dynamique
    "PUT",
    data
  );

  if (!res || res.statusCode >= 400) {
    throw new Error(res?.message || "Erreur lors de la mise à jour de l'admin");
  }

  return res;
};

/**
 * Active ou désactive un compte admin
 * @param id - ID de l'admin
 * @param newStatus - "Actif" ou "Inactif"
 */
export const toggleAdminStatusApi = async (
  id: number,
  newStatus: "Actif" | "Inactif"
) => {
  try {
    // Utilise un chemin relatif, pas la base complète
    const res = await HttpRequest(
      `admin/${id}/status`,
      "PATCH",
      { status: newStatus } // body avec le nouveau statut
    );

    if (!res || res.statusCode >= 400) {
      throw new Error(res?.message || "Erreur lors de la mise à jour du statut");
    }

    return res;
  } catch (err: any) {
    console.error("toggleAdminStatusApi:", err);
    throw new Error(err?.message || "Erreur serveur");
  }
};

export const getAllUsersApi = async (page = 1, limit = 12) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  return await HttpRequest(`user?${query}`, "GET");
 
};

export const toggleUserStatusApi = async (id: number | string, status: string) => {
  try {
    const body = { status }; // le backend attend { status: "Actif" | "Bloqué" }
    const res = await HttpRequest(`user/${id}`, "PATCH", body);
    return res;
  } catch (error) {
    throw new Error("Impossible de mettre à jour le statut de l'utilisateur");
  }
};

export const getSignalesApi = async (
  typeContent: string,
  page: number = 1,
  limit: number = 10
) => {
  if (!typeContent) {
    throw new Error("Le paramètre typeContent est obligatoire");
  }

  const query = new URLSearchParams({
    typeContent,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const res = await HttpRequest(
    `signale?${query}`,
    "GET"
  );

  if (!res || res.statusCode >= 400) {
    throw new Error(res?.message || "Erreur lors de la récupération des signalements");
  }
  console.log("Result",res);
  
  return res;
};

export const getVideoStatsApi = async () => {
  const res = await HttpRequest("stats", "GET");

  if (!res || res.statusCode >= 400) {
    throw new Error(res?.message || "Erreur lors de la récupération des stats");
  }

  // res.videos contient déjà toutes les vidéos
  const videos = Array.isArray(res.videos) ? res.videos : [];

  return videos;
};

// app/lib/actions/admin/admin.req.ts
export const getAudioStatsApi = async () => {
  const res = await HttpRequest("stats", "GET");

  if (!res || res.statusCode >= 400) {
    throw new Error(res?.message || "Erreur lors de la récupération des stats audios");
  }

  // res.audios contient déjà toutes les audios
  const audios = Array.isArray(res.audios) ? res.audios : [];

  return audios;
};



