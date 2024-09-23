import { redirect } from "next/navigation";
import React from "react";

import GestionPersonnelClient from "./page.client";

import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findManagementPersonnelApi } from "@/app/lib/actions/management/personnel/mange.person.req";

export default async function GestionAdministrative() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findManagementPersonnelApi(id_eglise);

  return (
    <div>
      <GestionPersonnelClient initData={find} session={session} />
    </div>
  );
}
