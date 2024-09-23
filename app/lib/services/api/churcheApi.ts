"use server";

import { HttpRequest } from "../../../lib/request/request";

export interface createChurche {
  nom_eglise: string;
  photo_eglise: string;
  sigle_eglise: string;
  adresse_eglise: string;
  ville_eglise: string;
  pays_eglise: string;
}
export interface createDayForAppointmentDto {
  jour: string;
  limite: number;
  startTime: string;
  endTime: string;
}

export interface postponeAppointmentDto {
  postponeDate: string;
  motif: string;
}

export const CreateChurche = async (credentials: any) =>
  await HttpRequest("eglise/createeglise", "POST", credentials);
export const FindMembersByChurche = async (id_churche: number) =>
  await HttpRequest(`eglise/findMembreByEgliseId/${id_churche}`, "GET");
export const CreateMembres = async (credentials: any) =>
  await HttpRequest("auth/local/signup", "POST", credentials);
export const CreateAnnonce = async (credentials: any, id: number) => {
  return await HttpRequest(`annonce/${id}`, "POST", credentials);
};
export const FindAnnonce = async (id_churche: number) =>
  await HttpRequest(`annonce/findByIdEglisse/${id_churche}`, "GET");
export const FindAllAnnonce = async () =>
  await HttpRequest(`annonce/findAll`, "GET");
export const DeleteAnnonce = async (id_annonce: number) =>
  await HttpRequest(`annonce/${id_annonce}`, "DELETE");
export const FindProgramme = async () => await HttpRequest(`programme`, "GET");
export const CreateProgramme = async (programme: any) =>
  await HttpRequest(`programme`, "POST", programme);
export const CreateSousProgramme = async (
  programme: any,
  id_programme: number,
) => await HttpRequest(`programme/${id_programme}`, "POST", programme);
export const CreateDayForAppointment = async (
  dto: createDayForAppointmentDto,
) => await HttpRequest(`rendezvous/create/day`, "POST", dto);
export const findDayForAppointment = async () =>
  await HttpRequest(`rendezvous/day`, "GET");
export const createRendezvous = async (dto: any) =>
  await HttpRequest(`rendezvous/create`, "POST", dto);
export const DeleteSousProgramme = async (id: number) =>
  await HttpRequest(`programme/sousprogramme/${id}`, "DELETE");
export const DeleteProgramme = async (id: number) =>
  await HttpRequest(`programme/${id}`, "DELETE");
export const UpdateSousProgramme = async (data: any, id: number) =>
  await HttpRequest(`programme/update/sousprogramme/${id}`, "PATCH", data);
export const UpdateProgramme = async (data: any, id: number) =>
  await HttpRequest(`programme/update/${id}`, "PATCH", data);
export const DeleteAppointment = async (id: number, motif: string) =>
  await HttpRequest(`rendezvous/${id}`, "DELETE", { motif });
export const DeleteDayAppointment = async (id: number) =>
  await HttpRequest(`rendezvous/day/${id}`, "DELETE");
export const PostponeAppointment = async (
  id: number,
  data: postponeAppointmentDto,
) => await HttpRequest(`rendezvous/postpone/${id}`, "POST", data);
export const FindStatistique = async (id: number) =>
  await HttpRequest(`eglise/findStatistiqueByEglise/${id}`, "GET");
export const findCommuniqueApi = async (id_eglise: number) =>
  await HttpRequest(`communique/findByEgliseId/${id_eglise}`, "GET");
export const createCommuniqueApi = async (dto: { communique: string }) =>
  await HttpRequest(`communique/create/`, "POST", dto);
