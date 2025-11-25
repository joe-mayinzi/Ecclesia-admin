import { getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import SignalementSsrTableUI from "@/ui/table/signals/signal.ssr.table";
import { redirect } from "next/navigation";

export default async function Signalements() {

  const session = await auth();
  if (!session) {
    redirect("please-login");
  }


  const res = await getSignalesApi("videos", 1, 1000);

  const signalements = Array.isArray(res) ? res : [];
  console.log("Signalements fetchés :", signalements);
  

  if (signalements.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg ">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return <SignalementSsrTableUI data={signalements} />;
}
