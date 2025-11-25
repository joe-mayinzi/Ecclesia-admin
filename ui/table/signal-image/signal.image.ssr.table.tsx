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
import { columns } from "./data";
import { api_url } from "@/app/lib/request/request";

type RawImage = {
  descrition: any;
  id: number;
  titre: string;
  auteur: string;
  photo: string;
  lien: string;
  userId: number | null;
  signalements: {
    id: number;
    commentaire: string;
    resolved: boolean;
    createdAt: string;
    users?: { nom?: string; prenom?: string };
  }[];
};

type Signalement = {
  id: number;
  commentaire: string;
  resolved: boolean;
  createdAt: string;
  utilisateur: string;
  nbSignalements: number;
  images: {
    id: number;
    titre: string;
    auteur: string;
    photo: string;
    lien: string;
    userId: number | null;
  };
};

type Props = { data: RawImage[] };

export default function SignalementImageSsrTableUI({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [selected, setSelected] = useState<Signalement | null>(null);

  console.log(signalements);
  

useEffect(() => {
  const flat = data.flatMap(image =>
    (image.signalements || []).map(sig => ({
      id: sig.id,
      commentaire: sig.commentaire,
      resolved: sig.resolved ?? false,
      createdAt: sig.createdAt,
      utilisateur: `${sig.users?.nom || ""} ${sig.users?.prenom || ""}`.trim(),
      nbSignalements: image.signalements.length,
      images: {
        id: image.id,
        titre: String(image.descrition ?? image.titre ?? ""), // ⚡️ ici on récupère "descrition" ou fallback sur titre
        auteur: image.auteur ?? "-", // tu peux remplacer par "-" si pas défini
        photo: image.photo ?? "", // <-- add missing required property
        lien: image.lien ?? "",
        userId: image.userId,
      },
    }))
  );
  setSignalements(flat);
}, [data]);

  // ✅ Marquer comme résolu
  const handleResolve = async (item: Signalement) => {
    try {
      setSignalements(prev =>
        prev.map(sig => (sig.id === item.id ? { ...sig, resolved: true } : sig))
      );
      toast.success(`Signalement #${item.id} marqué comme résolu`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du traitement");
    }
  };

  // ⚠️ Envoyer un avertissement
  const handleWarn = async (item: Signalement) => {
    try {
      const typeContent = "images";
      const userID = item.images.userId;
      const idContent = item.images.id;

      const res = await fetch(
        `${api_url}/notificationByAdmin/${userID}/${idContent}?typeContent=${typeContent}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avertissement");

      toast.success(`Avertissement envoyé pour le contenu #${item.images.id}`);
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
      <Table aria-label="Liste des Signalements Images" isStriped removeWrapper>
        <TableHeader>
          {columns.map(col => (
            <TableColumn key={col.uid}>{col.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {signalements.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.images?.titre ?? "-"}</TableCell>
              <TableCell>{item.images?.auteur ?? "-"}</TableCell>
              <TableCell>{item.commentaire ?? "Aucun commentaire"}</TableCell>
              <TableCell>{item.utilisateur || "Anonyme"}</TableCell>
              <TableCell className="text-center">
                {item.nbSignalements ?? 0}
              </TableCell>
              <TableCell>
                <Chip color={item.resolved ? "success" : "danger"} className="text-white">
                  {item.resolved ? "Résolu" : "En attente"}
                </Chip>
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString("fr-FR")}</TableCell>
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
                as="a"
                href={`https://ecclesiabook.org/pictures/${item.images.id}`}
                target="_blank"
                rel="noreferrer"
                >
                Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
