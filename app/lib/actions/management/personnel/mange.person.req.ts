"use server";

import { HttpRequest } from "../../../request/request";

export const findManagementPersonnelApi = async (eglsieId: number) =>
  await HttpRequest(`personnel-management/findByEgliseId/${eglsieId}`);
