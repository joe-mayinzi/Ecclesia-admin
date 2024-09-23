"use client";
import React from "react";

import { PayementAbonnement } from "../formMaxicash";

interface GoToPayementProps {
  telephoneEglise: string;
  emailEglise: string;
}

export default function GoToPayement({
  telephoneEglise,
  emailEglise,
}: GoToPayementProps) {
  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl font-extrabold">
            Payement de votre abonnement annuelle
          </p>
          <p className="text-2xl">
            <span className="font-extrabold line-through">$0</span>/an
          </p>
        </div>
        <PayementAbonnement email={emailEglise} telephone={telephoneEglise} />
      </div>
    </>
  );
}
