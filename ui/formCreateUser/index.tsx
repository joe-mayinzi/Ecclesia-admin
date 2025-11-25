"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { toast } from "react-toastify";

type FormData = {
  postnom: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  sexe: "Homme" | "Femme" | "Not_definie";
  datenaissance: string;
  adresse: string;
  ville: string;
  pays: string;
  username: string;
  privileges: string[]; // ✅ tableau dynamique
};

// 👇 la liste des privilèges possibles
const allPrivileges = ["Create", "Read", "Update", "Delete"];

const CreateAdminForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // 🚨 Vérification spéciale pour les privilèges
    if (data.privileges?.length === allPrivileges.length) {
      toast.error("❌ Un administrateur ne peut pas avoir TOUS les privilèges. Réservez ça au super admin !");
      return; // ❌ on bloque l’envoi
    }

    try {
      const bodyToSend = {
        nom: data.nom,
        prenom: data.prenom,
        postnom: data.postnom,
        email: data.email,
        telephone: data.telephone,
        sexe: data.sexe,
        datenaissance: data.datenaissance,
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays,
        username: data.username,
        role: "Admin",
        privileges: data.privileges, // ✅ valeurs du Select
      };

      console.log(bodyToSend);

      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("✅ Administrateur créé avec succès !");
        reset();
      } else {
        if (Array.isArray(result.message)) {
          result.message.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(result.message || "Vérifiez vos champs");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur, réessayez plus tard.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-6 bg-white rounded-2xl max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-center mt-8">
        Créer un Administrateur
      </h2>

      <Input {...register("nom", { required: "Nom obligatoire" })} type="text" label="Nom" placeholder="Mayinzi" />
      {errors.nom && <p className="error-message">{errors.nom.message}</p>}

      <Input {...register("postnom", { required: "Postnom obligatoire" })} type="text" label="Postnom" placeholder="Smith" />
      {errors.postnom && <p className="error-message">{errors.postnom.message}</p>}


      <Input {...register("prenom", { required: "Prénom obligatoire" })} type="text" label="Prénom" placeholder="Joe" />
      {errors.prenom && <p className="error-message">{errors.prenom.message}</p>}

      <Input {...register("email", { required: "Email obligatoire" })} type="email" label="Email" placeholder="admin@example.com" />
      {errors.email && <p className="error-message">{errors.email.message}</p>}

      <Input
        {...register("telephone", {
          required: "Téléphone obligatoire",
          minLength: { value: 9, message: "Numéro trop court" },
        })}
        type="tel"
        label="Téléphone"
        placeholder="+243 970 000 111"
      />
      {errors.telephone && <p className="error-message">{errors.telephone.message}</p>}

      <label className="font-medium">Sexe</label>
      <select {...register("sexe", { required: true })} className="border p-2 rounded" defaultValue="Not_definie">
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
        <option value="Not_definie">Non défini</option>
      </select>

      <Input {...register("datenaissance", { required: "Date de naissance obligatoire" })} type="date" label="Date de naissance" />
      {errors.datenaissance && <p className="error-message">{errors.datenaissance.message}</p>}

      <Input {...register("adresse", { required: "Adresse obligatoire" })} type="text" label="Adresse" placeholder="Av Kasa-Vubu" />
      {errors.adresse && <p className="error-message">{errors.adresse.message}</p>}

      <Input {...register("ville", { required: "Ville obligatoire" })} type="text" label="Ville" placeholder="Kinshasa" />
      {errors.ville && <p className="error-message">{errors.ville.message}</p>}

      <Input {...register("pays", { required: "Pays obligatoire" })} type="text" label="Pays" placeholder="RDC" />
      {errors.pays && <p className="error-message">{errors.pays.message}</p>}

      <Input {...register("username", { required: "Nom d'utilisateur obligatoire" })} type="text" label="Nom d'utilisateur" placeholder="joedev123" />
      {errors.username && <p className="error-message">{errors.username.message}</p>}

      {/* ✅ Champ Privilèges avec NextUI Select */}
      <Controller
        name="privileges"
        control={control}
        rules={{ required: "Choisissez au moins un privilège" }}
        render={({ field }) => (
          <Select
            label="Privilèges"
            placeholder="Sélectionnez les privilèges"
            selectionMode="multiple"
            className="max-w-md"
            selectedKeys={new Set(field.value || [])}
            onSelectionChange={(keys) => field.onChange(Array.from(keys))}
          >
            {allPrivileges.map((priv) => (
              <SelectItem key={priv} value={priv}>
                {priv}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      {errors.privileges && <p className="error-message">{errors.privileges.message}</p>}

      <Button type="submit" color="primary" className="mt-4 text-white">
        Créer l'Admin
      </Button>
    </form>
  );
};

export default CreateAdminForm;
