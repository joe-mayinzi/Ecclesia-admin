"use server";

import { HttpRequest } from "../../../request/request";

export const addManagementPersonnelApi = async (dto: {userId: number}) => await HttpRequest(`personnel-management`, "POST", dto);

export const findManagementPersonnelApi = async (eglsieId: number) => await HttpRequest(`personnel-management/findByEgliseId/${eglsieId}`);
