import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import {findManagementIncomeByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";
import ManangmentIncomePageClient from "./page.client";

export default async function ManangmentIncomePage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findManagementIncomeByEgliseIdApi(id_eglise);
  console.log(find);

  return (
    <ManangmentIncomePageClient initData={find} session={session} />
  );
}
