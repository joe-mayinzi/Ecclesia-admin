import { deleteAchiveById, updateAchiveById } from "@/app/lib/actions/management/archive/mange.archive.req";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";


export default function ArchiveOptionActionComponent({ id, type, name, handelFindArchiveByEgliseId }: { handelFindArchiveByEgliseId: () => Promise<void>, id: number, type: "Folder" | "Document", name: string }) {
  const [newNameFile, setNewNameFile] = useState<string>(name)
  const [extensionFile, setextensionFile] = useState<string>('ext')
  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");


  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const getNameFile = () => {
    const e = name.split('.').pop()
    setNewNameFile(name.split('.')[0]);
    if (e) {
      const i = e ? e : name;
      setextensionFile(i)
    }

  }

  const handlRenameArchive = async () => {
    setPending(true);
    const update = await updateAchiveById(type, id, { name: `${newNameFile}.${extensionFile}` });
    setPending(false);

    if (!update.hasOwnProperty("statusCode") && (!update.hasOwnProperty("error") || !update.hasOwnProperty("error"))) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof update.message === "object") {
        let message = '';
        update.message.map((item: string) => message += `${item} \n`);
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    }
  }

  const handlRemoveArchive = async () => {
    setPending(true);
    const remove = await deleteAchiveById(type, id);
    setPending(false);

    if (!remove.hasOwnProperty("statusCode") && (!remove.hasOwnProperty("error") || !remove.hasOwnProperty("error"))) {
      handelFindArchiveByEgliseId();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof remove.message === "object") {
        let message = '';
        remove.message.map((item: string) => message += `${item} \n`);
        setAlertMsg(message);
      } else {
        setAlertMsg(remove.message);
      }
    }
  }

  useEffect(() => {
    getNameFile();
  }, []);



  return <>
    <Dropdown className="bg-background border-1 border-default-200">
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <VerticalDotsIcon className="text-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {/* <DropdownItem>Ouvrir</DropdownItem> */}
        <DropdownItem onClick={onOpen}>Renomer</DropdownItem>
        <DropdownItem onClick={() => { setIsOpenDialog(true) }}>Supprimer</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Renommer
            </ModalHeader>
            <ModalBody>
              <Input
                size="lg"
                label="Nom"
                variant="bordered"
                value={newNameFile}
                onChange={(e) => { setNewNameFile(e.target.value) }}
                placeholder="Nom"
                labelPlacement="outside"
                isInvalid={newNameFile === ""}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">.{extensionFile}</span>
                  </div>
                }
                errorMessage="Vous devez obligatoirement compléter ce champ."
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button isDisabled={newNameFile === ""} className="text-white" color="primary" isLoading={pending} onPress={handlRenameArchive}>
                Créer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    <DialogAction
      isOpen={isOpenDialog}
      onOpen={() => { setIsOpenDialog(true) }}
      onClose={() => { setIsOpenDialog(false) }}
      dialogBody={<p className="text-2xl p-4 text-center">Êtes-vous sûr(e) de vouloir supprimer cet élément de vos archives ?</p>}
      dialogTitle={"Votre Attention SVP"}
      action={handlRemoveArchive} />
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
  </>
}