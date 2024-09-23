"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import Alert from "../modal/alert";
import { EyeSlashFilledIcon } from "../icons";
import { EyeFilledIcon } from "../icons";

import { AuthUpdatePassword } from "@/app/lib/services/api/checkNumber";

export default function GetNewPassword({ onChangeStep, user }: any) {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onOpenAlert = () => setIsOpenAlert(true);
  const onCloseAlert = () => {
    setIsOpenAlert(false);
    if (isSuccessAlertShown) {
      onChangeStep("login");
    }
  };
  const [password, setpassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isVisible, setIsVisible] = useState(false);
  const [isSuccessAlertShown, setIsSuccessAlertShown] = useState(false);

  const handleChangePasswordSubmit = async () => {
    if (!password || !passwordConfirm) {
      setErrorMessage("Les champs sont obligatoires.");
      onOpenAlert();

      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage("Les deux mots de passe doivent être identiques.");
      onOpenAlert();

      return;
    }

    setLoading(true);
    try {
      const response = await AuthUpdatePassword({ password }, user.id);

      if (response?.access_token) {
        setErrorMessage("Le mot de passe a été changé avec succès.");
        setIsSuccessAlertShown(true);
        onOpenAlert();
      } else {
        setErrorMessage("Erreur lors de la modification du mot de passe.");
        onOpenAlert();
      }
    } catch (error) {
      setErrorMessage(
        "Une erreur est survenue lors de la communication avec le serveur.",
      );
      onOpenAlert();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpenAlert && isSuccessAlertShown) {
      onChangeStep("login");
    }
  }, [isOpenAlert, isSuccessAlertShown, onChangeStep]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleChangePasswordSubmit();
        }}
      >
        <Input
          className="mt-4 mb-4"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          name="password"
          placeholder="Entrer votre mot de passe"
          type={isVisible ? "text" : "password"}
          value={password}
          variant="bordered"
          onChange={(e) => setpassword(e.target.value)}
        />

        <Input
          className="mt-4 mb-4"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          name="confirm_password"
          placeholder="Confirmer votre mot de passe"
          type={isVisible ? "text" : "password"}
          value={passwordConfirm}
          variant="bordered"
          onChange={(e) => setpasswordConfirm(e.target.value)}
        />

        <Submit loading={loading} />
      </form>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle="Nouveau mot de passe"
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
      className="mt-4"
      color="primary"
      isLoading={loading}
      type="submit"
    >
      {loading ? "En cours..." : "Changer mon mot de passe"}
    </Button>
  );
}
