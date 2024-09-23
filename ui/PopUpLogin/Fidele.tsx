"use client";
/* eslint-disable react/no-unescaped-entities */
import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";

import { MailIcon } from "../icons";
import { EyeSlashFilledIcon } from "../icons";
import Alert from "../modal/alert";
import { createAdmin } from "../../app/lib/services/api/AuthApi";
import { EyeFilledIcon } from "../icons";

import { Terms } from "./TermsLink";

import { authenticate } from "@/app/lib/actions/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";

export default function Fidele() {
  const [isOpenAlertFidele, setIsOpenAlertFidele] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [nameFidele, setNameFidele] = useState("");
  const [lastNameFidele, setLastNameFidele] = useState("");
  const [emailFidele, setEmailFidele] = useState("");
  const [telephoneFidele, setTelephoneFidele] = useState("");
  const [passwordInscriptionFidele, setPasswordInscriptionFidele] =
    useState("");
  const [
    passwordConfirmInscriptionFidele,
    setPasswordConfirmInscriptionFidele,
  ] = useState("");
  const [termsAcceptedFidele, setTermsAcceptedFidele] = useState(false);

  const handleTermsChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setTermsAcceptedFidele(e.target.checked);
  };

  const onOpenAlertFidele = () => setIsOpenAlertFidele(true);
  const onCloseAlertFidele = () => setIsOpenAlertFidele(false);

  const [errorMessage, setErrorMessage] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmitFidele = async () => {
    setLoading(true);
    if (!termsAcceptedFidele) {
      setErrorMessage("Veuillers accepter les termes et conditions");
      onOpenAlertFidele();

      return;
    }

    if (
      nameFidele &&
      lastNameFidele &&
      emailFidele &&
      telephoneFidele &&
      passwordInscriptionFidele
    ) {
      if (passwordInscriptionFidele !== passwordConfirmInscriptionFidele) {
        setErrorMessage("Les mots de passe ne correspondent pas");
        onOpenAlertFidele();

        return;
      }

      setLoading(true);
      const response = await createAdmin({
        nom: nameFidele,
        prenom: lastNameFidele,
        email: emailFidele,
        telephone: telephoneFidele,
        password: passwordInscriptionFidele,
        privilege: PrivilegesEnum.FIDELE,
      });

      setLoading(false);
      if (response.hasOwnProperty("access_token")) {
        try {
          const formData = new FormData();

          formData.append("telephone", telephoneFidele);
          formData.append("password", passwordInscriptionFidele);

          const loginResponse = await authenticate(undefined, formData);

          if (
            loginResponse === "Invalid credentials." ||
            loginResponse === "Something went wrong."
          ) {
            throw new Error(loginResponse);
          } else {
            document.location = "/";
          }
        } catch (error) {
          setErrorMessage("Identifiant incorrect");
          onOpenAlertFidele();
        }
      } else if (response.statusCode === 409) {
        setErrorMessage("Le numéro de téléphone existe déjà!");
        onOpenAlertFidele();
      } else {
        const errorMessage = response.message || "Enregistrement refusé";

        setErrorMessage(errorMessage);
        onOpenAlertFidele();
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
      onOpenAlertFidele();
    }

    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitFidele();
        }}
      >
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Nom"
          name="nom"
          placeholder="Entrer votre nom"
          type="text"
          value={nameFidele}
          variant="bordered"
          onChange={(e) => setNameFidele(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Prenom"
          name="prenom"
          placeholder="Entrer votre prenom"
          type="text"
          value={lastNameFidele}
          variant="bordered"
          onChange={(e) => setLastNameFidele(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="email"
          name="email"
          placeholder="Entrer votre email"
          type="text"
          value={emailFidele}
          variant="bordered"
          onChange={(e) => setEmailFidele(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="telephone"
          name="telephone"
          placeholder="Entrer votre telephone"
          type="text"
          value={telephoneFidele}
          variant="bordered"
          onChange={(e) => setTelephoneFidele(e.target.value)}
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
          label="Mot de passe"
          name="password"
          placeholder="Entrer votre mot de passe"
          type={isVisible ? "text" : "password"}
          value={passwordInscriptionFidele}
          variant="bordered"
          onChange={(e) => setPasswordInscriptionFidele(e.target.value)}
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
          label="Confirmation mot de passe"
          name="confirm_password"
          placeholder="Confirmer votre mot de passe"
          type={isVisible ? "text" : "password"}
          value={passwordConfirmInscriptionFidele}
          variant="bordered"
          onChange={(e) => setPasswordConfirmInscriptionFidele(e.target.value)}
        />
        <div className="">
          <Checkbox
            checked={termsAcceptedFidele}
            className="mt-4 mb-4"
            classNames={{
              label: "text-small",
            }}
            onChange={handleTermsChange}
          />
          J'ai lue et j'accepte <Terms />
        </div>

        <Submit loading={loading} />
      </form>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Inscription fidele"}
        isOpen={isOpenAlertFidele}
        onClose={() => {
          onCloseAlertFidele();
        }}
        onOpen={() => {
          onOpenAlertFidele();
        }}
      />
    </>
  );
}

function Submit({ loading }: { loading: boolean }) {
  return (
    <Button
      aria-disabled={loading}
      className="mx-1"
      color="primary"
      isLoading={loading}
      type="submit"
    >
      {loading ? "En cours..." : "Cree un compte"}
    </Button>
  );
}
