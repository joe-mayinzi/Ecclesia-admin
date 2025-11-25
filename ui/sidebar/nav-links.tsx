"use client";

import React from "react";
import {
  HomeIcon,
  PlayIcon,
  MusicalNoteIcon,
  PhotoIcon,
  PencilSquareIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  AcademicCapIcon,
  BookOpenIcon,
  Bars4Icon,
  MapIcon,
  QuestionMarkCircleIcon,
  ChartBarSquareIcon,
  RectangleGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import Link from "next/link";
import { VscLibrary } from "react-icons/vsc";
import { FaChurch, FaRegImage } from "react-icons/fa";
import { PiVideoLight } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import { CiWarning } from "react-icons/ci";



import { title } from "../primitives";

import { PrivilegesEnum } from "@/app/lib/config/enum";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { FiMessageSquare, FiUsers } from "react-icons/fi";

import { MdForum, MdOutlineAudiotrack, MdOutlineOndemandVideo, MdOutlinePanoramaHorizontalSelect } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { AiTwotoneAudio } from "react-icons/ai";
import { BsCameraReels } from "react-icons/bs";



const links = [
  { name: "Dashboard", href: "/", icon: HomeIcon, menu: false },
  {
    id: "admin",
    name: "Administration",
    icon: () => <GrUserAdmin size={24} />,
    menu: true,
    option: [
      {
        name: "Liste des admins",
        href: "/admin",
        icon: GrUserAdmin,
        menu: false,
      },
      {
        name: "Ajouter un admin",
        href: "/admin/create",
        icon: IoMdAdd,
        menu: false,
      },
    ],
  },
  {
    name: "Utilisateurs",
    href: "/users",
    icon: () => <FiUsers size={24} />,
  },
  {
    name: "Suggestions",
    href: "/suggestions",
    icon: () => <FiMessageSquare size={24} />,
  },
  {
    name: "Gestion des vues",
    href: "/views-stats",
    icon: () => <FaEye size={24} />,
  },
  {
    name: "Gestion des streams",
    href: "streams-stats",
    icon: () => <MdOutlineAudiotrack  size={24} />,
  },
  // {
  //   name: "Signalements",
  //   href: "/signales",
  //   icon: () => <CiWarning  size={24} />,
  // },
   {
    id: "signal",
    name: "Signalements",
    icon: () => <CiWarning  size={24} />,
    menu: true,
    option: [
      {
        name: "Video",
        href: "/signal-video",
        icon: ()=> <MdOutlineOndemandVideo size={24} />,
        menu: false,
      },
      {
        name: "Audio",
        href: "/signal-audio",
        icon: ()=> <AiTwotoneAudio size={24} />,
        menu: false,
      },
      {
        name: "Image",
        href: "/signal-image",
        icon: ()=> <FaRegImage size={24} />,
        menu: false,
      },
      {
        name: "Témoignage",
        href: "/signal-testimonials",
        icon: ()=> <BsCameraReels size={24} />,
        menu: false,
      },
      {
        name: "Forum",
        href: "/signal-forum",
        icon: ()=> <MdForum size={24} />,
        menu: false,
      },
    ],
  },
  { name: "Panoramas", href: "/panorama", icon: MdOutlinePanoramaHorizontalSelect, menu: false },
];

const option = [
  // { name: 'Annonces', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/annonce', icon: MegaphoneIcon },
  // { name: 'Communiqués', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/communique', icon: NewspaperIcon },
  // { name: 'Programmes', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/programme', icon: Squares2X2Icon },
  // { name: 'Rendez-vous ', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/appointment', icon: CalendarIcon },
  // { name: 'Abonnements', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/subscriptions', icon: WalletIcon },
  // { name: 'Offrande & don', privilege: PrivilegesEnum.FIDELE , href: '/offering-donation', icon: BanknotesIcon },
  // { name: 'Membres', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/workspace/membres', icon: UserGroupIcon },
  {
    name: "Notification",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/notification",
    icon: BellIcon,
  },
];

const footer = [
  {
    name: "Mentions légales, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=mentions_legale",
    icon: HomeIcon,
  },
  {
    name: "Politique de rembousement, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Politique de confidentialité, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Termes et Conditions d'utilisation,",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=terms_of_use",
    icon: HomeIcon,
  },
  {
    name: " Droits d’auteur,",
    privilege: PrivilegesEnum.FIDELE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Avis et Suggestions",
    privilege: PrivilegesEnum.FIDELE,
    href: "/suggestion",
    icon: HomeIcon,
  },
  // { name: 'Témoignages', privilege: PrivilegesEnum.FIDELE , href: '/testimonials', icon: LuClapperboard },
  // { name: 'Nous contacter', privilege: PrivilegesEnum.FIDELE , href: '/legacy', icon: HomeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link: any, i) => {
        const LinkIcon = link.icon;

        if (link.menu) {
          return (
            <div key={i}>
              <Accordion className="rounded-md" variant="light">
                <AccordionItem
                  aria-label={link.name}
                  startContent={<LinkIcon className="w-6" />}
                  title={<p className="text-sm">{link.name}</p>}
                >
                  <div style={{ paddingLeft: 20 }}>
                    {link.option?.map((item: any, e: number) => (
                      <Link
                        key={`${link.name}-${e}-${item.name}`}
                        className={clsx(
                          `flex h-48 grow gap-2 rounded-md p-3 mt-3 text-sm font-medium hover:bg-default-100`,
                          {
                            "bg-primary text-white": pathname === item.href,
                          }
                        )}
                        href={item.href}
                      >
                        <item.icon className="w-4" />
                        <p>{item.name}</p>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          );
        } else {
          return (
            <Link
              key={`${link.name}-${i}`}
              className={clsx(
                "flex grow gap-2 rounded-md p-3 mt-3 text-sm font-medium text-neutral-50 hover:bg-default-100 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-primary text-white": pathname === link.href,
                }
              )}
              href={link.href}
            >
              <LinkIcon className="w-6" />
              <p>{link.name}</p>
            </Link>
          );
        }
      })}
    </>
  );
}

