"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import React from "react";
import { Input } from "@nextui-org/input";
import {
  MicrophoneIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";

import NavLinks from "../sidebar/nav-links";

import ProfilUser from "./profil.user";

import { MailIcon } from "@/ui/icons";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { SearchIcon } from "@/ui/icons";
import { ThemeSwitch } from "@/ui/theme-switch";

export const Navbar = ({ session }: { session: Session | null }) => {
  const searchParams = useSearchParams();
  const s_query = searchParams.get("s_query");

  // const { data: notifications } = useQuery("postsData", {
  //   queryFn: async () => await getUserNotifications(),
  // });

  const searchInput = (
    <form action={`/search`} className="col-span-8 rounded-md">
      <Input
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        defaultValue={`${s_query ? s_query : ""}`}
        endContent={<MicrophoneIcon style={{ width: 24, height: 24 }} />}
        labelPlacement="outside"
        name="s_query"
        placeholder="Recherche..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
    </form>
  );

  // function getNumberNotification(notifications: any[]): number {
  //   let nombre = 0;

  //   for (let index = 0; index < notifications.length; index++) {
  //     const element = notifications[index];

  //     if (!element.status) nombre++;
  //   }

  //   return nombre;
  // }

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href={"/"}
            >
              <Avatar
                className="rounded-md bg-transparent"
                size="md"
                src="/ecclessia.png"
              />
              <p className="font-bold text-inherit">EcclesiaBook</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="center"
        >
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

          <NavbarItem className="lg:flex">{searchInput}</NavbarItem>

          <NavbarItem className="lg:flex ">
            {session && session.user ? (
              <>
                <div className="flex justify-between items-center space-x-2 gap-4">
                  {session.user.privilege_user ===
                    PrivilegesEnum.ADMIN_EGLISE && (
                    <a href={"/church"}>
                      <PlusCircleIcon className="w-6 cursor-pointer text-foreground" />
                    </a>
                  )}

                  <ProfilUser session={session} />
                </div>
              </>
            ) : (
              <>
                <Button as={Link} href="/api/auth/signin" variant="bordered">
                  Se connecter
                </Button>
              </>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          className="flex sm:hidden md:hidden lg:hidden basis-1 pl-4"
          justify="end"
        >
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavbarMenuItem>
              <div className="flex justify-between w-full items-center space-x-2">
                <ThemeSwitch />
                <>
                  {session && session.user && (
                    <div className="flex justify-between space-x-2">
                      {session.user.privilege_user ===
                        PrivilegesEnum.ADMIN_EGLISE && (
                        <Link href={"/church"}>
                          <PlusCircleIcon className="w-6 cursor-pointer text-foreground" />
                        </Link>
                      )}
                    </div>
                  )}
                </>
                <NavbarItem className="lg:flex w-full">
                  {searchInput}
                </NavbarItem>
              </div>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <div className="flex justify-center w-full">
                {session && session.user ? (
                  <>
                    <div className="flex justify-between space-x-2">
                      <ProfilUser session={session} />
                    </div>
                  </>
                ) : (
                  <Button as={Link} href="/api/auth/signin" variant="bordered">
                    Se connecter
                  </Button>
                )}
              </div>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <div className="flex flex-col justify-center align-middle w-full px-4 py-2">
                {session && session.user && (
                  <>
                    <div className="flex flex-row space-x-2 my-1 align-middle">
                      <UserIcon style={{ width: 24, height: 24 }} />
                      <p>
                        {session.user.nom} {session.user.prenom}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-2 my-1 align-middle">
                      <MailIcon style={{ width: 24, height: 24 }} />
                      <p>{session.user.email}</p>
                    </div>
                  </>
                )}
              </div>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <NavLinks />
            </NavbarMenuItem>

          </div>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};
