"use server";

import { HttpRequest } from "../../../request/request";

export interface CreateManagementEventDto {
  name: string
  description: string
  isBlocked: boolean
  dateEvent: Date
  adressMap: string
  isFree: boolean
  totalPerson: number
  price: number
}

export interface CreateSubscribeInEventDto {
  paymentMothod: string
  paymentReference: string
}

export const createEventApi = async (dto: CreateManagementEventDto) => await HttpRequest(`management-event`, "POST", dto);
export const createSubscribeInEventApi = async (dto: CreateSubscribeInEventDto, id: number) => await HttpRequest(`management-event/subscribeInEvent/${id}`, "POST", dto);

export const findEventAllApi = async () => await HttpRequest(`management-event`);

export const findEventByEgliseIdApi = async (eglsieId: number) => await HttpRequest(`management-event/findEventByEgliseId/${eglsieId}`);
export const findEventByIdApi = async (eventId: string) => await HttpRequest(`management-event/findOne/${eventId}`);

export const updateEventById = async (id: number, dto: Partial<CreateManagementEventDto>) => await HttpRequest(`management-event/update/${id}`, "PATCH", dto);

export const deleteAchiveById = async (type: "Folder" | "Document", id: number) => await HttpRequest(`management-event/delete${type}/${id}`, "DELETE");

