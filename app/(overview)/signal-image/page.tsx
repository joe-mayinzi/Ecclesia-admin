import { getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import SignalementImageSsrTableUI from "@/ui/table/signal-image/signal.image.ssr.table";
import { redirect } from "next/navigation";

export default async function SignalementsImage() {
  const session = await auth();
  if (!session) {
    redirect("please-login");
  }

  // 🔥 On récupère les signalements pour le type "images"
  const res = await getSignalesApi("images", 1, 1000);

  const signalements = Array.isArray(res) ? res : [];
  console.log("Signalements images fetchés :", signalements);

  if (signalements.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return <SignalementImageSsrTableUI data={signalements} />;
}
