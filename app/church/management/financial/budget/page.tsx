import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findEventByEgliseIdApi } from "@/app/lib/actions/management/event/event.req";
import ManangmentBubgetPageClient from "./page.client";
import { findManagementBudgetByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";

export default async function ManangmentBubgetPage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findManagementBudgetByEgliseIdApi(id_eglise);
  console.log(find);

  return (
    <ManangmentBubgetPageClient initData={find} session={session} />
  );
}
