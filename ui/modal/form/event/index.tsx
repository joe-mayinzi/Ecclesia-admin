"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea, DatePicker, Link, Switch, DropdownItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import Alert from "../../alert";
import { createEventApi, updateEventById } from "@/app/lib/actions/management/event/event.req";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { ManagementEvent } from "@/app/lib/config/interface";
import moment from "moment";
import { capitalize } from "@/app/lib/config/func";

type CreateEventProps = {
  handleFindEvent: () => Promise<void>,
  event?: ManagementEvent
}

export default function CreateEventFormModal({ handleFindEvent }: CreateEventProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("Titre de l'événement");
  const [description, setDescription] = useState<string>("description");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [dateEvent, setDateEvent] = React.useState<DateValue>(parseDate(moment().format("YYYY-MM-DD")));
  const [adressMap, setAdressMap] = useState<string>("")
  const [isFree, setIsFree] = useState<boolean>(false);
  const [totalPerson, setTotalPerson] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  let formatter = useDateFormatter({ dateStyle: "full" });


  const handlAction = async () => {
    setPending(true);
    const dto = {
      name,
      description,
      isBlocked: !isBlocked,
      dateEvent: new Date(dateEvent.toString()),
      adressMap,
      isFree: !isFree,
      totalPerson,
      price,
    }
    console.log(dto);

    const create = await createEventApi(dto);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindEvent();
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


  return (
    <>
      <Button onClick={onOpen} size="sm" variant="flat">
        Créer un événement
      </Button>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer un événement
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Titre de l'événement"
                  variant="bordered"
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                  placeholder="Titre de l'événement"
                  isInvalid={name === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <Textarea
                  size="md"
                  label="Description de l'événement"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de l'événement"
                  isInvalid={description === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <div className="w-full flex flex-col gap-y-2">
                  <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={dateEvent}
                    onChange={setDateEvent}
                  />
                  <p className="text-default-500 text-sm">
                    {moment(dateEvent.toString()).format("dddd")} Le {moment(dateEvent.toString()).format("DD")}, {moment(dateEvent.toString()).format("MMMM")} {moment(dateEvent.toString()).format("YYYY")}
                  </p>
                </div>
                <Input
                  size="md"
                  type="url"
                  label="Lieux de l'événement"
                  variant="bordered"
                  value={adressMap}
                  onChange={(e) => { setAdressMap(e.target.value) }}
                  placeholder="Lieux de l'événement"
                />
                <Link target="_blank" href="https://maps.app.goo.gl/8UYznmNrpBo7ZHS16" className="text-default-500 text-sm">
                  ex:  https://maps.app.goo.gl/8UYznmNrpBo7ZHS16
                </Link>
                <Input
                  size="md"
                  label="Nombre maxmun de réservation"
                  variant="bordered"
                  type="number"
                  value={totalPerson.toString()}
                  onChange={(e) => { setTotalPerson(parseInt(e.target.value)) }}
                  placeholder="nombre maximum"
                />
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">Lance la reservation à la creation: </p>
                  <Switch isSelected={isBlocked} onValueChange={setIsBlocked} />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">L'evenement est-il Payant:</p>
                  <Switch isSelected={isFree} onValueChange={setIsFree} />
                </div>
                {isFree &&
                  <Input
                    size="md"
                    label="Montant de la réservation"
                    variant="bordered"
                    type="number"
                    value={price.toString()}
                    onChange={(e) => { setPrice(parseInt(e.target.value)) }}
                    placeholder="Montant"
                  />
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
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

export function UpdateEventFormModal({ handleFindEvent, event, isOpen, onClose }: any) {

  const [pending, setPending] = useState<boolean>(false);

  const dte = moment(event.dateEvent).format("YYYY-MM-DD").toString();
  const [name, setName] = useState<string>(event?.name || "");
  const [description, setDescription] = useState<string>(event?.description || "");
  const [isBlocked, setIsBlocked] = useState<boolean>(!event?.isBlocked || false);
  const [dateEvent, setDateEvent] = React.useState<DateValue>(parseDate(dte));
  const [adressMap, setAdressMap] = useState<string>(event?.adressMap || "")
  const [isFree, setIsFree] = useState<boolean>(!event?.isFree || false);
  const [totalPerson, setTotalPerson] = useState<number>(event?.totalPerson || 0);
  const [price, setPrice] = useState<number>(event?.price || 0);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");



  let formatter = useDateFormatter({ dateStyle: "full" });


  const handlAction = async () => {
    setPending(true);
    const dto = {
      name,
      description,
      isBlocked: !isBlocked,
      dateEvent: new Date(dateEvent.toString()),
      adressMap,
      isFree: !isFree,
      totalPerson,
      price,
    }
    console.log(dto);

    const create = await updateEventById(event.id, dto);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindEvent();
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


  return (
    <>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier un événement
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Titre de l'événement"
                  variant="bordered"
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                  placeholder="Titre de l'événement"
                  isInvalid={name === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <Textarea
                  size="md"
                  label="Description de l'événement"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de l'événement"
                  isInvalid={description === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <div className="w-full flex flex-col gap-y-2">
                  <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={dateEvent}
                    onChange={setDateEvent}
                  />
                  <p className="text-default-500 text-sm">
                    {capitalize(moment(dateEvent.toString()).format("dddd"))} Le {moment(dateEvent.toString()).format("DD")}, {moment(dateEvent.toString()).format("MMMM")} {moment(dateEvent.toString()).format("YYYY")}
                  </p>
                </div>
                <Input
                  size="md"
                  type="url"
                  label="Lieux de l'événement"
                  variant="bordered"
                  value={adressMap}
                  onChange={(e) => { setAdressMap(e.target.value) }}
                  placeholder="Lieux de l'événement"
                />
                <Link target="_blank" href="https://maps.app.goo.gl/8UYznmNrpBo7ZHS16" className="text-default-500 text-sm">
                  ex:  https://maps.app.goo.gl/8UYznmNrpBo7ZHS16
                </Link>
                <Input
                  size="md"
                  label="Nombre maxmun de réservation"
                  variant="bordered"
                  type="number"
                  value={totalPerson.toString()}
                  onChange={(e) => { setTotalPerson(parseInt(e.target.value)) }}
                  placeholder="nombre maximum"
                />
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">Lance la reservation à la creation: </p>
                  <Switch isSelected={isBlocked} onValueChange={setIsBlocked} />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-default-500 text-sm">L'evenement est-il Payant:</p>
                  <Switch isSelected={isFree} onValueChange={setIsFree} />
                </div>
                {isFree &&
                  <Input
                    size="md"
                    label="Montant de la réservation"
                    variant="bordered"
                    type="number"
                    value={price.toString()}
                    onChange={(e) => { setPrice(parseInt(e.target.value)) }}
                    placeholder="Montant"
                  />
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
                  Modifier
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


export function EventSubscribeFormModal({ event, isOpen, onClose }: { event: ManagementEvent, isOpen: boolean, onClose: () => void }) {

  const [pending, setPending] = useState<boolean>(false);
  const [subscribe, setSubscribe] = useState<any[]>(Array.isArray(event.subscribe) ? event.subscribe : [])

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  let formatter = useDateFormatter({ dateStyle: "full" });

  const handlAction = async () => {
    setPending(true);

    setPending(false);
  };

  return (
    <>
      <Modal backdrop={"opaque"} size="2xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Liste de réservation de l'événement
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Total de reservation</p>
                    <p>{event.totalSubscriptions} / {event.totalPerson}</p>
                  </div>
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Montant Total</p>
                    {event.isFree ?
                      <p>L'événement est gratuit</p>
                      :
                      <p>{event.totalSubscriptions * event.price} USD</p>
                    }
                  </div>
                </div>
                <div>
                  <Table fullWidth isStriped aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>#</TableColumn>
                      <TableColumn>Fidel</TableColumn>
                      <TableColumn>Date de la reservation</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {subscribe.map((item, i) => {
                        return <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.user.nom} {item.user.prenom}</TableCell>
                          <TableCell>Le {moment(item.createdAt).format("DD-MM-YYYY")}</TableCell>
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
    </>
  );
}
