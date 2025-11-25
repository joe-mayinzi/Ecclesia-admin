// app/audios/page.tsx
import { getAudioStatsApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import AudioStatsTableUI from "@/ui/table/audio-stats/audios.ssr.table";
import { redirect } from "next/navigation";

export default async function AudiosPage() {

  const session = await auth();
    if (!session) {
      redirect("please-login");
    }

  const audioData = await getAudioStatsApi();

  if (!audioData.length) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Aucun audio trouvé</p>
      </div>
    );
  }

  return <AudioStatsTableUI data={audioData} />;
}
