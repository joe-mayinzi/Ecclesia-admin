"use client";

import { ManagementEvent } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { Button, Image, Link } from "@nextui-org/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function EventPageClient({ initData, session }: { initData: ManagementEvent[], session: Session | null }) {
  const router = useRouter()
  return <div>
    <p className="text-2xl">Événements</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {initData.map((item) => {
        return <div className="items-center gap-4 border border-default p-4 rounded-lg" key={item.id}>
          <div className="flex flex-col">
            <p className="text-ellipsis line-clamp-1">{item.name}</p>
            <Link target="_blank" href={item.adressMap} className="text-default-500 text-ellipsis text-sm">{item.adressMap}</Link>
            <div className="mt-2 flex items-center gap-2">
              <Image src={`${file_url}${item.eglise.photo_eglise}`} width={20} height={20} className="rounded-full" />
              <Link href={`@${item.eglise.username_eglise}`} className="text-sm text-default-500">{item.eglise.nom_eglise}</Link>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-default-500 text-sm">{item.totalPerson} prs</p>
              <p className="text-default-500 text-sm">{item.isFree && "Gratuit"}</p>
              <p className="text-default-500 text-sm">{!item.isFree && item.price + "USD"}</p>
              {!item.isFree &&
                <Button
                  className="border-small mr-0.5 font-medium shadow-small bg-foreground text-background"
                  radius="full"
                  size="sm"
                  variant="bordered"
                  onClick={() => { router.push(`/event/${item.id}`) }}
                >
                  Réserver
                </Button>
              }
            </div>
          </div>
        </div>
      })}
    </div>
  </div>
}
