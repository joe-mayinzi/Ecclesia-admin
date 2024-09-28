"use client"

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import ArchiveSsrTable from "@/ui/table/archive/archive.ssr.table";
import { createArchiveDocumentApi, findArchiveByFolderIdApi, findArchiveFolderByEgliseIdApi } from "@/app/lib/actions/management/archive/mange.archive.req";
import ArchiveCardComponent from "../component/archive.card";
import { CircularProgress, Divider, Link, ScrollShadow } from "@nextui-org/react";
import { m } from "framer-motion";
import { formatBytes } from "@/app/lib/config/func";
import { api_url } from "@/app/lib/request/request";

type DocumentToUpload = {
  step: "EN ATTENTE" | "EN TÉLÉCHARGEMENT" | "TÉLÉCHARGÉ" | "ÉCHOUÉ",
  uploaded: number
}


export default function ArchivePageByIdFolderClient({ session, initData }: { session: Session, initData: any }) {
  const { id_eglise } = session.user.eglise
  const [folder, setFolder] = useState(initData);
  const [state, setState] = useState<boolean>(true);

  const [onUploadDocument, setOnUploadDocument] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [documentsUrl, setDocumentsUrl] = useState<FileList | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState<DocumentToUpload[]>([]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handelFindArchiveByEgliseId = async () => {
    const findArchive = await findArchiveByFolderIdApi(folder.uuidName)
    if (!findArchive.hasOwnProperty("statusCode") && (!findArchive.hasOwnProperty("error") || !findArchive.hasOwnProperty("error"))) {
      setFolder(findArchive)
    }
  }

  const handelSetDocumentsUploaded = (FileList: FileList) => {
    if (FileList) {
      for (let i = 0; i < FileList.length; i++) {
        const element = FileList[i];
        setDocumentsUploaded((prev) => {
          return [...prev, { step: "EN ATTENTE", uploaded: 0 }]
        });
      }
      setDocumentsUrl(FileList)
    }
  }

  const handleSubmit = async () => {

    const formData = new FormData();
    if (documentsUrl) {

      for (let i = 0; i < documentsUrl.length; i++) {
        const documents = documentsUrl[i];
        formData.append("documents", documents);
        setDocumentsUploaded((prev) => {
          const newUpload = [...prev];
          const ToUpdate = { ...newUpload[i] };
          ToUpdate.step = "EN TÉLÉCHARGEMENT";
          newUpload[i] = ToUpdate;
          return newUpload;
        })
        const create = await createArchiveDocumentApi(folder.id, formData);
        formData.delete("documents")

        if (create.hasOwnProperty("statusCode") && create.hasOwnProperty("error")) {
          setOpenAlert(true);
          setAlertTitle("Erreur");
          if (typeof create.message === "object") {
            let message = '';
            create.message.map((item: string) => message += `${item} \n`);
            setAlertMsg(message);
          } else {
            setAlertMsg(create.message);
          }
          setDocumentsUploaded((prev) => {
            const newUpload = [...prev];
            const ToUpdate = { ...newUpload[i] };
            ToUpdate.step = "ÉCHOUÉ";
            newUpload[i] = ToUpdate;
            return newUpload;
          })
        } else {

          setDocumentsUploaded((prev) => {
            const newUpload = [...prev];
            const ToUpdate = { ...newUpload[i] };
            ToUpdate.step = "TÉLÉCHARGÉ";
            newUpload[i] = ToUpdate;
            return newUpload;
          })
          if (i + 1 === documentsUrl.length) {
            handelFindArchiveByEgliseId();
            setDocumentsUrl(null);
            setDocumentsUploaded([])
            setOnUploadDocument(false);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (onUploadDocument) {
      console.log("onUploadDocument", onUploadDocument);

      handleSubmit();
    }
  }, [onUploadDocument]);


  return <div>
    <div className="flex justify-between">
      <p className="text-4xl">Gestion d'archivage</p>
      <div className="flex items-center gap-2">
        <Link className="text-default-500" href={`/church/management/archive`}>/</Link>
        {folder.parent !== null &&
          <Link className="text-default-500" href={`/church/management/archive/${folder.parent.uuidName}`}>
            {folder.parent.name}
          </Link>}
        {folder.parent !== null && <p className="text-default-500">{">"}</p>}
        <Link className="text-default-500" href={`/church/management/archive/${folder.uuidName}`}>
          {folder.name}
        </Link>
      </div>
    </div>

    {state ?
      <ArchiveSsrTable documentsUrl={documentsUrl} setDocumentsUrl={handelSetDocumentsUploaded} created={created} setCreated={setCreated} onUploadDocument={onUploadDocument} setOnUploadDocument={setOnUploadDocument} id={folder.id} setState={setState} state={state} handelFindArchiveByEgliseId={handelFindArchiveByEgliseId} initData={[...folder.subFolder, ...folder.archiveDocuments]} />
      :
      <ArchiveCardComponent documentsUrl={documentsUrl} setDocumentsUrl={handelSetDocumentsUploaded} created={created} setCreated={setCreated} onUploadDocument={onUploadDocument} setOnUploadDocument={setOnUploadDocument} setState={setState} state={state} handelFindArchiveByEgliseId={handelFindArchiveByEgliseId} initData={folder} />
    }

    {onUploadDocument && (documentsUrl && documentsUrl.length > 0) &&
      <div className="absolute bottom-10 right-8 shadow-md shadow-primary bg-default rounded-md p-4 w-96">
        <p>Telechargement des fichiers</p>
        <Divider />
        <ScrollShadow hideScrollBar className="max-h-64">

          {Array.from({ length: documentsUrl.length }).map((_, index) => {
            return <div key={index} className="flex flex-col w-full mt-4">
              <p className="line-clamp-1">{documentsUrl[index].name}</p>

              <div className="flex justify-between items-center">
                <p>{formatBytes(documentsUrl[index].size)}</p>
                {documentsUploaded[index].step === "EN ATTENTE" ?
                  <p className="font-bold text-2xl text-center text-default">_</p>
                  :
                  <CircularProgress
                    aria-label="Loading..."
                    size="sm"
                    value={documentsUploaded[index].step === "TÉLÉCHARGÉ" ? 100 : undefined}
                    color={
                      documentsUploaded[index].step === "EN TÉLÉCHARGEMENT" ? "warning" :
                        documentsUploaded[index].step === "TÉLÉCHARGÉ" ?
                          "success" : "danger"
                    }
                    showValueLabel={documentsUploaded[index].step === "TÉLÉCHARGÉ" ? true : undefined}
                  />
                }
              </div>
            </div>
          })}
        </ScrollShadow>
      </div>
    }
  </div>
}