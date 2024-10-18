"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { StatusAcounteEnum } from "@/app/lib/config/enum";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { EventSubscribeFormModal, UpdateEventFormModal } from "@/ui/modal/form/event";
import { ManagementEvent } from "@/app/lib/config/interface";

export const ActionEvent = ({ event, handleFindEvent }: {
  event: ManagementEvent
  handleFindEvent: () => Promise<void>
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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
        <DropdownItem onClick={() => { setOpenModal(true) }}>Réservation</DropdownItem>
        <DropdownItem onClick={onOpen}>Modifier</DropdownItem>
        <DropdownItem onClick={() => { setOnBloqued(true) }}> {event.isBlocked ? "Lancer" : "Bloquer"}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    <DialogAction
      isOpen={onBloqued}
      onOpen={() => { setOnBloqued(true) }}
      onClose={() => { setOnBloqued(false) }}
      dialogBody={<p>Étes-vous sure de vouloir {event.isBlocked ? "lancer" : "bloquer"} cette événement?</p>}
      dialogTitle={`${event.isBlocked ? "Lancer" : "Bloquer"} l'événement`}
      action={handleBloqueMembres}
    />
    <UpdateEventFormModal handleFindEvent={handleFindEvent} onClose={onClose} isOpen={isOpen} event={event} />
    <EventSubscribeFormModal event={event} isOpen={openModal} onClose={() => { setOpenModal(false) }} />
  </div>
}