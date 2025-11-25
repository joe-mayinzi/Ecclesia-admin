"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardFooter, Button, Chip } from "@nextui-org/react";
import { VideoIcon } from "@/ui/icons";
import { file_url } from "@/app/lib/request/request";
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize2 } from "react-icons/fi";

interface PanoramaCardProps {
  panorama: {
    id: string | number;
    title?: string;
    description?: string;
    videoUrl?: string;
    lien?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
}

export default function PanoramaCard({ panorama }: PanoramaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Construire l'URL de la vidéo
  const getVideoUrl = () => {
    if (panorama.videoUrl) {
      // Si c'est une URL complète, l'utiliser directement
      if (panorama.videoUrl.startsWith("http://") || panorama.videoUrl.startsWith("https://")) {
        return panorama.videoUrl;
      }
      // Sinon, préfixer avec file_url
      return `${file_url}${panorama.videoUrl}`;
    }
    if (panorama.lien) {
      if (panorama.lien.startsWith("http://") || panorama.lien.startsWith("https://")) {
        return panorama.lien;
      }
      return `${file_url}${panorama.lien}`;
    }
    return null;
  };

  const videoUrl = getVideoUrl();

  // Gérer la lecture/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Gérer le son
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Gérer le plein écran
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        (videoRef.current as any).mozRequestFullScreen();
      }
    }
  };

  // Gérer les événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => setVideoLoaded(true);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!videoUrl) {
    return (
      <Card className="h-full">
        <CardBody className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <VideoIcon className="text-4xl text-default-300 mx-auto mb-2" />
            <p className="text-sm text-default-500">Vidéo non disponible</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-default-200 group"
      onMouseEnter={() => {
        setIsHovered(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowControls(false);
      }}
      isPressable
    >
      <CardBody className="p-0 relative overflow-hidden">
        {/* Conteneur vidéo */}
        <div className="relative w-full aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onMouseEnter={() => {
              if (isHovered) {
                setShowControls(true);
              }
            }}
          />

          {/* Overlay avec contrôles */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              showControls || isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Contrôles vidéo */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                isIconOnly
                variant="flat"
                className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 shadow-lg"
                size="lg"
                radius="full"
                onPress={togglePlay}
                aria-label={isPlaying ? "Pause" : "Lecture"}
              >
                {isPlaying ? (
                  <FiPause className="text-2xl" />
                ) : (
                  <FiPlay className="text-2xl ml-1" />
                )}
              </Button>

              <Button
                isIconOnly
                variant="flat"
                className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 shadow-lg"
                size="lg"
                radius="full"
                onPress={toggleMute}
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? (
                  <FiVolumeX className="text-xl" />
                ) : (
                  <FiVolume2 className="text-xl" />
                )}
              </Button>

              <Button
                isIconOnly
                variant="flat"
                className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 shadow-lg"
                size="lg"
                radius="full"
                onPress={handleFullscreen}
                aria-label="Plein écran"
              >
                <FiMaximize2 className="text-xl" />
              </Button>
            </div>

            {/* Badge de chargement */}
            {!videoLoaded && (
              <div className="absolute top-4 left-4">
                <Chip size="sm" variant="flat" className="bg-black/60 text-white">
                  Chargement...
                </Chip>
              </div>
            )}

            {/* Badge de lecture */}
            {isPlaying && videoLoaded && (
              <div className="absolute top-4 right-4">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-primary/80 text-white"
                >
                  En lecture
                </Chip>
              </div>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-default-900 line-clamp-2 min-h-[3.5rem]">
            {panorama.title || "Panorama sans titre"}
          </h3>
          {panorama.description && (
            <p className="text-sm text-default-600 line-clamp-2">
              {panorama.description}
            </p>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-4 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-default-500">
          <VideoIcon className="text-sm" />
          <span>{formatDate(panorama.createdAt as string)}</span>
        </div>
        <Button
          size="sm"
          variant="light"
          color="primary"
          as="a"
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir
        </Button>
      </CardFooter>
    </Card>
  );
}

