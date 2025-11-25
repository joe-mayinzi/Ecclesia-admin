"use client";

import { Button } from "@nextui-org/react";
import { FaExternalLinkAlt } from "react-icons/fa";

// URL du Google Sheet - À configurer selon votre fichier
const GOOGLE_SHEET_URL =
  process.env.NEXT_PUBLIC_SUGGESTIONS_SHEET_URL ||
  "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit";

export default function SuggestionsHeader() {
  const handleViewReport = () => {
    window.open(GOOGLE_SHEET_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-default-900 mb-2">
            Suggestions des utilisateurs
          </h1>
          <p className="text-sm sm:text-base text-default-500">
            Gérez et répondez aux suggestions soumises par les utilisateurs de la plateforme.
          </p>
        </div>
        <Button
          color="primary"
          variant="solid"
          onPress={handleViewReport}
          startContent={<FaExternalLinkAlt className="w-4 h-4" />}
          className="w-full sm:w-auto font-semibold shadow-sm hover:shadow-md transition-shadow"
        >
          Voir le rapport
        </Button>
      </div>
    </div>
  );
}

