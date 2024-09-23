"use client";

import React from "react";
import { Session } from "next-auth";

import GestionPersonnelSsrTableUI from "@/ui/table/personnel/personnel.ssr.table";

export default function GestionPersonnelClient({
  session,
  initData,
}: {
  session: Session;
  initData: any;
}) {
  return (
    <div>
      <h1 className="text-2xl">Gestion du personnel</h1>
      <GestionPersonnelSsrTableUI initData={initData} session={session} />
    </div>
  );
}
