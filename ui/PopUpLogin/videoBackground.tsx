"use client";

import React from "react";
import { Image } from "@nextui-org/image";
import Link from "next/link";

export default function VideoBackground() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex justify-center items-center">
      {/* VIDEO non rognée */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted={muted}
        className="absolute top-0 left-0 w-full h-full object-contain object-center"
        src="/ECCLESIABOOK (Nouvelle version)_1 V1 2.mp4"
      >
        <track kind="captions" srcLang="fr" label="Français" />
      </video>

      {/* LOGO */}
      <div className="absolute top-1 left-0 right-4 z-10">
        <Link href="/">
          <Image alt="ecclesia" height={100} src="/ecclessia.png" width={100} />
        </Link>
      </div>

      {/* BOUTON SON - Positionné en bas à droite de la section vidéo */}
      <button
        className="absolute bottom-0 right-4 z-30 bg-black/60 text-white px-4 py-2 rounded-2xl shadow-lg hover:bg-black/80 transition-all duration-200 font-medium"
        onClick={toggleMute}
        type="button"
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? "🔇 Activer le son" : "🔊 Couper le son"}
      </button>
    </div>
  );
}

