"use server";

import React from "react";
import PopUpLogin from "@/ui/PopUpLogin/popUpLogin";
import VideoBackground from "@/ui/PopUpLogin/videoBackground";

export default async function SignIn() {
  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-3">
      {/* SECTION GAUCHE AVEC VIDEO */}
      <div className="hidden lg:block relative h-full w-full lg:col-span-2 overflow-hidden">
        <VideoBackground />
        {/* Overlay léger pour lisibilité sans cacher le texte */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/25" />
      </div>

      {/* SECTION DROITE AVEC FORMULAIRE */}
      <div className="h-full w-full flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="flex w-full items-center px-6 lg:px-12">
            <PopUpLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
