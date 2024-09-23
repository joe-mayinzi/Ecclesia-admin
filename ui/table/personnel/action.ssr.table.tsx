import { StatusAcounteEnum } from "@/app/lib/config/enum";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

export const ActionMembre = ({ membre, membres, setMembres, handleFindPersonneMemebres }: {
  membre: any
  setMembres: Dispatch<SetStateAction<any>>
  membres: any[],
  handleFindPersonneMemebres:  () => Promise<void>
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleBloqueMembres = async () => {
    // const update = await updateMembreApi({
    //   status: membre.status === StatusAcounteEnum.ACTIF ? StatusAcounteEnum.INACTIF : StatusAcounteEnum.ACTIF
    // }, membre.id);
    // if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("message")) {
    //   setOpenAlert(true);
    //   setAlertTitle("Erreur");
    //   if (typeof update.message === "object") {
    //     let message = '';
    //     update.message.map((item: string) => message += `${item} \n`)
    //     setAlertMsg(message);
    //   } else {
    //     setAlertMsg(update.message);
    //   }
    // } else {
    //   handleFindMemebres();
    //   setOpenModal(false);
    //   setOpenAlert(true);
    //   setAlertTitle("Modification réussi");
    //   setAlertMsg("La mofidication de compte du membre a réussi.");
    // }
  }

  return <div className="relative flex justify-end items-center gap-2">
    <Dropdown className="bg-background border-1 border-default-200">
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <VerticalDotsIcon className="text-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => { setOpenModal(true) }}>Modifier</DropdownItem>
        <DropdownItem onClick={() => { setOnBloqued(true) }}> {membre.status === StatusAcounteEnum.ACTIF ? "Bloquer" : "Débloquer"}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    <DialogAction
      isOpen={onBloqued}
      onOpen={() => { setOnBloqued(true) }}
      onClose={() => { setOnBloqued(false) }}
      dialogBody={<p>Étes-vous sure de vouloir {membre.status === StatusAcounteEnum.ACTIF ? "bloquer" : "débloquer"} ce membre?</p>}
      dialogTitle={"Bloquer le membres"}
      action={handleBloqueMembres}
    />
    {/* <UpdateMembreFormModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      membre={membre}
      handleFindMemebres={handleFindMemebres}
    /> */}
  </div>
}