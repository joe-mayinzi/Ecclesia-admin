"use server";

import { HttpRequest } from "../../../request/request";

export const createArchiveFolderApi = async (dto: { name: string, parentId?: number }) => await HttpRequest(`archivage/createFolder`, "POST",dto);
export const createArchiveDocumentApi = async (folderId: number, formData: any) => await HttpRequest(`archivage/createDocument/${folderId}`, "POST", formData);

export const findArchiveFolderByEgliseIdApi = async (eglsieId: number) => await HttpRequest(`archivage/findFolderByEgliseId/${eglsieId}`);
export const findArchiveByFolderIdApi = async (folderUUID: string) => await HttpRequest(`archivage/findFolderOne/${folderUUID}`);

export const updateAchiveById  =  async (type: "Folder" | "Document", id: number, dto: { name?: string, parentId?: number }) => await HttpRequest(`archivage/update${type}/${id}`, "PATCH", dto);

export const deleteAchiveById =  async (type: "Folder" | "Document", id: number) => await HttpRequest(`archivage/delete${type}/${id}`, "DELETE");

