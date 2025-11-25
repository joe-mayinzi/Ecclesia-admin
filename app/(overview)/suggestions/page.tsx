import { getSuggestionsApi } from "@/app/lib/actions/suggestions/suggestions.req";
import { auth } from "@/auth";
import SuggestionsSsrTableUI from "@/ui/table/suggestions/suggestions.ssr.table";
import { redirect } from "next/navigation";
import SuggestionsHeader from "./header.client";

export default async function SuggestionsPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  try {
    const res = await getSuggestionsApi(1, 1000);
    
    // Gérer différents formats de réponse
    const data = Array.isArray(res) 
      ? res 
      : Array.isArray(res?.data) 
      ? res.data 
      : Array.isArray(res?.suggestions)
      ? res.suggestions
      : [];

    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <SuggestionsHeader />
        <SuggestionsSsrTableUI data={data} />
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions:", error);
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <SuggestionsHeader />
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
          <p className="text-danger-700">
            Erreur lors du chargement des suggestions. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }
}
