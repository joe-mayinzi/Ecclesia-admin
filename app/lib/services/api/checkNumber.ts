"use server";

import { HttpRequest } from "../../request/request";

export const AuthGetUserByTel = async (tel: string) =>
  await HttpRequest(`auth/getUserByTel?telephone=${tel}`, "GET");
export const AuthUpdatePassword = async (
  dto: { password: string },
  id: string,
) => await HttpRequest(`auth/updatePassword/${id}`, "PATCH", dto);
