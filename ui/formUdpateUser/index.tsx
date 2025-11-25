"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
} from "@nextui-org/react";
import { updateAdminApi } from "@/app/lib/actions/admin/admin.req";

// Types
interface AdminData {
  id: string | number;
  nom?: string;
  postnom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  username?: string;
  profil?: string;
  status?: string;
  deletedAt?: string | null;
  [key: string]: unknown;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  adminData: AdminData | null;
  onUpdateSuccess: (updatedAdmin: AdminData) => void;
}

interface FormData {
  nom: string;
  postnom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  pays: string;
  username: string;
  profil: string;
}

export default function UpdateAdminDataForm({
  isOpen,
  onClose,
  adminData,
  onUpdateSuccess,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    postnom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    pays: "",
    username: "",
    profil: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Initialize form data when adminData changes
  useEffect(() => {
    if (adminData) {
      setFormData({
        nom: adminData.nom || "",
        postnom: adminData.postnom || "",
        prenom: adminData.prenom || "",
        email: adminData.email || "",
        telephone: adminData.telephone || "",
        adresse: adminData.adresse || "",
        ville: adminData.ville || "",
        pays: adminData.pays || "",
        username: adminData.username || "",
        profil: adminData.profil || "",
      });
      setErrors({});
    }
  }, [adminData]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nom?.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.telephone?.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire";
    } else if (formData.telephone.replace(/\D/g, "").length < 9) {
      newErrors.telephone = "Le numéro de téléphone doit contenir au moins 9 chiffres";
    }

    if (formData.profil && !/^https?:\/\/.+/.test(formData.profil)) {
      newErrors.profil = "L'URL du profil doit commencer par http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!adminData?.id) {
        throw new Error("ID administrateur manquant");
      }

      const adminId =
        typeof adminData.id === "string"
          ? parseInt(adminData.id, 10)
          : adminData.id;

      if (isNaN(adminId)) {
        throw new Error("ID administrateur invalide");
      }

      const updatedAdmin = await updateAdminApi(adminId, formData);
      toast.success("Administrateur mis à jour avec succès !");
      onUpdateSuccess(updatedAdmin);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour de l'admin";
      console.error("Erreur lors de la mise à jour :", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!adminData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] border-2 border-[#DC2626]",
        body: "py-6 bg-white",
        header: "bg-gradient-to-r from-[#DC2626] to-[#1e3a5f] text-white",
        footer: "bg-gray-50 border-t border-gray-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-4">
          <h2 className="text-2xl font-bold text-white">Modifier l'administrateur</h2>
          <p className="text-sm text-white/90 font-normal">
            Mettez à jour les informations de l'administrateur
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-[#DC2626] rounded-full"></div>
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Informations personnelles
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Entrez le nom"
                  isRequired
                  isInvalid={!!errors.nom}
                  errorMessage={errors.nom}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
                <Input
                  label="Postnom"
                  name="postnom"
                  value={formData.postnom}
                  onChange={handleChange}
                  placeholder="Entrez le postnom"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
                <Input
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Entrez le prénom"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
                <Input
                  label="Nom d'utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Entrez le nom d'utilisateur"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
              </div>
            </div>

            <Divider className="bg-gradient-to-r from-transparent via-[#DC2626] to-transparent h-[2px]" />

            {/* Coordonnées */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-[#1e3a5f] rounded-full"></div>
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Coordonnées
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  isRequired
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                    errorMessage: "text-[#DC2626]",
                  }}
                />
                <Input
                  label="Téléphone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+243 970 000 111"
                  isRequired
                  isInvalid={!!errors.telephone}
                  errorMessage={errors.telephone}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                    errorMessage: "text-[#DC2626]",
                  }}
                />
              </div>
            </div>

            <Divider className="bg-gradient-to-r from-transparent via-[#DC2626] to-transparent h-[2px]" />

            {/* Adresse */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-[#DC2626] rounded-full"></div>
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Adresse
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="Av Kasa-Vubu"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
                <Input
                  label="Ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Kinshasa"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
                <Input
                  label="Pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  placeholder="RDC"
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    label: "text-sm font-semibold text-[#1e3a5f]",
                    inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  }}
                />
              </div>
            </div>

            <Divider className="bg-gradient-to-r from-transparent via-[#DC2626] to-transparent h-[2px]" />

            {/* Profil */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-[#1e3a5f] rounded-full"></div>
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Profil
                </h3>
              </div>
              <Input
                label="URL du profil"
                name="profil"
                type="url"
                value={formData.profil}
                onChange={handleChange}
                placeholder="https://example.com/profil.jpg"
                isInvalid={!!errors.profil}
                errorMessage={errors.profil}
                variant="bordered"
                classNames={{
                  input: "text-sm",
                  label: "text-sm font-semibold text-[#1e3a5f]",
                  inputWrapper: "border-gray-300 hover:border-[#DC2626] focus-within:border-[#DC2626]",
                  errorMessage: "text-[#DC2626]",
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4 bg-gray-50">
          <Button
            variant="bordered"
            onPress={handleClose}
            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold"
            isDisabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            className="w-full sm:w-auto bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white font-semibold shadow-lg hover:shadow-xl hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-200"
            isLoading={isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
