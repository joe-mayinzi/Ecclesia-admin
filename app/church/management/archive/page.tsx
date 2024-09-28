"use server"

import { createArchiveFolderApi, findArchiveByFolderIdApi, findArchiveFolderByEgliseIdApi } from "@/app/lib/actions/management/archive/mange.archive.req";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import ArchivePageByIdFolderClient from "./[id]/page.client";


export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/')
  }
  const { id_eglise, username_eglise } = session.user.eglise
  let archive
  const findArchive = await findArchiveFolderByEgliseIdApi(id_eglise);

  if (!findArchive.hasOwnProperty("statusCode") && (!findArchive.hasOwnProperty("error") || !findArchive.hasOwnProperty("error"))) {
    if (findArchive.length === 0) {
      const create = await createArchiveFolderApi({ name: username_eglise });
      if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
        const findFolder = await findArchiveByFolderIdApi(create.uuidName);
        archive = findFolder
      }
    } else {
      const find = await findArchiveByFolderIdApi(findArchive[0].uuidName)
      archive = find
    }
  } else {
    redirect("/church")
  }

  return <ArchivePageByIdFolderClient session={session} initData={archive} />

}