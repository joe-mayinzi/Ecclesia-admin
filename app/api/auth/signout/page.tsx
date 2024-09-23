"use server";

import React from "react";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { Image } from "@nextui-org/image";
import { Card, CardBody } from "@nextui-org/card";

import { signOut as signOutApp } from "@/auth";

export default async function SignOut() {
  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-3">
      <div className="h-full w-full lg:col-span-2">
        <section
          className="flex items-end h-32 lg:col-span-5 lg:h-full xl:col-span-6"
          style={{
            background: `url(/logout2.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="hidden lg:flex lg:flex-col p-12">
            <Card>
              <CardBody>
                <a className="block" href="/">
                  <Image
                    alt="ecclesia"
                    height={78}
                    src="/ecclessia.png"
                    width={78}
                  />
                </a>

                <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                  Vous etes sûr de vouloir vous déconnectez ?
                </h2>

                <p className="mt-4 w-1/2 leading-relaxed">
                  Votre présence ici fait toute la différence, chaque moment
                  passé sur notre plateforme contribue à une expérience
                  enrichissante et pleine de découvertes. Avant de partir,
                  pensez à toutes les nouveautés que vous pourriez manquer. Nous
                  serions ravis de vous voir rester avec nous, pour explorer
                  encore plus de contenus passionnants !
                </p>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>

      <div className="h-full w-full">
        <div className="grid grid-cols-1">
          <div className="flex flex-col space-y-4 justify-center items-center h-screen">
            <Card>
              <CardBody className="items-center gap-4">
                <a className="block" href="/">
                  <Image
                    alt="ecclesia"
                    height={78}
                    src="/ecclessia.png"
                    width={78}
                  />
                </a>
                <p className="text-center font-bold text-xl">
                  Voulez-vous vraiment vous déconnecter ?
                </p>
                <form
                  action={async () => {
                    "use server";
                    await signOutApp({ redirect: true, redirectTo: "/" });
                    redirect("/");
                  }}
                >
                  <Button className="font-bold" type="submit">
                    Oui, je veux me déconnecter !
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
