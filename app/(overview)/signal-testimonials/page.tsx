import { getSignalesApi } from "@/app/lib/actions/admin/admin.req";
import { auth } from "@/auth";
import SignalementTestimonialSsrTableUI from "@/ui/table/signal-testimonials/SignalementTestimonialSsrTableUI";
import { redirect } from "next/navigation";

export default async function SignalementsTestimonials() {
  const session = await auth();
  if (!session) {
    redirect("please-login");
  }

  // Récupération des signalements pour le type "testimonials"
  const res = await getSignalesApi("testimonials", 1, 1000);

  const signalements = Array.isArray(res) ? res : [];
  console.log("Signalements testimonials fetchés :", signalements);

  if (signalements.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return <SignalementTestimonialSsrTableUI data={signalements} />;
}
