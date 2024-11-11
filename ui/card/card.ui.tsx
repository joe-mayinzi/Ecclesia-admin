"use cliet";

import React from "react";
import { ManagementEvent } from "@/app/lib/config/interface";
import { CiLink } from "react-icons/ci";
import { Button, Image, Link } from "@nextui-org/react";
import { file_url } from "@/app/lib/request/request";
import { useRouter } from "next/navigation";
import moment from "moment";

export function CardEventUI({ event }: { event: any }) {
  const router = useRouter();

  return <div className="gap-4 border border-default p-4 rounded-lg" key={event.id}>
    <div className="flex h-full justify-between flex-col">
      <p className="text-ellipsis line-clamp-1">{event.name}</p>
      <>
        {event.adressMap ?
          <Link target="_blank" href={event.adressMap} title={event.adressMap}>
            Lien adresse Map  <CiLink size={30} className="text-default-500 text-ellipsis text-sm" />
          </Link>
          : <p className="text-default-500 text-ellipsis text-sm" style={{ fontSize: 11 }}>Veuillez consulter la description pour l'adresse détaillée.</p>}
      </>

      {event.description && <p className="text-default-500 text-ellipsis text-sm line-clamp-2" title={event.description} style={{ fontSize: 12 }}>{event.description}</p>}

      <div className="mt-2 flex items-center gap-2">
        <Image src={`${file_url}${event.eglise.photo_eglise}`} width={20} height={20} className="rounded-full" />
        <Link href={`@${event.eglise.username_eglise}`} className="text-sm text-default-500">{event.eglise.nom_eglise}</Link>
      </div>
      <div className="flex w-full justify-between items-center mt-2">
        <p className="text-default-500 text-sm">{event.totalPerson} prs</p>
        <p className="text-default-500 text-sm">{event.isFree && "Gratuit"}</p>
        {!event.isFree && <p className="text-default-500 text-sm">{event.price + "USD"}</p>}
        {!event.isFree &&
          !event.isSubscribe &&
          <Button
            className="border-small mr-0.5 font-medium shadow-small bg-foreground text-background"
            radius="full"
            size="sm"
            variant="bordered"
            onClick={() => { router.push(`/event/${event.id}`) }}
          >
            Réserver
          </Button>
        }

      </div>
      {event.isSubscribe && <p>réserver le {moment(`${event.subscribe.createdAt}`).calendar()} </p>}
    </div>
  </div>
}