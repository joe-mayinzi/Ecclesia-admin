import clsx from "clsx";
import { headers } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { checkedIsExpiredAbonnement } from "../lib/actions/abonnement/abonnement.req";

import { Navbar } from "@/ui/navbar/navbar";
import Sidebar from "@/ui/sidebar/admin/sidebar";
import { auth } from "@/auth";
import { siteConfig } from "@/config/site";
import { PayementAbonnement } from "@/ui/formMaxicash";

import "moment/locale/fr";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: "/ecclessia.png",
    shortcut: "/ecclessia.png",
    apple: "/ecclessia.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function LayoutBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-forwarded-path") || "";
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  const checked = await checkedIsExpiredAbonnement(
    session.user.eglise.id_eglise,
  );

  if (
    !checked.hasOwnProperty("StatusCode") &&
    !checked.hasOwnProperty("message")
  ) {
    if (!checked) {
      return (
        <div className="relative flex flex-col h-screen">
          <main className="container mx-auto py-2 flex-grow">
            <Navbar session={session} />
            <div className="flex mt-2.5">
              <div className="w-full ml-2.5">
                <div className="relative px-4 sm:px-6 lg:px-8">
                  <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                    <h1 className="text-3xl">Abonement!</h1>
                    <p>
                      Votre abonnement a expiré ! Renouvelez-le dès
                      aujourd&apos;hui pour profiter de nouveau de tous les
                      avantages.
                    </p>
                    <p className="text-2xl font-extrabold text-center">
                      Payement de votre abonnement annuelle
                    </p>
                    <p className="text-2xl text-center">
                      <span className="font-extrabold">44.99$</span>/an
                    </p>
                    <PayementAbonnement
                      email={session.user.email}
                      telephone={session.user.telephone}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }
  } else {
    return (
      <div className="relative flex flex-col h-screen">
        <main className="container mx-auto py-2 flex-grow">
          <Navbar session={session} />
          <div className="flex mt-2.5">
            <div className="w-full ml-2.5">
              <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                  <h1 className="text-3xl">Abonement!</h1>
                  <p className=" font-bold">
                    EcclesiaBook : Gérez votre église comme jamais auparavant !
                  </p>
                  <p className="text-2xl font-extrabold">
                    Payement de votre abonnement annuelle
                  </p>
                  <p className="text-2xl">
                    <span className="font-extrabold">44.99$</span>/an
                  </p>
                  <PayementAbonnement
                    email={session.user.email}
                    telephone={session.user.telephone}
                  />

                  <p className="mt-12">
                    Plus qu&apos;un simple outil, EcclesiaBook est votre
                    partenaire idéal pour une gestion efficace et dynamique de
                    votre église.
                  </p>
                  <br />
                  <p>
                    EcclesiaBook : Gérez votre église comme jamais auparavant !{" "}
                    <br />
                    Plus qu&apos;un simple outil, EcclesiaBook est votre
                    partenaire idéal pour une gestion efficace et dynamique de
                    votre église.
                  </p>
                  <br />
                  <p>Découvrez les fonctionnalités qui vous permettront de :</p>
                  <ul>
                    <li>
                      <b>Gérer votre communauté</b>: Suivez les membres,
                      communiquez facilement et renforcez les liens.
                    </li>
                    <li>
                      <b>Ajouter du contenu multimédia</b> : Photos, vidéos,
                      livres, images... Partagez et enrichissez votre
                      communication.
                    </li>
                    <li>
                      <b>Gérer des rendez-vous</b>: collectez des inscriptions
                      et centralisez les informations.
                    </li>
                    <li>
                      <b>Forum et témoignages</b>: Favorisez l&apos;échange et
                      le partage entre membres, créez un forum et publiez des
                      témoignages inspirants.
                    </li>
                    <li>
                      <b>Formations</b>: Explorez l&apos;option{" "}
                      <b>Etude biblique</b> et proposez des formations
                      enrichissantes à votre communauté.
                    </li>
                    <li>
                      <b>
                        Et bien plus encore : EcclesiaBook s&apos;adapte à vos
                        besoins et vous offre une multitude de fonctionnalités
                        pour simplifier votre quotidien et dynamiser votre
                        église.
                      </b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen">
      <main className="container mx-auto py-2 flex-grow">
        <Navbar session={session} />
        <div className="flex mt-2.5">
          <div
            className={clsx("hidden md:block w-full flex-none md:w-72", {
              "md:block": pathname === "/library/videos/66",
            })}
          >
            <Sidebar />
          </div>
          <div className="w-full ml-2.5">{children}</div>
        </div>
      </main>
    </div>
  );
}
