"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import Alert from "../modal/alert";

import {
  AuthsendSmsByTelApi,
  checkValidateCodeApi,
} from "@/app/lib/actions/auth";

let currentOTPIndex: number = 0;

export default function ForgotPasswordConfirmCode({ onChangeStep, user }: any) {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendig, setPending] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newOTP: string[] = [...otp];

    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);

    // Vérifier si tous les champs sont remplis
    if (newOTP.every((char) => char !== "")) {
      handleSubmit(newOTP); // Soumettre le formulaire
    }
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  const handleSubmit = async (currentOtp: string[]) => {
    if (currentOtp.length === 6) {
      const otp = currentOtp.join("");

      setLoading(true);
      const verify = await checkValidateCodeApi(otp, user.telephone);

      setLoading(false);
      if (
        !verify.hasOwnProperty("statusCode") &&
        !verify.hasOwnProperty("message")
      ) {
        onChangeStep("foreignPasswordStepTwo", user);
      } else {
        setIsOpenAlert(true);
        setErrorMessage("Le code de vérification n'est pas correct.");
      }
    }
  };

  const handleAuthsendSmsByTel = useCallback(async () => {
    const newnum = user.telephone.substring(1);

    setPending(true);
    await AuthsendSmsByTelApi({ tel: newnum, email: user.email });

    setPending(false);
  }, [pendig, setPending]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    if (pastedText.length === 6) {
      const newOTP: string[] = [...otp];

      for (let i = 0; i < newOTP.length && i < pastedText.length; i++) {
        newOTP[i] = pastedText[i];
      }
      if (newOTP.every((char) => char !== "")) {
        setOtp(newOTP);
        setActiveOTPIndex(newOTP.length - 1);
        handleSubmit(newOTP);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <>
      <form>
        <p className="text-center">
          Nous avons envoyé un code à 6 chiffres à l’adresse <b>{user.email}</b>
          . <br />
          Veuillez saisir le code rapidement, car il arrive bientôt à
          expiration.
        </p>
        <div className={"flex justify-center items-center space-x-2"}>
          {otp.map((_, index) => {
            return (
              <React.Fragment key={index}>
                <Input
                  ref={activeOTPIndex === index ? inputRef : null}
                  formNoValidate
                  className={
                    "w-12 h-12  outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                  }
                  isDisabled={loading}
                  type="text"
                  value={otp[index]}
                  onChange={handleOnChange}
                  onKeyDown={(e) => handleOnKeyDown(e, index)}
                  onPaste={handlePaste}
                />
                {index === otp.length - 1 ? null : (
                  <span className={"w-2 py-0.5 bg-gray-400"} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex gap-4">
          <Button
            className="mt-4"
            isLoading={pendig}
            variant="bordered"
            onClick={() => {
              handleAuthsendSmsByTel();
            }}
          >
            <p>Renvoyer le code</p>
          </Button>
          <Button
            className="mt-4"
            color="primary"
            onClick={() => {
              onChangeStep("foreignPasswordStepOne");
            }}
          >
            Changer de numéro
          </Button>
        </div>
      </form>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle="Vérification du code"
        isOpen={isOpenAlert}
        onClose={() => {
          setIsOpenAlert(false);
        }}
        onOpen={() => {
          setIsOpenAlert(true);
        }}
      />
    </>
  );
}
