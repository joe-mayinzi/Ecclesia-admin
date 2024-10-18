"use server";

import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ListeAnnonce from "./liste.annonce";
import { findAnnonceByEgliseIdPaginated } from "@/app/lib/actions/annonce/annonce.req";

export default async function Annonce() {

  const session = await auth();

  if (!session) {
    redirect("/")
  }
  const find = await findAnnonceByEgliseIdPaginated(session.user.eglise.id_eglise);
  return (
    <div>
      <ListeAnnonce session={session} initData={find} />
    </div>
  );
}