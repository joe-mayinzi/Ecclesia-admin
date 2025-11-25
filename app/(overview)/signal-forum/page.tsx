import { getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import SignalementForumSsrTableUI from "@/ui/table/signal-forum/SignalementForumSsrTableUI";
import { redirect } from "next/navigation";

export default async function SignalementsForum() {
  const session = await auth();
  if (!session) {
    redirect("please-login");
  }

  // Récupération des signalements pour le type "forum"
  const res = await getSignalesApi("forum", 1, 1000);
  const signalements = Array.isArray(res) ? res : [];

  if (signalements.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return <SignalementForumSsrTableUI data={signalements} />;
}
