"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { formatRelativeDate } from "@/utils/utils";
import { respondToUserSuggestion } from "@/app/lib/actions/suggestions/suggestions.req";

type CardSuggestionsUIProps = {
  id: number;
  userSuggestionId: number;
  user: string;
  content: string;
  date: string;
  status: "lu" | "non lu";
  responses: {
    message: string;
    createdAt: string;
    responder: {
      nom: string;
      prenom: string;
    };
  }[] | null;
};


export function CardSuggestionsUI({id, userSuggestionId, user, content, date, responses }: CardSuggestionsUIProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reply, setReply] = useState("");
  const [localResponses, setLocalResponses] = useState(responses ?? []);
  const validResponses = responses ?? [];

  console.log(responses);
  

  const handleSendReply = async (onClose: () => void) => {
    if (!reply.trim()) return;

    try {
      await respondToUserSuggestion(id, {
        message: reply,
        suggestionId: userSuggestionId,
      });
      
      setReply("");
      onClose();
    } catch (error) {
      console.log("Erreur lors de l'envoi de la réponse");
      console.log(userSuggestionId);
      
      console.error("Erreur :", error);
    }
  };

  return (
    <>
      <Card className="p-4 transition-shadow hover:shadow-md">
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar name={user} size="sm" className="mt-1" />

          {/* Contenu */}
          <div className="flex-1">
            <div className="bg-gray-100 rounded-xl py-2 px-4 inline-block">
              <div className="text-sm font-semibold">{user}</div>
              <div className="text-sm text-gray-800 mt-1">
                {content || (
                  <span className="italic text-gray-400">
                    Aucune suggestion saisie.
                  </span>
                )}
              </div>
              {validResponses.length > 0 && (
              <div className="mt-3 space-y-3">
                {validResponses.map((res, index) => (
                  <div key={index} className="flex gap-3 ml-12">
                    {/* <Avatar name={`${res.responder.nom} ${res.responder.prenom}`} size="sm" className="mt-1" /> */}

                    <div className="flex-1">
                      <div className=" px-4 inline-block mt-2">
                        <div className="text-sm font-semibold text-blue-700">
                          {/* {res.responder.nom} {res.responder.prenom} */}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{res.message}</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 pl-2">
                        {formatRelativeDate(res.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-4 pl-2">
              <span>{formatRelativeDate(date)}</span>
              <Button
                variant="light"
                size="sm"
                className="text-blue-600 text-xs font-medium p-0 h-auto"
                onPress={onOpen}
              >
                Répondre
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de réponse */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-bold">
                Reponse de l'admin
              </ModalHeader>
              <ModalBody>
                <p>
                  Nous vous remercions vivement de prendre le temps de nous faire part de vos suggestions et commentaires.
                  Votre contribution est essentielle au maintien de la sécurité et du caractère ludique d&apos;EcclesiaBook.
                </p>
                <Textarea
                  label="Votre suggestion"
                  placeholder="Votre réponse..."
                  variant="bordered"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="light">
                  Annuler
                </Button>
                <Button
                  color="primary"
                  className="text-white"
                  onPress={() => handleSendReply(onClose)} // 👈 Appelle ta fonction

                >
                  Envoyer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


