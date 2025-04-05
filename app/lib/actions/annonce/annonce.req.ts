"use server";

import { auth } from "@/auth";
import { HttpRequest } from "../../request/request";

export const createAnnonceApi = async (credentials: any, id_eglise: number) =>
  await HttpRequest(`annonce/${id_eglise}`, "POST", credentials);

export const createLinkEventAndAnnonceApi = async (
  eventId: number,
  annonceId: number
) => await HttpRequest(`annonce/linkEvent/${eventId}/${annonceId}`, "PATCH");

export const findAnnonceByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `annonce/findByEgliseId/paginated/${id_eglise}?page=1&limit=100'`,
    "GET"
  );
export const findAnnoncePaginated = async (page = 1, limit = 100) => {
  const session = await auth();

  if (session) {
    const id_eglise = session.user?.eglise?.id_eglise;
    if (!session.user.eglise) {
      return await HttpRequest(`annonce?page=${page}&limit=${limit}`, "GET");
    } else {
      return await HttpRequest(
        `annonce/findByEgliseId/paginated/${id_eglise}/?page=${page}&limit=${limit}`,
        "GET"
      );
    }
  } else {
    return await HttpRequest(`annonce?page=${page}&limit=${limit}`, "GET");
  }
};
export const deleteAnnonceApi = async (id_annonce: number) =>
  await HttpRequest(`annonce/${id_annonce}`, "DELETE");
