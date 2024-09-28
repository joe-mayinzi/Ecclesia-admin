"use server"

import { createArchiveFolderApi, findArchiveByFolderIdApi, findArchiveFolderByEgliseIdApi } from "@/app/lib/actions/management/archive/mange.archive.req";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import ArchivePageByIdFolderClient from "./page.client";


export default async function PageByIdFolder({params}: {params: {id: string}}) {
  const session = await auth();

  if (!session) {
    redirect('/')
  }
  const findArchive = await findArchiveByFolderIdApi(params.id)
  
  return <ArchivePageByIdFolderClient session={session} initData={findArchive} />
}