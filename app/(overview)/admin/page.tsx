import { getAllAdminsApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import AdminSsrTableUI from "@/ui/table/admin/admin.ssr.table";
import { redirect } from "next/navigation";

export default async function Admins() {

  const session = await auth();
    if (!session) {
      redirect("please-login");
    }

  const res = await getAllAdminsApi(1, 10);

  const data = Array.isArray(res) ? res : []; // ← ici on prend res directement

  return <AdminSsrTableUI data={data} />;
}
