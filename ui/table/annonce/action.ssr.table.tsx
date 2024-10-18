"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { deleteAnnonceApi, createLinkEventAndAnnonceApi } from "@/app/lib/actions/annonce/annonce.req";
import { ItemAnnonces, ManagementEvent } from "@/app/lib/config/interface";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, DatePicker, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea } from "@nextui-org/react";
import { capitalize } from "@/app/lib/config/func";
import moment from "moment";
import { Session } from "next-auth";
import { findEventByEgliseIdApi } from "@/app/lib/actions/management/event/event.req";

export const ActionAnnonce = ({
  annonce,
  handleFindAnnonces,
  session
}: {
  annonce: ItemAnnonces;
  handleFindAnnonces: () => void;
  session: Session
}) => {
  const [events, setEvents] = useState<ManagementEvent[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindEvent = async () => {
    if (session) {
      const find = await findEventByEgliseIdApi(session.user.eglise.id_eglise);
      if (find) {
        setEvents(find);
      }
    }
  }

  const handleDeleteAnnonces = async () => {
    const update = await deleteAnnonceApi(annonce.id);
    if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("message")) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof update.message === "object") {
        let message = "";
        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    } else {
      handleFindAnnonces();
      setOpenAlert(true);
      setAlertTitle("Réussi");
      setAlertMsg("La suppresion de l'annonce a réussi.");
    }
  }

  const handelLinkEventAndAnnonce = async (eventId: number) => {
    setPending(true);
    const createLink = await createLinkEventAndAnnonceApi(eventId, annonce.id);
    setPending(false);
    console.log(createLink);
    
    if (createLink.hasOwnProperty("statusCode") && createLink.hasOwnProperty("message")) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof createLink.message === "object") {
        let message = "";
        createLink.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(createLink.message);
      }
    } else {
      handleFindAnnonces();
      setOpenAlert(true);
      setAlertTitle("Réussi");
      setAlertMsg("L'association de l'annonce a réussi.");
    }
  }

  useEffect(() => {
    handleFindEvent()
  }, [])
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <VerticalDotsIcon className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={() => { setOpenModal(true) }}
          >
            Associée à un événement.
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setOnBloqued(true);
            }}
          >
            Supprimer
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={openModal} onClose={() => { setOpenModal(false) }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Associer un événement
              </ModalHeader>
              <ModalBody>
                {events.map((item) => {
                  return <div className="items-center gap-4 border border-default p-4 rounded-lg" key={item.id}>
                    <div className="flex flex-col">
                      <p className="text-ellipsis line-clamp-1">{item.name}</p>
                      <p className="text-default-500 text-ellipsis text-sm">{item.adressMap}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-default-500 text-sm">{item.totalPerson} prs</p>
                        <p className="text-default-500 text-sm">{item.isFree && "Gratuit"}</p>
                        <p className="text-default-500 text-sm">{!item.isFree && item.price + "USD"}</p>

                        <Button
                          className="border-small mr-0.5 font-medium shadow-small bg-foreground text-background"
                          radius="full"
                          size="sm"
                          variant="bordered"
                          isLoading={pending}
                          isDisabled={pending}
                          onClick={() => { handelLinkEventAndAnnonce(item.id); }}
                        >
                          Assoicier
                        </Button>
                      </div>
                    </div>
                  </div>
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Alert
        isOpen={openAlert}
        onOpen={() => {
          setOpenAlert(true);
        }}
        onClose={() => {
          setOpenAlert(false);
        }}
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
      />
      <DialogAction
        isOpen={onBloqued}
        onOpen={() => {
          setOnBloqued(true);
        }}
        onClose={() => {
          setOnBloqued(false);
        }}
        dialogBody={<p>Étes-vous sure de vouloir supprimer cette annonce?</p>}
        dialogTitle={"Suppression de l'annonces"}
        action={handleDeleteAnnonces}
      />

    </div>
  );
};