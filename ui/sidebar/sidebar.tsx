"use client";

import React from "react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import NavLinks, { NavAvartLinks, NavFooterLinks } from "./nav-links";

export default function Sidebar({ pathname }: { pathname: string }) {
  const pathnameHook = usePathname();
  const [isBiblePage, setIsBiblePage] = useState(false);

  useEffect(() => {
    setIsBiblePage(pathnameHook === "/bible");
  }, [pathnameHook]);

  return (
    <div
      className={clsx("hidden md:block w-full flex-none md:w-72", {
        "md:block": pathname === "/library/videos/66",
      })}
      // style={isBiblePage ? { display: "none" } : {}}
    >
      <ScrollShadow
        hideScrollBar
        className="sticky top-0 bottom-0 pb-36 h-screen"
      >
        <div className="pb-8 border-r-ui">
          <div className="flex flex-col gap-2 bg-background shadow-md rounded-md px-2 py-2">
            <NavLinks />
          </div>
          <div className="flex flex-col gap-2 bg-background shadow-md rounded-md mt-2.5 px-2 py-2">
            <NavAvartLinks />
          </div>
          <div className="text-justify bg-background shadow-md  rounded-md mt-2.5 px-2 py-2">
            <NavFooterLinks />
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}
