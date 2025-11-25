"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Spinner,
  Textarea,
  Avatar,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatRelativeDate } from "@/utils/utils";
import { respondToUserSuggestion } from "@/app/lib/actions/suggestions/suggestions.req";
import { columns } from "./data";

// Types
interface SuggestionResponse {
  message: string;
  createdAt: string;
  responder: {
    nom: string;
    prenom: string;
  };
}

interface UserSuggestion {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  profil?: string;
}

interface Suggestion {
  id: number;
  suggestion: string;
  createdAt: string;
  updatedAt: string;
  userSuggestion: UserSuggestion | null;
  responses: SuggestionResponse[] | null;
}

type Props = { data: Suggestion[] };

// Fonction pour extraire les initiales (2 premières lettres)
const getInitials = (nom?: string, prenom?: string): string => {
  if (!nom && !prenom) return "U";
  
  const firstLetter = nom?.charAt(0)?.toUpperCase() || "";
  const secondLetter = prenom?.charAt(0)?.toUpperCase() || nom?.charAt(1)?.toUpperCase() || "";
  
  return (firstLetter + secondLetter).slice(0, 2) || "U";
};

export default function SuggestionsSsrTableUI({ data }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    data.filter((s) => s.suggestion?.trim() !== "" && s.userSuggestion !== null)
  );
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // La vérification d'authentification est gérée côté serveur dans page.tsx
  // Pas besoin de redirection côté client car la page ne sera pas rendue si non authentifié

  // Ouvrir modal de réponse
  const openReplyModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setReply("");
    setReplyModalOpen(true);
  };

  // Envoyer une réponse
  const handleSendReply = async () => {
    if (!reply.trim() || !selectedSuggestion) {
      toast.error("Veuillez saisir une réponse");
      return;
    }

    setIsSubmitting(true);
    try {
      await respondToUserSuggestion(selectedSuggestion.id, {
        message: reply.trim(),
      });

      // Mettre à jour localement
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === selectedSuggestion.id
            ? {
                ...s,
                responses: [
                  ...(s.responses || []),
                  {
                    message: reply.trim(),
                    createdAt: new Date().toISOString(),
                    responder: {
                      nom: session?.user?.nom || "Admin",
                      prenom: session?.user?.prenom || "",
                    },
                  },
                ],
              }
            : s
        )
      );

      toast.success("Réponse envoyée avec succès !");
      setReplyModalOpen(false);
      setReply("");
      setSelectedSuggestion(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi de la réponse";
      console.error("Erreur lors de l'envoi de la réponse :", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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

  // Loader avec les couleurs du logo
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-transparent border-l-[#DC2626] border-b-[#DC2626] rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 border-4 border-transparent border-r-[#1E3A8A] border-t-[#1E3A8A] rounded-full animate-spin"
              style={{ animationDuration: "1.2s" }}
            ></div>
          </div>
          <p className="text-default-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // Vue mobile (cartes)
  if (isMobile) {
    return (
      <div className="w-full space-y-4 pb-4">
        {suggestions.length === 0 ? (
          <Card className="w-full border border-gray-200 shadow-sm rounded-lg bg-white dark:bg-gray-800">
            <CardBody className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">Aucune suggestion trouvée</p>
            </CardBody>
          </Card>
        ) : (
          suggestions.map((suggestion, index) => (
            <Card
              key={suggestion.id}
              className="w-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg bg-white dark:bg-gray-800"
            >
              <CardBody className="p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold text-xs">
                      #{index + 1}
                    </span>
                    {suggestion.responses && suggestion.responses.length > 0 && (
                      <Chip 
                        color="success" 
                        size="sm" 
                        variant="flat"
                        className="font-medium rounded-full px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {suggestion.responses.length} réponse
                        {suggestion.responses.length > 1 ? "s" : ""}
                      </Chip>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatRelativeDate(suggestion.createdAt)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Avatar
                    name={
                      suggestion.userSuggestion
                        ? getInitials(suggestion.userSuggestion.nom, suggestion.userSuggestion.prenom)
                        : "U"
                    }
                    size="sm"
                    className="flex-shrink-0 bg-primary text-white font-semibold"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {suggestion.userSuggestion
                        ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                        : "Utilisateur inconnu"}
                    </p>
                    {suggestion.userSuggestion?.email && (
                      <p className="text-xs text-gray-500 break-all mt-0.5">
                        {suggestion.userSuggestion.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Suggestion</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                    {suggestion.suggestion}
                  </p>
                </div>

                {suggestion.responses && suggestion.responses.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Réponses ({suggestion.responses.length})
                    </p>
                    {suggestion.responses.map((response, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg text-xs border border-gray-100">
                        <p className="text-gray-600 mb-1.5 font-medium">
                          <strong>
                            {response.responder.nom} {response.responder.prenom}
                          </strong>
                          {" • "}
                          <span className="text-gray-400 font-normal">
                            {formatRelativeDate(response.createdAt)}
                          </span>
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="w-full font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                    onClick={() => openReplyModal(suggestion)}
                  >
                    Répondre
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}

        {/* Modal de réponse */}
        <Modal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setReply("");
            setSelectedSuggestion(null);
          }}
          placement="center"
          size="lg"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h3>Répondre à la suggestion</h3>
              {selectedSuggestion?.userSuggestion && (
                <p className="text-sm font-normal text-default-500">
                  {selectedSuggestion.userSuggestion.nom}{" "}
                  {selectedSuggestion.userSuggestion.prenom}
                </p>
              )}
            </ModalHeader>
            <ModalBody>
              {selectedSuggestion && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-default-500 mb-2">Suggestion originale :</p>
                    <p className="text-sm text-default-700 bg-default-50 p-3 rounded whitespace-pre-wrap">
                      {selectedSuggestion.suggestion}
                    </p>
                  </div>
                  <Textarea
                    label="Votre réponse"
                    placeholder="Tapez votre réponse ici..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    minRows={4}
                    variant="bordered"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  setReplyModalOpen(false);
                  setReply("");
                  setSelectedSuggestion(null);
                }}
                isDisabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                color="primary"
                variant="solid"
                onPress={handleSendReply}
                isLoading={isSubmitting}
                isDisabled={!reply.trim()}
                className="font-medium text-white transition-all hover:opacity-90"
              >
                Envoyer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  // Vue desktop (tableau)
  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <Table
          aria-label="Liste des Suggestions"
          isStriped
          removeWrapper
          classNames={tableClassNames}
        >
          <TableHeader>
            {columns.map((col) => (
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
                <p className="text-gray-500 text-sm font-medium">Aucune suggestion trouvée</p>
              </div>
            }
          >
            {suggestions.map((suggestion, index) => (
              <TableRow 
                key={suggestion.id}
                className="group hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <TableCell className="py-4 px-6">
                  <span className="text-gray-500 font-medium text-sm">#{index + 1}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={
                        suggestion.userSuggestion
                          ? getInitials(suggestion.userSuggestion.nom, suggestion.userSuggestion.prenom)
                          : "U"
                      }
                      size="sm"
                      className="flex-shrink-0 bg-primary text-white font-semibold"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-800 font-medium text-sm truncate">
                        {suggestion.userSuggestion
                          ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                          : "Utilisateur inconnu"}
                      </span>
                      {suggestion.userSuggestion?.email && (
                        <span className="text-xs text-gray-500 truncate">
                          {suggestion.userSuggestion.email}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <p className="text-gray-700 text-sm max-w-md line-clamp-2">
                    {suggestion.suggestion}
                  </p>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-600 text-sm">
                    {formatRelativeDate(suggestion.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  {suggestion.responses && suggestion.responses.length > 0 ? (
                    <Chip 
                      color="success" 
                      size="sm" 
                      variant="flat"
                      className="font-medium rounded-full px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {suggestion.responses.length} réponse
                      {suggestion.responses.length > 1 ? "s" : ""}
                    </Chip>
                  ) : (
                    <Chip 
                      color="default" 
                      size="sm" 
                      variant="flat"
                      className="font-medium rounded-full px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      Aucune réponse
                    </Chip>
                  )}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    onClick={() => openReplyModal(suggestion)}
                    className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                  >
                    Répondre
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de réponse */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setReply("");
          setSelectedSuggestion(null);
        }}
        placement="center"
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3>Répondre à la suggestion</h3>
            {selectedSuggestion?.userSuggestion && (
              <p className="text-sm font-normal text-gray-500">
                {selectedSuggestion.userSuggestion.nom}{" "}
                {selectedSuggestion.userSuggestion.prenom}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            {selectedSuggestion && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Suggestion originale :</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {selectedSuggestion.suggestion}
                  </p>
                </div>
                <Textarea
                  label="Votre réponse"
                  placeholder="Tapez votre réponse ici..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  minRows={4}
                  variant="bordered"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => {
                setReplyModalOpen(false);
                setReply("");
                setSelectedSuggestion(null);
              }}
              isDisabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              color="primary"
              variant="solid"
              onPress={handleSendReply}
              isLoading={isSubmitting}
              isDisabled={!reply.trim()}
              className="font-medium text-white transition-all hover:opacity-90"
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

