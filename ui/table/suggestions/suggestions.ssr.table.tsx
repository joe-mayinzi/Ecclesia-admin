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
        suggestionId: selectedSuggestion.id,
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

  // Styles pour la table
  const tableClassNames = useMemo(
    () => ({
      wrapper: "min-h-[222px] shadow-sm",
      th: [
        "bg-default-100",
        "text-default-700",
        "font-semibold",
        "border-b",
        "border-divider",
        "py-4",
      ],
      td: [
        "py-4",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
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
          <Card className="w-full">
            <CardBody className="text-center py-12">
              <p className="text-default-500 text-lg">Aucune suggestion trouvée</p>
            </CardBody>
          </Card>
        ) : (
          suggestions.map((suggestion, index) => (
            <Card
              key={suggestion.id}
              className="w-full shadow-md hover:shadow-lg transition-shadow"
            >
              <CardBody className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500 font-medium text-sm">
                      #{index + 1}
                    </span>
                    {suggestion.responses && suggestion.responses.length > 0 && (
                      <Chip color="success" size="sm" variant="flat">
                        {suggestion.responses.length} réponse
                        {suggestion.responses.length > 1 ? "s" : ""}
                      </Chip>
                    )}
                  </div>
                  <span className="text-xs text-default-400">
                    {formatRelativeDate(suggestion.createdAt)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Avatar
                    src={suggestion.userSuggestion?.profil}
                    name={
                      suggestion.userSuggestion
                        ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                        : "U"
                    }
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-default-700">
                      {suggestion.userSuggestion
                        ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                        : "Utilisateur inconnu"}
                    </p>
                    {suggestion.userSuggestion?.email && (
                      <p className="text-xs text-default-500 break-all">
                        {suggestion.userSuggestion.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-default-500 mb-1">Suggestion</p>
                  <p className="text-sm text-default-700 whitespace-pre-wrap break-words">
                    {suggestion.suggestion}
                  </p>
                </div>

                {suggestion.responses && suggestion.responses.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-divider">
                    <p className="text-xs text-default-500 font-semibold">
                      Réponses ({suggestion.responses.length})
                    </p>
                    {suggestion.responses.map((response, idx) => (
                      <div key={idx} className="bg-default-50 p-2 rounded text-xs">
                        <p className="text-default-600 mb-1">
                          <strong>
                            {response.responder.nom} {response.responder.prenom}
                          </strong>
                          {" • "}
                          <span className="text-default-400">
                            {formatRelativeDate(response.createdAt)}
                          </span>
                        </p>
                        <p className="text-default-700 whitespace-pre-wrap">
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-divider">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="w-full"
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
                onPress={handleSendReply}
                isLoading={isSubmitting}
                isDisabled={!reply.trim()}
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
      <div className="rounded-lg border border-divider overflow-hidden">
        <Table
          aria-label="Liste des Suggestions"
          isStriped
          removeWrapper
          classNames={tableClassNames}
        >
          <TableHeader>
            {columns.map((col) => (
              <TableColumn key={col.uid} className="text-sm">
                {col.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="Aucune suggestion trouvée">
            {suggestions.map((suggestion, index) => (
              <TableRow key={suggestion.id}>
                <TableCell>
                  <span className="text-default-600 font-medium">{index + 1}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={suggestion.userSuggestion?.profil}
                      name={
                        suggestion.userSuggestion
                          ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                          : "U"
                      }
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-default-700 font-medium text-sm">
                        {suggestion.userSuggestion
                          ? `${suggestion.userSuggestion.nom} ${suggestion.userSuggestion.prenom}`
                          : "Utilisateur inconnu"}
                      </span>
                      {suggestion.userSuggestion?.email && (
                        <span className="text-xs text-default-500">
                          {suggestion.userSuggestion.email}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-default-700 text-sm max-w-md line-clamp-2">
                    {suggestion.suggestion}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-default-600 text-sm">
                    {formatRelativeDate(suggestion.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  {suggestion.responses && suggestion.responses.length > 0 ? (
                    <Chip color="success" size="sm" variant="flat">
                      {suggestion.responses.length} réponse
                      {suggestion.responses.length > 1 ? "s" : ""}
                    </Chip>
                  ) : (
                    <Chip color="default" size="sm" variant="flat">
                      Aucune réponse
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onClick={() => openReplyModal(suggestion)}
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
              onPress={handleSendReply}
              isLoading={isSubmitting}
              isDisabled={!reply.trim()}
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

