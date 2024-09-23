"use server";

import { HttpRequest } from "../../request/request";

export const findAbonnementByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `abonnement/findByEgliseId/paginated/${id_eglise}?page=1&limit=100'`,
    "GET",
  );
export const checkedIsExpiredAbonnement = async (id_eglise: number) =>
  await HttpRequest(`abonnement/isExpired/${id_eglise}`, "GET");
