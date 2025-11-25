"use client";

import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Chip,
} from "@nextui-org/react";
import { MailIcon } from "@/ui/icons";

type User = {
  id: number | string;
  name: string | null;
  email: string | null;
};

type MailModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

export default function MailModal({ user, isOpen, onClose }: MailModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: { subject?: string; body?: string } = {};

    if (!subject.trim()) {
      newErrors.subject = "L'objet est obligatoire";
    } else if (subject.trim().length < 3) {
      newErrors.subject = "L'objet doit contenir au moins 3 caractères";
    }

    if (!body.trim()) {
      newErrors.body = "Le message est obligatoire";
    } else if (body.trim().length < 10) {
      newErrors.body = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [subject, body]);

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    if (errors.subject) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.subject;
        return newErrors;
      });
    }
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    if (errors.body) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.body;
        return newErrors;
      });
    }
  };

  const sendMail = async () => {
    if (!user.email) {
      toast.error("L'email de l'utilisateur n'est pas disponible");
      return;
    }

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.email, subject: subject.trim(), message: body.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          `Mail envoyé avec succès à ${user.name || user.email || "l'utilisateur"}`
        );
        setSubject("");
        setBody("");
        setErrors({});
        onClose();
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du mail");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du mail:", err);
      toast.error("Erreur lors de l'envoi du mail. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubject("");
    setBody("");
    setErrors({});
    onClose();
  };

  if (!user.email) return null;

  const recipientName = user.name || user.email || "l'utilisateur";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
        backdrop: "bg-white/80 backdrop-opacity-80",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MailIcon className="text-2xl text-primary" />
              </div>
            <div>
              <h2 className="text-2xl font-semibold">Envoyer un email</h2>
              <p className="text-sm text-default-500 font-normal mt-1">
                Destinataire: <span className="font-medium text-default-700">{recipientName}</span>
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Destinataire info */}
            <div className="flex items-center gap-2 p-3 bg-default-100 rounded-lg">
              <Chip size="sm" variant="flat" color="primary">
                À
              </Chip>
              <span className="text-sm text-default-700 break-all">{user.email}</span>
            </div>

            {/* Objet */}
            <Input
              isClearable
              label="Objet"
              placeholder="Sujet de votre message"
              value={subject}
              onValueChange={handleSubjectChange}
              isRequired
              isInvalid={!!errors.subject}
              errorMessage={errors.subject}
              variant="bordered"
              autoFocus
              classNames={{
                input: "text-sm",
                label: "text-sm font-medium",
              }}
            />

            {/* Message */}
            <Textarea
              label="Message"
              placeholder="Rédigez votre message ici..."
              value={body}
              onValueChange={handleBodyChange}
              isRequired
              isInvalid={!!errors.body}
              errorMessage={errors.body}
              variant="bordered"
              minRows={6}
              maxRows={12}
              classNames={{
                input: "text-sm",
                label: "text-sm font-medium",
              }}
            />

            {/* Compteur de caractères */}
            <div className="flex justify-end">
              <p className="text-xs text-default-400">
                {body.length} caractère{body.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4">
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            className="w-full sm:w-auto"
            isDisabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            color="primary"
            className="text-white w-full sm:w-auto"
            isLoading={isSubmitting}
            onPress={sendMail}
            startContent={!isSubmitting && <MailIcon className="text-lg" />}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer l'email"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
