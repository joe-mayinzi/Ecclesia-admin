import { headers } from "next/headers";
import { Metadata } from "next";

import { Navbar } from "@/ui/navbar/navbar";
import Sidebar from "@/ui/sidebar/sidebar";
import { auth } from "@/auth";
import { siteConfig } from "@/config/site";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const headersList = headers();
  const pathname = headersList.get("x-forwarded-path") || "";

  return (
    <div className="relative flex flex-col h-screen bg-transparent">
      <main className="container mx-auto py-2 flex-grow bg-transparent">
        <Navbar session={session} />
        <div className="flex mt-2.5 bg-red">
          <Sidebar pathname={pathname} />
          <div className="w-full ml-2.5 bg-transparent">{children}</div>
        </div>
      </main>
    </div>
  );
}
