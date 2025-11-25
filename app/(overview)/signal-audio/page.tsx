import { getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import SignalementAudioSsrTableUI from "@/ui/table/signals-audio/signal.audio.ssr.table";
import { redirect } from "next/navigation";

export default async function SignalementsAudio() {
  const session = await auth();
  if (!session) {
    redirect("please-login");
  }

  // Récupération des signalements pour le type "audios"
  const res = await getSignalesApi("audios", 1, 1000);

  const signalements = Array.isArray(res) ? res : [];
  console.log("Signalements audio fetchés :", signalements);

  if (signalements.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return <SignalementAudioSsrTableUI data={signalements} />;
}
