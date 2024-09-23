import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { NavFooterLinks } from "../nav-links";

import NavLinks from "./nav-links";

export default function Sidebar() {
  return (
    <ScrollShadow
      hideScrollBar
      className="sticky top-0 bottom-0 pb-36 h-screen"
    >
      <div className="pb-8 border-r-ui">
        <div className="flex flex-col gap-2 bg-background shadow-md rounded-md px-2 py-2">
          <NavLinks />
        </div>
        <div className="text-justify bg-background shadow-md  rounded-md mt-2.5 px-2 py-2">
          <NavFooterLinks />
        </div>
      </div>
    </ScrollShadow>
  );
}
