"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn, DropdownSection, Input } from "@nextui-org/react";
import { VscNewFolder } from "react-icons/vsc";
import { FaFileArrowUp } from "react-icons/fa6";
import { AiOutlinePlus } from "react-icons/ai";
import { createArchiveDocumentApi, createArchiveFolderApi } from "@/app/lib/actions/management/archive/mange.archive.req";
import Alert from "../../alert";

type CreatArchiveProps = {
  documentsUrl: FileList | null,
  setDocumentsUrl: (FileList: FileList) => void,
  created: boolean,
  setCreated: React.Dispatch<React.SetStateAction<boolean>>,
  handelFindArchiveByEgliseId: () => Promise<void>,
  setOnUploadDocument: React.Dispatch<React.SetStateAction<boolean>>,
  onUploadDocument: boolean,
  id?: number
}


export default function CreateFolderArchiveFormModal({ documentsUrl, setDocumentsUrl, setOnUploadDocument, handelFindArchiveByEgliseId, id, created, setCreated }: CreatArchiveProps) {

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [folder, setFolder] = useState<string>("Dossier sans titre");

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");


  // const [croppedImageUrl, setCroppedImageUrl] = useState<FileList | null>(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);


  const handlAction = async () => {
    setPending(true);
    const create = await createArchiveFolderApi({ name: folder, parentId: id ? id : undefined });
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = '';
        create.message.map((item: string) => message += `${item} \n`);
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };

  const handleOnChange = async (event: React.ChangeEvent) => {
    const { files } = event.target as HTMLInputElement;
    console.log("files", files?.length);
    if (files && files.length !== 0) {
      if (files.length > 20) {
        setOpenAlert(true);
      } else {
        console.log(files);
        
        setDocumentsUrl(files);
        setOnUploadDocument(true)
      }
    }
  };

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
        closeOnSelect={false}
      >
        <DropdownTrigger>
          <Button
            variant="flat"
            fullWidth
            size="lg"
            className="text-2xl "
          >
            <AiOutlinePlus /> Nouveau
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
          <DropdownSection title="Actions">
            <DropdownItem
              key="new"
              shortcut="⌘N"
              description="Créer un nouveau dossier"
              startContent={<VscNewFolder className={iconClasses} />}
              onClick={onOpen}
            >
              Nouveau dossier
            </DropdownItem>

            <DropdownItem
              key="edit"
              shortcut="⌘⇧E"
              description="Importer un nouveau fichier"
              startContent={<FaFileArrowUp className={iconClasses} />}
            >
              <input
                id="upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleOnChange}
              />
              <label htmlFor="upload" className="cursor-pointer">
                Importer un fichier
              </label>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer un dossier
              </ModalHeader>
              <ModalBody>
                <Input
                  size="lg"
                  label="Nouveau dossier"
                  variant="bordered"
                  value={folder}
                  onChange={(e) => { setFolder(e.target.value) }}
                  placeholder="Nouveau dossier"
                  isInvalid={folder === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button isDisabled={folder === ""} className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
    </>
  );
}

