"use client"
import { ManagementEvent } from "@/app/lib/config/interface";
import EventSsrTableUI from "@/ui/table/event/event.ssr.table";
import { Session } from "next-auth";
import React from "react";

export default function EventPageClient({ initData, session }: { session: Session, initData: ManagementEvent[] }) {



  return (
    <div>
       <h1 className="text-2xl">Événement</h1>
       <EventSsrTableUI initData={initData} session={session} />
    </div>
  );
}
