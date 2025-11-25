"use client";
import React from "react";
import CreateAdminForm from "@/ui/formCreateUser";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function CreateUser() {

  return <CreateAdminForm />;
}
