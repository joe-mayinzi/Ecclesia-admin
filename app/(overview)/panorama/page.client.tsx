"use client";

import React, { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { toast } from "react-toastify";
import UploadPanoramaModal from "@/ui/modal/form/panorama";
import PanoramaHeader from "./header.client";
import { getAllPanoramasApi } from "@/app/lib/actions/panorama/panorama.req";
import {
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { VideoIcon } from "@/ui/icons";
import PanoramaCard from "@/ui/card/panorama-card";

interface Panorama {
  id: string | number;
  title?: string;
  description?: string;
  videoUrl?: string;
  lien?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface PanoramaPageClientProps {
  initialData: Panorama[];
}

export default function PanoramaPageClient({
  initialData,
}: PanoramaPageClientProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [panoramas, setPanoramas] = useState<Panorama[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSuccess = async () => {
    // Rafraîchir la liste des panoramas
    setIsLoading(true);
    try {
      // Récupérer les panoramas avec les paramètres par défaut
      // Vous pouvez passer un type spécifique si nécessaire (ex: "New-testament")
      const data = await getAllPanoramasApi(undefined, 1, 50);
      setPanoramas(data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
      toast.error("Erreur lors du rafraîchissement de la liste");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <PanoramaHeader onOpenUpload={onOpen} />
      
      <UploadPanoramaModal
        isOpen={isOpen}
        onClose={onClose}
        onUploadSuccess={handleUploadSuccess}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : panoramas.length === 0 ? (
        <Card>
          <CardBody className="py-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <VideoIcon className="text-6xl text-default-300" />
              <div>
                <h3 className="text-lg font-semibold text-default-700 mb-2">
                  Aucun panorama pour le moment
                </h3>
                <p className="text-sm text-default-500 mb-4">
                  Commencez par uploader votre premier panorama biblique.
                </p>
                <button
                  onClick={onOpen}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Uploader un panorama
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {panoramas.map((panorama) => (
            <PanoramaCard key={panorama.id} panorama={panorama} />
          ))}
        </div>
      )}
    </div>
  );
}

