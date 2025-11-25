"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import { signOutAction } from "@/app/actions/signout";
import VideoBackground from "@/ui/PopUpLogin/videoBackground";

export default function SignOut() {
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
        <Card className="w-full max-w-md">
          <CardBody className="items-center gap-4">
            <Link href="/" className="block">
              <Image
                alt="ecclesia"
                height={78}
                src="/ecclessia.png"
                width={78}
              />
            </Link>

            <p className="text-center font-bold text-xl">
              Voulez-vous vraiment vous déconnecter ?
            </p>

            <form action={signOutAction}>
              <Button className="font-bold text-white" color="primary" type="submit">
                Oui, je veux me déconnecter !
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
