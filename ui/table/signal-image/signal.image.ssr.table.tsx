"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Card,
  CardBody,
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

  // Marquer comme résolu (mise à jour locale uniquement - resolved est une propriété de la réponse)
  const handleResolve = (item: Signalement) => {
    if (item.resolved) return; // Ne rien faire si déjà résolu
    
    try {
      // Mise à jour locale de l'état (resolved est une propriété qui vient de l'API)
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

  // Styles pour la table - Inspiré du design TailAdmin
  const tableClassNames = useMemo(
    () => ({
      wrapper: "min-h-[222px] shadow-sm rounded-lg border border-gray-200 bg-white dark:bg-gray-800 overflow-hidden",
      th: [
        "bg-gray-50",
        "text-gray-700",
        "font-semibold",
        "text-xs",
        "uppercase",
        "tracking-wider",
        "border-b",
        "border-gray-200",
        "py-4",
        "px-6",
        "first:rounded-tl-lg",
        "last:rounded-tr-lg",
      ],
      td: [
        "py-4",
        "px-6",
        "text-sm",
        "text-gray-800",
        "border-b",
        "border-gray-100",
        "group-data-[hover=true]:bg-gray-50/50",
        "transition-colors",
        "duration-200",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
      ],
      tr: [
        "hover:bg-gray-50/30",
        "transition-all",
        "duration-200",
        "group",
        "border-b",
        "border-gray-100",
        "last:border-b-0",
      ],
    }),
    []
  );

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = signalements.length;
    const resolved = signalements.filter(s => s.resolved).length;
    const pending = total - resolved;
    return { total, resolved, pending };
  }, [signalements]);

  if (!signalements.length) {
    return (
      <div className="p-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardBody className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Aucun signalement trouvé</h2>
            <p className="text-sm text-gray-500">Il n'y a actuellement aucun signalement d'image à traiter</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Signalements Images</h1>
          <p className="text-sm text-gray-600">Gestion et suivi des signalements d'images</p>
        </div>
        <div className="flex gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Table des signalements */}
      <Card className="border border-gray-200 shadow-sm">
        <CardBody className="p-0">
          <Table 
            aria-label="Liste des Signalements Images" 
            isStriped
            removeWrapper
            classNames={tableClassNames}
          >
            <TableHeader>
              {columns.map(col => (
                <TableColumn 
                  key={col.uid}
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  {col.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody 
              emptyContent={
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-gray-500 text-sm font-medium">Aucun signalement trouvé</p>
                </div>
              }
            >
              {signalements.map((item, index) => (
                <TableRow 
                  key={item.id || index}
                  className="group hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-500 font-medium text-sm">#{index + 1}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-800 font-medium text-sm">{item.images?.titre ?? "-"}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-600 text-sm">{item.images?.auteur ?? "-"}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-700 text-sm max-w-md line-clamp-2">
                      {item.commentaire ?? "Aucun commentaire"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-600 text-sm">{item.utilisateur || "Anonyme"}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {item.nbSignalements ?? 0}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Chip
                      color={item.resolved ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                      className="font-medium rounded-full px-3 py-1"
                      classNames={{
                        base: item.resolved
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                      }}
                    >
                      {item.resolved ? "Résolu" : "En attente"}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-500 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        color="success"
                        variant="solid"
                        isDisabled={item.resolved}
                        onClick={() => handleResolve(item)}
                        className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90 disabled:opacity-50"
                      >
                        Résoudre
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        variant="solid"
                        as="a"
                        href={`https://ecclesiabook.org/pictures/${item.images.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                      >
                        Voir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
