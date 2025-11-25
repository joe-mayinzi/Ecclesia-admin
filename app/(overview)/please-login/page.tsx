// app/please-login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PleaseLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/api/auth/signin"); // redirection après message
    }, 2000); // 2 secondes pour que l'utilisateur voie le message

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-bold">Veuillez vous connecter pour accéder à cette page.</h2>
      <p className="mt-2 text-gray-500">Vous allez être redirigé vers la page de connexion...</p>
    </div>
  );
}
