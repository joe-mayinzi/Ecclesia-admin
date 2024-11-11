"use client";

import { findCheckedSubscribeUserEventApi, findCheckedSubscribeUserEventByuuIdApi, findEventByIdApi } from "@/app/lib/actions/management/event/event.req";
import { capitalize } from "@/app/lib/config/func";
import { ManagementEvent } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { auth } from "@/auth";
import { Card, CardBody, CircularProgress, Divider, Image } from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { BsEmojiNeutral } from "react-icons/bs";
export default function EventByIdPage({ params }: { params: { id: string } }) {
  const [pending, setPending] = useState<boolean>(true)
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [checkTicket, setCheckTikect] = useState<any>()

  const handle = async () => {
    setPending(true)
    const checkEvent = await findCheckedSubscribeUserEventByuuIdApi(params.id);
    console.log(checkEvent);
    setPending(false)
    if (checkEvent.hasOwnProperty("statusCode") && checkEvent.hasOwnProperty("message")) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof checkEvent.message === "object") {
        let message = '';
        checkEvent.message.map((item: string) => message += `${item} \n`)
        setAlertMsg(message);
      } else {
        setAlertMsg(checkEvent.message);
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("vérification réussi");
      setAlertMsg("La vérification du ticket se bien passée.");
      setCheckTikect(checkEvent)
    }

  }

  useEffect(() => {
    handle()
  }, []);



  return (
    <div className="flex justify-center items-center h-screen w-full">
      {pending ? <CircularProgress size="lg" color="default" aria-label="Loading..." /> : checkTicket ?
        <Card className="h-[500px] bg-success w-[548px] rounded-md">
          <CardBody className="flex flex-col items-center gap-4 justify-center">
            {checkTicket.event.annonces.length > 0 &&
              <Image
                src={`${file_url}${checkTicket.event.annonces[0].contente}`}
                width={300}
                height={300}
              />
            }
            <p>{checkTicket.event.name}</p>
            <p>Date de l'événemnt {capitalize(moment(checkTicket.event.dateEvent).format("dddd, DD MMMM YYYY"))}</p>
            <Divider />
            {checkTicket.user.profil &&
              <Image
                src={`${file_url}${checkTicket.user.profil}`}
                width={300}
                height={300}
                style={{ borderRadius: 25 }}
              />
            }
            <p className="uppercase">{checkTicket.user.prenom} {checkTicket.user.nom}</p>
            <p className="uppercase">{checkTicket.user.telephone}</p>
            <p>Date de la réservation {capitalize(moment(checkTicket.createdAt).format("dddd, DD MMMM YYYY"))}</p>
            <p className="text-2xl text-white">Le ticker est valide</p>
            <BsEmojiSmile size={100} className="mt-4" />
          </CardBody>
        </Card>
        :
        <Card className={`h-[500px] bg-${alertMsg === "warning" ? "warining" : "danger"} w-[548px] rounded-md`}>
          <CardBody className="flex flex-col items-center justify-center">
            <p className="text-2xl text-white uppercase text-center">{alertMsg === "warning" ? "Ce ticker a déjà été vérifier" : alertMsg}</p>
            {alertMsg === "warning" ?
              <BsEmojiNeutral size={100} className="mt-4" />
              :
              <BsEmojiFrown size={100} className="mt-4" />
            }
          </CardBody>
        </Card>
      }
    </div>
  );
}
