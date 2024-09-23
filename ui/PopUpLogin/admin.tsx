"use client";
/* eslint-disable react/no-unescaped-entities */
import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";

import { EyeSlashFilledIcon } from "../icons";
import Alert from "../modal/alert";
import { createAdmin } from "../../app/lib/services/api/AuthApi";
import { EyeFilledIcon } from "../icons";
import { MailIcon } from "../icons";

import { Terms } from "./TermsLink";

import { PrivilegesEnum } from "@/app/lib/config/enum";
import { authenticate } from "@/app/lib/actions/auth";

type StepType =
  | "login"
  | "typeAcount"
  | "fidele"
  | "egliseCreation"
  | "eglise"
  | "goToPayement";

interface AdminProps {
  onChangeStep: (newStep: StepType) => void;
  nameEglise: string;
  setNameEglise: (value: string) => void;
  lastNameEglise: string;
  setLastNameEglise: (value: string) => void;
  telephoneEglise: string;
  setTelephoneEglise: (value: string) => void;
  emailEglise: string;
  setEmailEglise: (value: string) => void;
  passwordInscriptionEglise: string;
  setPasswordInscriptionEglise: (value: string) => void;
  passwordConfirmInscriptionEglise: string;
  setPasswordConfirmInscriptionEglise: (value: string) => void;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export default function Admin(props: AdminProps) {
  const [isOpenAlertEglise, setIsOpenAlertEglise] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [termsAcceptedEglise, setTermsAcceptedEglise] = useState(false);
  const onOpenAlertEglise = () => setIsOpenAlertEglise(true);
  const onCloseAlertEglise = () => setIsOpenAlertEglise(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleTermsChangeEglise = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setTermsAcceptedEglise(e.target.checked);
  };

  const handleSubmitEglise = async () => {
    const {
      nameEglise,
      lastNameEglise,
      emailEglise,
      telephoneEglise,
      passwordInscriptionEglise,
      passwordConfirmInscriptionEglise,
      setToken,
    } = props;

    if (!termsAcceptedEglise) {
      setErrorMessage("Veuillers accepter les termes et conditions");
      onOpenAlertEglise();

      return;
    }

    if (
      nameEglise &&
      lastNameEglise &&
      emailEglise &&
      telephoneEglise &&
      passwordInscriptionEglise
    ) {
      if (passwordInscriptionEglise !== passwordConfirmInscriptionEglise) {
        setErrorMessage("Les mots de passe ne correspondent pas");
        onOpenAlertEglise();

        return;
      }

      setLoading(true);
      const response = await createAdmin({
        nom: nameEglise,
        prenom: lastNameEglise,
        email: emailEglise,
        telephone: telephoneEglise,
        password: passwordInscriptionEglise,
        privilege: PrivilegesEnum.ADMIN_EGLISE,
      });

      setLoading(false);

      if (response.hasOwnProperty("access_token")) {
        try {
          const formData = new FormData();

          formData.append("telephone", telephoneEglise);
          formData.append("password", passwordInscriptionEglise);
          setLoading(true);
          const loginResponse = await authenticate(undefined, formData);

          setLoading(false);
          if (
            loginResponse === "Invalid credentials." ||
            loginResponse === "Something went wrong."
          ) {
            // throw new Error(loginResponse);
            setErrorMessage(
              "Malheureusement, la création de votre église a échoué. Ne vous inquiétez pas, contactez simplement ecclesiabook@linked-solution.com et nous vous aiderons à la finaliser.",
            );
            onOpenAlertEglise();
          } else {
            setToken(response.access_token);
            props.onChangeStep("egliseCreation");
          }
        } catch (error) {
          setErrorMessage(
            "Malheureusement, la création de votre église a échoué. Ne vous inquiétez pas, contactez simplement ecclesiabook@linked-solution.com et nous vous aiderons à la finaliser.",
          );
          onOpenAlertEglise();
        }
      } else if (response.statusCode === 409) {
        setErrorMessage("Le numéro de téléphone existe déjà!");
        onOpenAlertEglise();
      } else {
        const errorMessage = response.message || "Enregistrement refusé";

        setErrorMessage(errorMessage);
        onOpenAlertEglise();
      }
      setLoading(false);
    } else {
      setErrorMessage("Assurez-vous de remplir tous les champs.");
      onOpenAlertEglise();
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitEglise();
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
          value={props.nameEglise}
          variant="bordered"
          onChange={(e) => props.setNameEglise(e.target.value)}
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
          value={props.lastNameEglise}
          variant="bordered"
          onChange={(e) => props.setLastNameEglise(e.target.value)}
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
          value={props.emailEglise}
          variant="bordered"
          onChange={(e) => props.setEmailEglise(e.target.value)}
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
          value={props.telephoneEglise}
          variant="bordered"
          onChange={(e) => props.setTelephoneEglise(e.target.value)}
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
          value={props.passwordInscriptionEglise}
          variant="bordered"
          onChange={(e) => props.setPasswordInscriptionEglise(e.target.value)}
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
          value={props.passwordConfirmInscriptionEglise}
          variant="bordered"
          onChange={(e) =>
            props.setPasswordConfirmInscriptionEglise(e.target.value)
          }
        />
        <div className="">
          <Checkbox
            checked={termsAcceptedEglise}
            className="mt-4 mb-4"
            classNames={{
              label: "text-small",
            }}
            onChange={handleTermsChangeEglise}
          />
          J'ai lue et j'accepte <Terms />
        </div>

        <Submit loading={loading} />
      </form>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Inscription administrateur eglise"}
        isOpen={isOpenAlertEglise}
        onClose={() => {
          onCloseAlertEglise();
        }}
        onOpen={() => {
          onOpenAlertEglise();
        }}
      />
    </>
  );
}

function Submit({ loading }: { loading: boolean }) {
  return (
    <Button
      aria-disabled={loading}
      className="mx-1 text-white"
      color="primary"
      isLoading={loading}
      type="submit"
    >
      {loading ? "En cours..." : "Créer l'administrateur de l'église"}
    </Button>
  );
}
