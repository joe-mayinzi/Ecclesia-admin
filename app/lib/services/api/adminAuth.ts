import { HttpRequest } from "../../../lib/request/request";

export const findAllEglisse = () => HttpRequest(`eglise/getalleglises`, "GET");

export interface IsendEmail {
  to: string;
  subject: string;
  body: string;
}
export const SendMail = (mail: IsendEmail) =>
  HttpRequest(`mail/send`, "POST", mail);

export const UpdateChurche = (data: any, id: number) =>
  HttpRequest(`eglise/updateeglise/${id}`, "PUT", data);

export const BloquerEglise = (id: number, status: any) =>
  HttpRequest(`eglise/updateeglise/${id}`, "PUT", status);

export const DeleteEglise = (id: number) =>
  HttpRequest(`eglise/deleteeglise/${id}`, "DELETE");

export const findAllAdmin = () => HttpRequest(`auth/getAllAdmin`, "GET");

export const DeleteAdmin = (id: number) =>
  HttpRequest(`auth/delete/admin/${id}`, "DELETE");
