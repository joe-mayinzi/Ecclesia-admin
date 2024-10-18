"use client";
import React from "react";
import AnnoncesSsrTableUI from "@/ui/table/annonce/annonce.ssr.table";
import { Session } from "next-auth";
import { AnnoncePaginated } from "@/app/lib/config/interface";

export default function ListeAnnonce({ session, initData }: { session: Session, initData: AnnoncePaginated }) {
  return (
    <div>
      <h1 className="text-3xl">Annonces</h1>
      <AnnoncesSsrTableUI session={session} initData={initData} />
    </div>
  );
}
