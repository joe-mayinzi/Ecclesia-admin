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

type RawForum = {
  id: number | string;
  title?: string | null;
  description?: string | null;
  picture?: string | null;
  userId?: number | string | null;
  signalements?: Array<{
    id: number | string;
    commentaire?: string | null;
    createdAt?: string;
    resolved?: boolean;
    users?: { nom?: string; prenom?: string; email?: string };
  }>;
};

type SignalementForum = {
  id: number | string;
  commentaire?: string | null;
  createdAt?: string;
  resolved: boolean;
  utilisateur: string;
  nbSignalements: number;
  forum: {
    id: number | string;
    title?: string | null;
    description?: string | null;
    picture?: string | null;
    userId?: number | string | null;
  };
};

type Props = { data: RawForum[] };

export default function SignalementForumSsrTableUI({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signalements, setSignalements] = useState<SignalementForum[]>([]);

  useEffect(() => {
    const flat = data.flatMap(forum =>
      (forum.signalements || []).map(sig => ({
        id: sig.id,
        commentaire: sig.commentaire,
        createdAt: sig.createdAt,
        resolved: sig.resolved ?? false,
        utilisateur: `${sig.users?.nom || ""} ${sig.users?.prenom || ""} (${sig.users?.email || "N/A"})`.trim(),
        nbSignalements: (forum.signalements || []).length,
        forum: {
          id: forum.id,
          title: forum.title,
          description: forum.description,
          picture: forum.picture,
          userId: forum.userId,
        },
      }))
    );
    setSignalements(flat);
  }, [data]);

  const handleResolve = (item: SignalementForum) => {
    setSignalements(prev =>
      prev.map(sig => (sig.id === item.id ? { ...sig, resolved: true } : sig))
    );
    toast.success(`Signalement #${item.id} marqué comme résolu`);
  };

  const handleWarn = async (item: SignalementForum) => {
    try {
      const typeContent = "forum";
      const userID = item.forum.userId;
      const idContent = item.forum.id;

      const res = await fetch(
        `${api_url}/notificationByAdmin/${userID}/${idContent}?typeContent=${typeContent}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avertissement");

      toast.success(`Avertissement envoyé pour le forum #${item.forum.id}`);
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
      <Table aria-label="Liste des Signalements Forum" isStriped removeWrapper>
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
              <TableCell>{item.forum.title ?? "Sans titre"}</TableCell>
              <TableCell>
                {item.forum.picture ? (
                  <a href={`${api_url}/${item.forum.picture}`} target="_blank" rel="noreferrer">
                    Voir image
                  </a>
                ) : (
                  "Aucune image"
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
                as="a"
                href={`https://bible.ecclesiabook.org/forum/${item.forum.id}`}
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
