"use client";

import { CardSuggestionsUI } from "@/ui/card/card.ui";

type Suggestion = {
  id: number;
  suggestion: string;
  createdAt: string;
  updatedAt: string;
  userSuggestionId: number;
  userResponseId: number | null;
  responses: {
    message: string;
    createdAt: string;
    responder: {
      nom: string;
      prenom: string;
    };
  }[] | null; // null s’il n’y a pas encore de réponse

  userSuggestion: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    sexe: string;
    datenaissance: string;
    adresse: string;
    ville: string;
    pays: string;
    username: string;
    privilege: string;
    status: string;
    confirm: boolean;
    eglise: {
      id_eglise: number;
      nom_eglise: string;
      photo_eglise: string;
      couverture_eglise: string;
      sigle_eglise: string;
      username_eglise: string;
      adresse_eglise: string;
      ville_eglise: string;
      pays_eglise: string;
      status_eglise: string;
      payement_eglise: boolean;
    };
  };
  userResponse?: {
    nom: string;
    prenom: string;
  } | null;
};




type Props = {
  suggestions: Suggestion[];
};

export default function ClientPageSuggestions({ suggestions }: Props) {
  console.log(suggestions);
  
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 sticky top-0 bg-white z-10 pb-4">
        <h1 className="text-3xl font-bold">Suggestions des utilisateurs</h1>
        <p className="text-gray-500 mt-1">
          Cette section rassemble les suggestions soumises par les utilisateurs.
          Elles nous permettent d’identifier les besoins, corriger les éventuels points faibles et faire évoluer l’application en continu.
        </p>
      </div>

      <div className="space-y-4">
      {suggestions
        .filter(s => s.suggestion?.trim() !== "" && s.userSuggestion !== null)
        .map((suggestion) => (
          <CardSuggestionsUI
            key={suggestion.id}
            id={suggestion.id}
            userSuggestionId={suggestion.userSuggestion?.id} // 👈 à ajouter
            user={`${suggestion.userSuggestion?.nom} ${suggestion.userSuggestion?.prenom}`}
            content={suggestion.suggestion}
            date={suggestion.createdAt}
            status="non lu"
            responses={suggestion.responses}
          />
  ))}
</div>

    </div>
  );
}

