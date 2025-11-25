"use client";

import { Button } from "@nextui-org/react";
import { AiOutlinePlus } from "react-icons/ai";

interface PanoramaHeaderProps {
  onOpenUpload: () => void;
}

export default function PanoramaHeader({ onOpenUpload }: PanoramaHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-default-900 mb-2">
            Panoramas Bibliques
          </h1>
          <p className="text-sm sm:text-base text-default-500">
            Gérez et téléchargez vos vidéos bibliques (Panoramas) sur la plateforme.
          </p>
        </div>
        <Button
          color="primary"
          variant="solid"
          onPress={onOpenUpload}
          startContent={<AiOutlinePlus className="w-4 h-4" />}
          className="w-full sm:w-auto font-semibold shadow-sm hover:shadow-md transition-shadow"
        >
          Uploader un Panorama
        </Button>
      </div>
    </div>
  );
}

