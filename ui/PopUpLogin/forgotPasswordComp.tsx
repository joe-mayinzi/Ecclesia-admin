"use client";

import React, { useCallback, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FaPhoneAlt } from "react-icons/fa";

import Alert from "../modal/alert";

import { AuthGetUserByTel } from "@/app/lib/services/api/checkNumber";
import { AuthsendSmsByTelApi } from "@/app/lib/actions/auth";

export default function ForgotPasswordCheckNumber({ onChangeStep }: any) {
  const [isOpenAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [telephone, setTelephone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const onOpenAlert = () => setOpenAlert(true);
  const onCloseAlert = () => setOpenAlert(false);

  const handleCheckNumberSubmit = async () => {
    if (!telephone) {
      setErrorMessage("Veuillez entrer votre numéro de téléphone");
      onOpenAlert();

      return;
    }

    if (telephone.startsWith("+")) {
      const newnum = "%2B" + telephone.substring(1);

      setLoading(true);
      const response = await AuthGetUserByTel(newnum);

      setLoading(false);
      if (
        !response.hasOwnProperty("statusCode") &&
        !response.hasOwnProperty("message")
      ) {
        await handleAuthsendSmsByTel(telephone, response.email);
        onChangeStep("foreignPasswordConfimCode", response);
      } else {
        onOpenAlert();
        if (typeof response.message === "object") {
          let message = "";

          response.message.map((item: string) => (message += `${item} \n`));
          setErrorMessage(message);
        } else {
          setErrorMessage(response.message);
        }
      }
    } else {
      onOpenAlert();
      setErrorMessage("Le numéro de téléphone doit commencer par '+'.");
    }
  };

  const handleAuthsendSmsByTel = useCallback(
    async (telephone: string, email: string) => {
      const newnum = telephone.substring(1);

      await AuthsendSmsByTelApi({ tel: newnum, email: email });
    },
    [],
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheckNumberSubmit();
        }}
      >
        <Input
          className="mt-4 mb-4"
          endContent={
            <FaPhoneAlt className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Numéro de téléphone"
          name="telephone"
          placeholder="Entrer votre numéro de téléphone"
          type="text"
          value={telephone}
          variant="bordered"
          onChange={(e) => setTelephone(e.target.value)}
        />
        <div className="flex gap-4">
          <Button variant="bordered" onClick={() => onChangeStep("login")}>
            Se connecter
          </Button>
          <Submit loading={loading} />
        </div>
      </form>

      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Verification numero !"}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
        onOpen={onOpenAlert}
      />
    </>
  );
}

function Submit({ loading }: { loading: boolean }) {
  return (
    <Button
      aria-disabled={loading}
      color="primary"
      isLoading={loading}
      type="submit"
    >
      <p>
        {" "}
        {loading
          ? "Virification En cours..."
          : "Vérifier le numéro de téléphone"}
      </p>
    </Button>
  );
}
