import React from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

const CreateAdminForm = () => {
  return (
    <form className="flex flex-col gap-4 p-6 bg-white rounded-2xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mt-8">
        Créer un Administrateur
      </h2>

      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="admin@example.com"
        required
      />

      <Input
        type="tel"
        name="telephone"
        label="Téléphone"
        placeholder="+243 970 000 111"
        required
      />

      <Input
        type="text"
        name="role"
        label="Rôle"
        placeholder="Super Admin"
        required
      />

      <Input
        type="text"
        name="status"
        label="Statut"
        placeholder="Actif"
        required
      />

      <Input
        type="password"
        name="password"
        label="Mot de passe"
        placeholder="••••••••"
        required
      />

      <Button type="submit" color="primary" className="mt-4 text-white">
        Créer l'Admin
      </Button>
    </form>
  );
};

export default CreateAdminForm;
