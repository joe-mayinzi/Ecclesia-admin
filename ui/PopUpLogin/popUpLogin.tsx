"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { FaChurch } from "react-icons/fa";
import { RiLoginBoxLine } from "react-icons/ri";
import { FiUserPlus } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import { Image } from "@nextui-org/image";
import { useRouter, useSearchParams } from "next/navigation";

import Alert from "../modal/alert";
import { EyeSlashFilledIcon } from "../icons";
import { EyeFilledIcon } from "../icons";

import Fidele from "./Fidele";
import Admin from "./admin";
import EgliseComponent from "./egliseComponent";
import GoToPayement from "./gotopayement";
import GetNewPassword from "./getNewPassword";
import ForgotPasswordCheckNumber from "./forgotPasswordComp";
import ForgotPasswordConfirmCode from "./forgotPasswordConfirmCode";

import { authenticate } from "@/app/lib/actions/auth";

type StepType =
  | "login"
  | "typeAcount"
  | "fidele"
  | "egliseCreation"
  | "eglise"
  | "goToPayement"
  | "foreignPasswordStepOne"
  | "foreignPasswordConfimCode"
  | "foreignPasswordStepTwo";

export default function PopUpLogin() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const [step, setStep] = useState<StepType>("login");

  const [isVisible, setIsVisible] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenAlertTerms, setIsOpenAlertTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Connexion
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");

  // Admin eglise
  const [nameEglise, setNameEglise] = useState("");
  const [lastNameEglise, setLastNameEglise] = useState("");
  const [telephoneEglise, setTelephoneEglise] = useState("");
  const [emailEglise, setEmailEglise] = useState("");
  const [passwordInscriptionEglise, setPasswordInscriptionEglise] =
    useState("");
  const [
    passwordConfirmInscriptionEglise,
    setPasswordConfirmInscriptionEglise,
  ] = useState("");

  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState("");

  const onOpenAlert = () => setIsOpenAlert(true);
  const onCloseAlert = () => setIsOpenAlert(false);

  const onOpenAlertTerms = () => setIsOpenAlertTerms(true);
  const onCloseAlertTerms = () => setIsOpenAlertTerms(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChangeStep = (newStep: StepType, user = null) => {
    setStep(newStep);
    if (user) {
      setUser(user);
    }
  };

  const handleSubmitLogin = async () => {
    if (telephone && telephone) {
      setLoading(true);
      const formData = new FormData();

      formData.append("telephone", telephone);
      formData.append("password", password);
      try {
        const response = await authenticate(undefined, formData);

        if (
          response === "Invalid credentials." ||
          response === "Something went wrong."
        ) {
          throw new Error(response);
        } else {
          if (redirect) {
            router.push(redirect);
          } else {
            router.push("/");
          }
          // document.location = "/";
        }
      } catch (error) {
        setErrorMessage("Identifiant incorrecte");
        onOpenAlert();
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs.");
      onOpenAlert();
    }
  };

  const contentComponentLogin = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitLogin();
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
          value={password}
          variant="bordered"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex  justify-end">
          <Link
            className="mt-4 mb-4 text-danger-100"
            href="#"
            size="sm"
            onPress={() => setStep("foreignPasswordStepOne")}
          >
            Mot de passe oublier?
          </Link>
        </div>

        <div className="flex flex-col w-full gap-4">
          <Submit loading={loading} />
          <Button
            onPress={() => setStep("typeAcount")}
            // color="primary"
            // variant='light'
          >
            S&apos;enregistrer
          </Button>
        </div>
      </form>
    );
  };

  const contentComponentType = () => {
    return (
      <div className="flex flex-col gap-4 w-full ">
        <div className="flex flex-col w-full gap-4 items-center my-4">
          <Button
            className="font-semibold w-full"
            startContent={<FaChurch />}
            variant="bordered"
            onPress={() => setStep("eglise")}
          >
            Eglise
          </Button>
          <Button
            className="font-semibold w-full"
            startContent={<FiUserPlus />}
            variant="bordered"
            onPress={() => setStep("fidele")}
          >
            Fidele
          </Button>
        </div>
        <Button variant="light" onPress={() => setStep("login")}>
          Déjà un compte ? Se connecter
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full py-4">
      <div>
        <a href="/">
          <Image alt="ecclesia" height={100} src="/ecclessia.png" width={100} />
        </a>
      </div>
      <div className="flex flex-col gap-1 text-2xl font-bold">
        {step === "login" && "Se connecter"}
        {step === "typeAcount" && "Type de compte"}
        {step === "fidele" && (
          <div className="flex flex-col">
            <span className="mr-2">Inscription de fidèle</span>
            <div className="flex my-4">
              <Button
                isIconOnly
                className="mr-2"
                variant="flat"
                onPress={() => setStep("eglise")}
              >
                <FaChurch />
              </Button>
              <Button
                isIconOnly
                className="ml-2"
                variant="flat"
                onPress={() => setStep("login")}
              >
                <RiLoginBoxLine />
              </Button>
            </div>
          </div>
        )}

        {step === "eglise" && (
          <div className="flex flex-col">
            <span className="mr-2">
              Inscription de l&apos;administrateur de l&apos;eglise
            </span>
            <div className="flex my-4">
              <Button
                isIconOnly
                className="mr-2"
                variant="flat"
                onPress={() => setStep("fidele")}
              >
                <FiUserPlus />
              </Button>
              <Button
                isIconOnly
                className="ml-2"
                variant="flat"
                onPress={() => setStep("login")}
              >
                <RiLoginBoxLine />
              </Button>
            </div>
          </div>
        )}

        {step === "egliseCreation" && (
          <div className="flex flex-col">
            <span className="mr-2">Création de l&apos;église</span>
            <div className="flex my-4">
              <Button
                isIconOnly
                className="ml-2"
                variant="flat"
                onPress={() => setStep("login")}
              >
                <RiLoginBoxLine />
              </Button>
            </div>
          </div>
        )}
        {step === "goToPayement" && "Paiement"}
        {step === "foreignPasswordStepOne" &&
          "Vérification du numéro de téléphone"}
        {step === "foreignPasswordConfimCode" && "Vérification du compte"}
        {step === "foreignPasswordStepTwo" && "Nouveau mot de passe"}
      </div>
      <div>
        {step === "login" && contentComponentLogin()}
        {step === "typeAcount" && contentComponentType()}
        {step === "fidele" && <Fidele />}
        {step === "eglise" && (
          <Admin
            emailEglise={emailEglise}
            lastNameEglise={lastNameEglise}
            nameEglise={nameEglise}
            passwordConfirmInscriptionEglise={passwordConfirmInscriptionEglise}
            passwordInscriptionEglise={passwordInscriptionEglise}
            setEmailEglise={setEmailEglise}
            setLastNameEglise={setLastNameEglise}
            setNameEglise={setNameEglise}
            setPasswordConfirmInscriptionEglise={
              setPasswordConfirmInscriptionEglise
            }
            setPasswordInscriptionEglise={setPasswordInscriptionEglise}
            setTelephoneEglise={setTelephoneEglise}
            setToken={setToken}
            telephoneEglise={telephoneEglise}
            token={token}
            onChangeStep={handleChangeStep}
          />
        )}
        {step === "egliseCreation" && (
          <EgliseComponent
            emailEglise={emailEglise}
            passwordInscriptionEglise={passwordInscriptionEglise}
            setToken={setToken}
            telephoneEglise={telephoneEglise}
            token={token}
            onChangeStep={handleChangeStep}
          />
        )}
        {step === "goToPayement" && (
          <GoToPayement
            emailEglise={emailEglise}
            telephoneEglise={telephoneEglise}
          />
        )}
        {step === "foreignPasswordStepOne" && (
          <ForgotPasswordCheckNumber onChangeStep={handleChangeStep} />
        )}
        {step === "foreignPasswordConfimCode" && (
          <ForgotPasswordConfirmCode
            user={user}
            onChangeStep={handleChangeStep}
          />
        )}
        {step === "foreignPasswordStepTwo" && (
          <GetNewPassword user={user} onChangeStep={handleChangeStep} />
        )}
      </div>

      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Erreur d'authification"}
        isOpen={isOpenAlert}
        onClose={() => {
          onCloseAlert();
        }}
        onOpen={() => {
          onOpenAlert();
        }}
      />

      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Terms et conditions"}
        isOpen={isOpenAlertTerms}
        onClose={() => {
          onCloseAlertTerms();
        }}
        onOpen={() => {
          onOpenAlertTerms();
        }}
      />
    </div>
  );
}

function Submit({ loading }: { loading: boolean }) {
  return (
    <Button
      aria-disabled={loading}
      className="mx-1 font-bold"
      color="primary"
      isLoading={loading}
      type="submit"
    >
      <p className="text-white">{loading ? "En cours..." : "Connexion"}</p>
    </Button>
  );
}
