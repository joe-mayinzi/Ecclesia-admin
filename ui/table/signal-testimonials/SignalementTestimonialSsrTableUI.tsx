"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { columns, statusOptions } from "./data";
import { api_url } from "@/app/lib/request/request";

type RawTestimonial = {
  id: number | string;
  description?: string | null;
  link?: string | null;
  userId?: number | string | null;
  signalements?: Array<{
    id: number | string;
    commentaire?: string | null;
    createdAt?: string;
    resolved?: boolean;
    users?: { nom?: string; prenom?: string; email?: string };
  }>;
};

type SignalementTestimonial = {
  id: number | string;
  commentaire?: string | null;
  createdAt?: string;
  resolved: boolean;
  utilisateur: string;
  nbSignalements: number;
  testimonial: {
    id: number | string;
    description?: string | null;
    link?: string | null;
    userId?: number | string | null;
  };
};

type Props = { data: RawTestimonial[] };

export default function SignalementTestimonialSsrTableUI({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signalements, setSignalements] = useState<SignalementTestimonial[]>([]);

  useEffect(() => {
    const flat = data.flatMap(testimonial =>
      (testimonial.signalements || []).map(sig => ({
        id: sig.id,
        commentaire: sig.commentaire,
        createdAt: sig.createdAt,
        resolved: sig.resolved ?? false,
        utilisateur: `${sig.users?.nom || ""} ${sig.users?.prenom || ""} (${sig.users?.email || "N/A"})`.trim(),
        nbSignalements: (testimonial.signalements || []).length,
        testimonial: {
          id: testimonial.id,
          description: testimonial.description,
          link: testimonial.link,
          userId: testimonial.userId,
        },
      }))
    );
    setSignalements(flat);
  }, [data]);

  const handleResolve = (item: SignalementTestimonial) => {
    setSignalements(prev =>
      prev.map(sig => (sig.id === item.id ? { ...sig, resolved: true } : sig))
    );
    toast.success(`Signalement #${item.id} marqué comme résolu`);
  };

  const handleWarn = async (item: SignalementTestimonial) => {
    try {
      const typeContent = "testimonials";
      const userID = item.testimonial.userId;
      const idContent = item.testimonial.id;

      const res = await fetch(
        `${api_url}/notificationByAdmin/${userID}/${idContent}?typeContent=${typeContent}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avertissement");

      toast.success(`Avertissement envoyé pour le témoignage #${item.testimonial.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Impossible d'envoyer l'avertissement");
    }
  };

  if (!signalements.length) {
    return (
      <div className="p-6">
        <h2 className="text-lg">Aucun signalement trouvé</h2>
      </div>
    );
  }

  return (
    <div>
      <Table aria-label="Liste des Signalements Testimonials" isStriped removeWrapper>
        <TableHeader>
          {columns.map(col => (
            <TableColumn key={col.uid}>{col.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {signalements.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.utilisateur}</TableCell>
              <TableCell>{item.testimonial.description ?? "Sans description"}</TableCell>
              <TableCell>
                {item.testimonial.link ? (
                  <a href={`${api_url}/${item.testimonial.link}`} target="_blank" rel="noreferrer">
                    Voir fichier
                  </a>
                ) : (
                  "Aucun fichier"
                )}
              </TableCell>
              <TableCell>{item.commentaire ?? "Aucun commentaire"}</TableCell>
              <TableCell className="text-center">{item.nbSignalements}</TableCell>
              <TableCell>
                <Chip color={item.resolved ? "success" : "warning"} className="text-white">
                  {item.resolved ? "Résolu" : "En attente"}
                </Chip>
              </TableCell>
              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("fr-FR") : "-"}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  size="sm"
                  color="success"
                  className="mr-2"
                  isDisabled={item.resolved}
                  onClick={() => handleResolve(item)}
                >
                  Résoudre
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  onClick={() => handleWarn(item)}
                >
                  Notifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
