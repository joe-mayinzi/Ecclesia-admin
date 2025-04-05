//"use server";

import React from "react";
import "moment/locale/fr";
import AdminSsrTableUI from "@/ui/table/admin/admin.ssr.table";

export default async function Admin() {
  return <AdminSsrTableUI />;
}
