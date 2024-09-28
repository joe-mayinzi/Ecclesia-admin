"use client"

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Button, Card, CardBody, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link } from "@nextui-org/react";
import { ArrowRight, SearchIcon, VerticalDotsIcon } from "@/ui/icons";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaChevronRight } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import CreateFolderArchiveFormModal from "@/ui/modal/form/archive";
import BtnSwitchArchive from "@/ui/btn/switch.archive";
import ArchiveSsrTable from "@/ui/table/archive/archive.ssr.table";
import { findArchiveFolderByEgliseIdApi, createArchiveFolderApi } from "@/app/lib/actions/management/archive/mange.archive.req";
import { useRouter } from "next/navigation";
import { CiFolderOn } from "react-icons/ci";
import { getFileIcon } from "@/app/lib/config/func";
import { file_url } from "@/app/lib/request/request";
import ArchiveOptionActionComponent from "./archive.option.action";

export type ArchiveProps = {
  handelFindArchiveByEgliseId: () => Promise<void>,
  initData: any,
  state: boolean,
  setState: React.Dispatch<React.SetStateAction<boolean>>,
  setOnUploadDocument: React.Dispatch<React.SetStateAction<boolean>>,
  onUploadDocument: boolean,
  id?: number,
  created: boolean,
  setCreated: React.Dispatch<React.SetStateAction<boolean>>,
  documentsUrl: FileList | null,
  setDocumentsUrl: (FileList: FileList) => void,
}


export default function ArchiveCardComponent({ documentsUrl, setDocumentsUrl, created, setCreated, onUploadDocument, setOnUploadDocument, handelFindArchiveByEgliseId, initData, state, setState, id }: ArchiveProps) {
  const router = useRouter()


  return <div>
    <div className="flex items-center justify-between gap-3 items-end">
      <Input
        isClearable
        classNames={{
          base: "w-full sm:max-w-[44%]",
          inputWrapper: "border-1",
        }}
        placeholder="Recherche par nom..."
        size="sm"
        startContent={<SearchIcon className="text-default-300" />}
        // value={filterValue}
        variant="bordered"
      // onClear={() => setFilterValue("")}
      // onValueChange={onSearchChange}
      />
      <div className="flex items-center gap-3">
        <BtnSwitchArchive state={state} setState={setState} />
        <CreateFolderArchiveFormModal documentsUrl={documentsUrl} setDocumentsUrl={setDocumentsUrl} created={created} setCreated={setCreated} onUploadDocument={onUploadDocument} setOnUploadDocument={setOnUploadDocument} id={id} handelFindArchiveByEgliseId={handelFindArchiveByEgliseId} />
      </div>
    </div>


    <p className="text-default-500 mt-4">Dossiers</p>
    <div className="grid grid-cols-4 gap-4 mt-4">
      {initData.subFolder.map((item: any) => {
        return <Card key={item.uuidName} shadow="lg">
          <CardBody onDoubleClick={() => { router.push(`/church/management/archive/${item.uuidName}`) }}>
            <div className="grid grid-cols-5 items-center gap-4">
              {item.hasOwnProperty("typeMime") ? getFileIcon(item.name, 35) : <CiFolderOn size={35} />}
              <div className="col-span-4 flex  w-full items-center justify-between">
                <p className="line-clamp-1">{item.name}</p>
                <ArchiveOptionActionComponent id={item.id} type="Folder"  handelFindArchiveByEgliseId={handelFindArchiveByEgliseId}  name={item.name} />
              </div>
            </div>
          </CardBody>
        </Card>
      })}
    </div>

    <p className="text-default-500 mt-4">Fichiers</p>
    <div className="grid grid-cols-4 gap-4 mt-4">
      {initData.archiveDocuments.map((item: any) => {
        return <Card key={item.uuidName} shadow="lg">
          <CardBody onDoubleClick={() => { router.push(`${file_url}${item.path}`) }}>
            <div className="grid grid-cols-5 items-center gap-4">
              {item.hasOwnProperty("typeMime") ? getFileIcon(item.name, 35) : <CiFolderOn size={35} />}
              <div className="col-span-4 flex  w-full items-center justify-between">
                <p className="line-clamp-1">{item.name}</p>
               <ArchiveOptionActionComponent id={item.id} type="Document" handelFindArchiveByEgliseId={handelFindArchiveByEgliseId} name={item.name} />
              </div>
            </div>
          </CardBody>
        </Card>
      })}
    </div>

  </div>
}