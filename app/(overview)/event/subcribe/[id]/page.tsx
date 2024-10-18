"use server";

import { findEventAllApi, findEventByIdApi } from "@/app/lib/actions/management/event/event.req";
import { auth } from "@/auth";
import React from "react";
import EventByIdPageClient from "./page.client";

export default async function EventByIdPage({params}: {params: {id: string}}) {

  const session = await auth()

  const find = await findEventByIdApi(params.id);
  
  return (
    <EventByIdPageClient initData={find} session={session} />
  );
}
