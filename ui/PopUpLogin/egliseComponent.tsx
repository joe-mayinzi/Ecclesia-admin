"use client";
import React, { useState } from "react";
import { Slider } from "@nextui-org/slider";
import { jwtDecode } from "jwt-decode";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { DonwLoadIcon } from "../icons";
import Alert from "../modal/alert";
import { MailIcon } from "../icons";
import { CreateChurche } from "../../app/lib/services/api/churcheApi";
import { updateAdmin } from "../../app/lib/services/api/AuthApi";

import { authenticate } from "@/app/lib/actions/auth";

type StepType =
  | "login"
  | "typeAcount"
  | "fidele"
  | "egliseCreation"
  | "eglise"
  | "goToPayement";

interface EgliseProps {
  onChangeStep: (newStep: StepType) => void;
  telephoneEglise: string;
  passwordInscriptionEglise: string;
  emailEglise: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  token: string;
}

export default function EgliseComponent(props: EgliseProps) {
  const [isOpenAlertEgliseCreation, setIsOpenAlertEgliseCreation] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameEgliseCreation, setNameEgliseCreation] = useState("");
  const [siglegliseCreation, setsiglegliseCreation] = useState("");
  // const [communautes, setCommunautes] = useState<string>("0");
  const [adresseEgliseCreation, setadresseEgliseCreation] = useState("");
  const [villeEgliseCreation, setvilleEgliseCreation] = useState("");
  const [paysEgliseCreation, setpaysEgliseCreation] = useState("");
  const [photoEgliseCreation, setphotoEgliseCreation] = useState<File | null>(
    null,
  );
  const [photoPreview, setPothoPreview] = useState<string>();
  // const [photoCouvertureEgliseCreation, setphotoCouvertureEgliseCreation] = useState<File | null>(null);
  const [snackStateEgliseCreation, setsnackStateEgliseCreation] = useState([
    0, 1000000,
  ]);
  const onOpenAlertEgliseCreation = () => setIsOpenAlertEgliseCreation(true);
  const onCloseAlertEgliseCreation = () => setIsOpenAlertEgliseCreation(false);

  // const [communauteValue, setCommunauteValue] = useState("");
  // const [communauteSelectedKey, setCommunauteSelectedKey] = useState<string | number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileUrl = reader.result ? reader.result.toString() : "";

        setPothoPreview(fileUrl);
        setphotoEgliseCreation(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEgliseCreation = async () => {
    setLoading(true);
    if (
      nameEgliseCreation &&
      siglegliseCreation &&
      adresseEgliseCreation &&
      villeEgliseCreation &&
      paysEgliseCreation &&
      snackStateEgliseCreation
    ) {
      const formData = new FormData();

      formData.append("nom_eglise", nameEgliseCreation);
      if (photoEgliseCreation) {
        formData.append("photo", photoEgliseCreation);
      }
      formData.append("sigle_eglise", siglegliseCreation);
      formData.append("adresse_eglise", adresseEgliseCreation);
      formData.append(
        "nombrefidel_eglise",
        JSON.stringify(snackStateEgliseCreation),
      );
      formData.append("ville_eglise", villeEgliseCreation);
      formData.append("pays_eglise", paysEgliseCreation);
      const user: any = jwtDecode(props.token);

      if (user) {
        try {
          setLoading(true);
          const response = await CreateChurche(formData);

          setLoading(false);
          if (response && response.id_eglise) {
            if (user) {
              const update = await updateAdmin(
                { fk_eglise: response.id_eglise },
                props.token,
                user ? user.sub : 0,
              );

              if (update.hasOwnProperty("access_token")) {
                const authformData = new FormData();

                authformData.append("telephone", props.telephoneEglise);
                authformData.append(
                  "password",
                  props.passwordInscriptionEglise,
                );
                await authenticate(undefined, authformData);
                props.onChangeStep("goToPayement");
              } else {
                throw new Error(`Erreur lors de la mise à jour administrative`);
              }
            }
          } else {
            throw new Error(
              `Erreur lors de la création de l'église : ${response.statusText}`,
            );
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Erreur lors de l'envoi du formulaire";

          setErrorMessage(message);
          onOpenAlertEgliseCreation();
        } finally {
          setLoading(false);
        }
      } else {
        setErrorMessage(
          "Malheureusement, la création de votre église a échoué. Ne vous inquiétez pas, contactez simplement ecclesiabook@linked-solution.com et nous vous aiderons à la finaliser.",
        );
        onOpenAlertEgliseCreation();
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
      onOpenAlertEgliseCreation();
    }
    setLoading(false);
  };

  // const onSelectionChange = (id: number | string) => {
  //   setCommunauteSelectedKey(id);
  // };

  // const onInputChange = (value: string) => {
  //   setCommunauteValue(value);
  // };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitEgliseCreation();
        }}
      >
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Nom"
          name="nom_eglise"
          placeholder="Entrer le nom de l'eglise"
          type="text"
          value={nameEgliseCreation}
          variant="bordered"
          onChange={(e) => setNameEgliseCreation(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Sigle"
          name="sigle_eglise"
          placeholder="Entrer votre le sigle"
          type="text"
          value={siglegliseCreation}
          variant="bordered"
          onChange={(e) => setsiglegliseCreation(e.target.value)}
        />
        {/* <p>{communauteValue}</p>
        <Autocomplete
          defaultItems={animalsAutoComplete}
          label="Communautés"
          placeholder="Recherchez votre communauté"
          name="communaute_eglise"
          variant="bordered"
          allowsCustomValue={true}
          onSelectionChange={onSelectionChange}
          onInputChange={onInputChange}
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        >
          {(animal) => <AutocompleteItem value={animal.value} key={animal.value}>{animal.label}</AutocompleteItem>}
        </Autocomplete> */}

        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Adresse"
          name="adresse_eglise"
          placeholder="Entrer l'adresse de l'eglise"
          type="text"
          value={adresseEgliseCreation}
          variant="bordered"
          onChange={(e) => setadresseEgliseCreation(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Ville"
          name="ville_eglise"
          placeholder="Entrer le nom de la ville"
          type="text"
          value={villeEgliseCreation}
          variant="bordered"
          onChange={(e) => setvilleEgliseCreation(e.target.value)}
        />
        <Input
          className="mt-4 mb-4"
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Pays"
          name="pays_eglise"
          placeholder="Entrer le nom du pays"
          type="text"
          value={paysEgliseCreation}
          variant="bordered"
          onChange={(e) => setpaysEgliseCreation(e.target.value)}
        />

        <div className="flex gap-2 items-center mt-4">
          <div className="flex w-full items-center justify-center bg-grey-lighter">
            <label className="w-56 flex flex-col items-center px-4 py-6 text-blue rounded-lg shadow-lg tracking-wide uppercase border-dashed border-2 cursor-pointer">
              {!photoPreview && (
                <>
                  <DonwLoadIcon />
                  <span className="mt-2 text-base leading-normal">
                    Logo de l&apos;église
                  </span>
                </>
              )}
              <input
                className="hidden"
                type="file"
                onChange={(e) => handleFileChange(e)}
              />
              {photoPreview && (
                <Image
                  alt={`Photo profil`}
                  src={
                    typeof photoPreview === "string"
                      ? photoPreview
                      : URL.createObjectURL(photoPreview)
                  }
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "1rem",
                    objectFit: "cover",
                  }}
                />
              )}
            </label>
          </div>
        </div>

        <Slider
          className="max-w-md mt-4"
          defaultValue={[0, 500000]}
          label="Intervalle de vos fideles"
          maxValue={500000}
          minValue={0}
          step={10}
          value={snackStateEgliseCreation}
          onChange={(newValue) => {
            const valueArray = Array.isArray(newValue) ? newValue : [newValue];

            setsnackStateEgliseCreation(valueArray);
          }}
        />

        <Submit loading={loading} />
      </form>
      <Alert
        alertBody={<p>{errorMessage}</p>}
        alertTitle={"Creation eglise"}
        isOpen={isOpenAlertEgliseCreation}
        onClose={() => {
          onCloseAlertEgliseCreation();
        }}
        onOpen={() => {
          onOpenAlertEgliseCreation();
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
      {loading ? "En cours..." : "Cree eglise"}
    </Button>
  );
}
