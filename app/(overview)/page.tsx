"use server";
import { auth } from "@/auth";

import React from "react";
import "moment/locale/fr";

export default async function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <p className="text-3xl">Dev Home page</p>
    </div>
  );
}
