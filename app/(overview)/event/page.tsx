"use server";

import { findEventAllApi } from "@/app/lib/actions/management/event/event.req";
import { auth } from "@/auth";
import React from "react";
import EventPageClient from "./page.client";

export default async function EventPage() {

  const session = await auth()

  const find = await findEventAllApi(session ? true : false)
  console.log(find);
  
  return (
    <EventPageClient initData={find} session={session} />
  );
}
