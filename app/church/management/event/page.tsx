import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findEventByEgliseIdApi } from "@/app/lib/actions/management/event/event.req";
import EventPageClient from "./page.client";

export default async function EventPage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findEventByEgliseIdApi(id_eglise);
  console.log(find);

  return (
    <EventPageClient initData={find} session={session} />
  );
}
