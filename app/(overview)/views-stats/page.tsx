// app/videos/page.tsx
import { getVideoStatsApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import VideoStatsTableUI from "@/ui/table/videos-stats/videos.ssr.table"; 
import { redirect } from "next/navigation";

export default async function VideosPage() {
  const session = await auth();
  
    if (!session) {
      console.log("Utilisateur non connecté, redirection vers signin");
      redirect("please-login");
    }


  const videoData = await getVideoStatsApi();

  if (!videoData.length) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Aucune vidéo trouvée</p>
      </div>
    );
  }

  return <VideoStatsTableUI data={videoData} />;
}
