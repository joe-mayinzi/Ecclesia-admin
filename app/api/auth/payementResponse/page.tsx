"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { Abonnement_access } from "@/app/lib/actions/auth";
import { front_url } from "@/app/lib/request/request";

const Loading = () => <div> loading in dev mode</div>;

export default function AuthPayementView() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reference = searchParams.get("reference");
  const Method = searchParams.get("Method");

  const handleAbonnement = async () => {
    if (Method !== null && reference !== null && status === "success") {
      const abonnement = await Abonnement_access({
        montant_abonnement: "00.00",
        method_abonnement: "FREE",
        reference_abonnement: reference,
      });

      if (abonnement.hasOwnProperty("statusCode") === 401) {
        document.location = front_url;
      } else {
        document.location = front_url + "church";
      }
    } else {
      document.location = front_url;
    }
  };

  handleAbonnement();

  return (
    <div className="flex flex-col align-middle px-4 py-2 justify-center items-center h-full w-full">
      <div>{Loading()}</div>
    </div>
  );
}
