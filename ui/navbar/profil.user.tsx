"use client";
import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Session } from "next-auth";

export default function ProfilUser({ session }: { session: Session | null }) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="danger"
          name={session?.user.nom + "" + session?.user.prenom}
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="account" className="h-14 gap-2" href="/account">
          <p className="font-semibold">Connecté en tant que</p>
          <p className="font-semibold">
            {session?.user.nom} {session?.user.prenom}
          </p>
        </DropdownItem>
        <DropdownItem key="settings" href="/account/settings">
          Paramètres
        </DropdownItem>
        {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
        {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
        {/* <DropdownItem key="system">System</DropdownItem> */}
        {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
        {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
        <DropdownItem key="logout" color="danger" href="/api/auth/signout">
          Se déconnecter
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
