"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  session: any | null;
};

export default function ProtectedPageWrapper({ session, children }: React.PropsWithChildren<Props>) {
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      const timer = setTimeout(() => {
        router.push("/api/auth/signin"); // redirection après message
      }, 2000); // 2 secondes pour que l'utilisateur voie le message
      return () => clearTimeout(timer);
    }
  }, [session, router]);

  if (!session) {
    // affiche le message avant redirection
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-bold">Veuillez vous connecter pour accéder à cette page.</h2>
        <p className="mt-2 text-gray-500">Vous allez être redirigé vers la page de connexion...</p>
      </div>
    );
  }

  // si connecté, affiche le contenu
  return <>{children}</>;
}