export function NavAvartLinks() {
  const pathname = usePathname();
  const favoris: any[] = [];
  // const [favoris, setFavoris] = useState<any>();

  // const handleFindFavoris = useCallback(async () => {
  // const find = await findFavorisByUserApi();

  // if (!find.hasOwnProperty("statusCode")) {
  //   const eglise = find.filter((item: any) => item.eglise !== null);

  //   setFavoris(eglise.eglise);
  // }
  // }, [favoris]);

  // useEffect(() => {
  //   handleFindFavoris();
  // }, [handleFindFavoris]);

  return (
    <>
      <p className="font-medium">Église favoris</p>
      {favoris.length > 0 ? (
        favoris.map((link: any, i: number) => {
          return (
            <Link
              key={`${link.nom_eglise + i}`}
              className={clsx(
                "flex-grow h-36 gap-2 p-1 font-medium text-neutral-50 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-primary": pathname === `/@${link.username_eglise}`,
                }
              )}
              href={`/@${link.username_eglise}`}
            >
              <Avatar className="rounded h-8 w-8" src={link.icon} />
              <p className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {link.nom_eglise}
              </p>
            </Link>
          );
        })
      ) : (
        <p className="text-gray-400">
          Vous n&apos;avez aucune église en favoris
        </p>
      )}
    </>
  );
}

export function NavOptionLinks() {
  const pathname = usePathname();

  return (
    <>
      {option.map((link) => {
        const LinkIcon = link.icon;

        return (
          <a
            key={link.name}
            className={clsx(
              "flex h-48 grow gap-2 rounded-md p-3 mt-3 text-sm font-medium text-neutral-50 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-primary": pathname === link.href,
              }
            )}
            href={link.href}
          >
            <LinkIcon className="w-6" />
            <p className={title()}>{link.name}</p>
          </a>
        );
      })}
    </>
  );
}

export function NavFooterLinks() {
  const pathname = usePathname();

  return (
    <>
      {footer.map((link) => {
        return (
          <Link
            key={link.name}
            className={clsx(
              "text-justify text-sm font-medium text-neutral-50 hover:bg-sky-100 md:flex-none md:justify-start",
              {
                "bg-primary": pathname === link.href,
              }
            )}
            href={link.href}
          >
            {link.name}
          </Link>
        );
      })}
      <p>
        © 2025 Ecclesiabook <br /> Tous droits réservés
      </p>
    </>
  );
}
