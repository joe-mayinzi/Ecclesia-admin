"use client";

import {
  HomeIcon,
  PlayIcon,
  MusicalNoteIcon,
  PhotoIcon,
  BookOpenIcon,
  MegaphoneIcon,
  NewspaperIcon,
  Squares2X2Icon,
  CalendarIcon,
  PencilSquareIcon,
  WalletIcon,
  UserGroupIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  ChartBarSquareIcon,
  FilmIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Link } from "@nextui-org/link";

import { title } from "../../primitives";

import { PrivilegesEnum } from "@/app/lib/config/enum";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { VscLibrary } from "react-icons/vsc";
import { PiVideoLight } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GiGlobe } from "react-icons/gi";
import { MdOutlineEventNote } from "react-icons/md";
const links = [
  // { name: "Eglise", href: "/church", icon: HomeIcon },
  {
    name: "Comment utiliser",
    href: "/first-step",
    icon: () => <PiVideoLight size={24} />,
  },
  {
    id: "biblio",
    name: "Bibliothèque",
    icon: () => <VscLibrary size={24} />,
    menu: true,
    option: [
      { name: "Vidéos", href: "/church/videos", icon: PlayIcon },
      { name: "Audios", href: "/church/audios", icon: MusicalNoteIcon },
      { name: "Images", href: "/church/pictures", icon: PhotoIcon },
      { name: "Livres", href: "/church/book", icon: BookOpenIcon },
    ]
  },
  {
    id: "culture",
    name: "Culture",
    icon: () => <GiGlobe size={24} />,
    menu: true,
    option: [
      { name: "Etude biblique", privilege: PrivilegesEnum.FIDELE, href: "/church/bible-study", icon: BookOpenIcon },
      { name: "Plan de lecture", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/plan-lecture", icon: MapIcon },
      { name: "Quiz biblique", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/bible-quiz", icon: QuestionMarkCircleIcon, menu: false, },
      { name: "Sondage & Question", privilege: PrivilegesEnum.FIDELE, href: "/church/sondage", icon: ChartBarSquareIcon },
      { name: "Forum", privilege: PrivilegesEnum.FIDELE, href: "/church/forum", icon: PencilSquareIcon },
      { name: "Témoignages", privilege: PrivilegesEnum.FIDELE, href: "/church/testimonials", icon: FilmIcon },
    ]
  },



  // {
  //   name: 'Offrande & don',
  //   privilege: PrivilegesEnum.FIDELE,
  //   href: '/church/offering-donation',
  //   icon: BanknotesIcon
  // },
  {
    id: "administrative",
    name: "Administration",
    icon: () => <MdOutlineAdminPanelSettings size={24} />,
    menu: true,
    option: [
      { name: "Annonces", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/annonce", icon: MegaphoneIcon },
      { name: "Événement", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/management/event", icon: CalendarDaysIcon, },
      { name: "Communiqués", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/communique", icon: NewspaperIcon, },
      { name: "Programmes", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/programme", icon: Squares2X2Icon },
      { name: "Rendez-vous", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/appointment", icon: CalendarIcon },
      { name: "Membres", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/membres", icon: UserGroupIcon },
      { name: "Personnel", privilege: PrivilegesEnum.FIDELE, href: "/church/management/personnel", icon: UserGroupIcon },
      { name: "Archivage", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/management/archive", icon: ArchiveBoxIcon },
    ]
  },

  {
    id: "financial",
    name: "Finance",
    icon: () => <GiTakeMyMoney size={24} />,
    menu: true,
    option: [
      { name: "Budget", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/management/financial/budget", icon: UserGroupIcon },
      { name: "Recette", privilege: PrivilegesEnum.FIDELE, href: "/church/management/financial/income", icon: UserGroupIcon },
      { name: "Depense", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/management/financial/expense", icon: ArchiveBoxIcon },
      { name: "Abonnements", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/church/subscriptions", icon: WalletIcon, },
    ]
  },

  // { name: 'Notification', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/church/notification', icon: BellIcon },
];


export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, i) => {
        const LinkIcon : any = link.icon;

        if (link.menu) {
          return (
            <div key={i}>
              <Accordion className="rounded-md" variant="light">
                <AccordionItem aria-label={link.name} startContent={<LinkIcon className="w-6" />} title={<p className="text-sm">{link.name}</p>}>
                  <div style={{ paddingLeft: 20 }}>
                    {link.option?.map((item: any, e: number) => (
                      <Link
                        key={`${link.name}-${e}-${item.name}`}
                        className={clsx(`flex h-48 grow gap-2 rounded-md p-3 mt-3 text-sm font-medium hover:bg-default-100`,
                          {
                            "bg-primary text-white": pathname === item.href,
                          },
                        )}
                        href={item.href}
                      >
                        <item.icon className="w-4 text-foreground" />
                        <p className="text- text-foreground">{item.name}</p>
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
                },
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
