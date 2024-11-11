"use client";

import React, { useState } from "react";
import { ManagementEvent } from "@/app/lib/config/interface";
import { Session } from "next-auth";
import { CardEventUI } from "@/ui/card/card.ui";
import { Button } from "@nextui-org/react";

export default function EventPageClient({ initData, session }: { initData: ManagementEvent[], session: Session | null }) {
  const [view, setView] = useState<boolean>(true)

  return <div>
    <p className="text-2xl">Événements</p>
    <div className="flex justify-center items-center gap-4">
      <Button onClick={() => { setView(true) }} size="sm" variant={view ? "solid" : "flat"} color={view ? "primary" : "default"}>
        Tout
      </Button>
      <Button onClick={() => { setView(false) }} size="sm" variant={!view ? "solid" : "flat"} color={!view ? "primary" : "default"}>
        Réserveration
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {initData.map((item) => {
        if (view) {
          return <CardEventUI key={item.id} event={item} />
        } else {
          if (item.isSubscribe) {
            return <CardEventUI key={item.id} event={item} />
          }
        }

      })}
    </div>
  </div>
}
