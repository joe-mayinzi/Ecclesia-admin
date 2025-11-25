// app/(overview)/users/page.tsx
import React from "react";
import UsersSsrTableUI from "@/ui/table/user/user.ssr.table"; 
import { getAllUsersApi } from "@/app/lib/actions/admin/admin.req"; 
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await auth();

  if (!session) {
    console.log("Utilisateur non connecté, redirection vers signin");
    redirect("please-login");
  }


  try {
    
    const result = await getAllUsersApi(1, 100);
    
    
    const users = Array.isArray(result) ? result : result.data || [];

    console.log("Fetched users:", users);

    
    const formattedUsers = users
  .map((user: { id: any; nom: any; prenom: any; email: any; telephone: any; status: any; createdAt: string | number | Date; }) => ({
    id: user.id,
    name: `${user.nom} ${user.prenom}`,
    email: user.email,
    telephone: user.telephone,
    status: user.status,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    rawData: user, 
  })).sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));

    return <UsersSsrTableUI data={formattedUsers} />;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return <div>Impossible de charger les utilisateurs</div>;
  }
}
