"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Input,
  Card,
  CardBody,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { toggleUserStatusApi } from "@/app/lib/actions/admin/admin.req";
import MailModal from "@/ui/modal/form/mail";
import { FaSearch, FaEnvelope, FaUserLock, FaUserCheck } from "react-icons/fa";

// Types
interface User {
  id: number | string;
  name: string | null;
  email: string | null;
  telephone: string | null;
  status: string;
  createdAt: string;
  rawData: unknown;
}

interface Props {
  data: User[];
}

export default function UsersSsrTableUI({ data }: Props) {
  const [users, setUsers] = useState<User[]>(data);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isToggling, setIsToggling] = useState<number | string | null>(null);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filtrage amélioré : recherche par nom, email ou téléphone
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const searchLower = search.toLowerCase().trim();
    return users.filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchLower) ?? false) ||
        (user.email?.toLowerCase().includes(searchLower) ?? false) ||
        (user.telephone
          ?.replace(/\s/g, "")
          .includes(searchLower.replace(/\s/g, "")) ?? false)
    );
  }, [search, users]);

  // Toggle status avec gestion d'erreur améliorée
  const toggleStatus = useCallback(
    async (user: User) => {
      const newStatus = user.status === "Actif" ? "Bloqué" : "Actif";
      setIsToggling(user.id);

      try {
        await toggleUserStatusApi(user.id, newStatus);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
        toast.success(
          `Statut de ${user.name || user.email || "l'utilisateur"} mis à jour : ${newStatus}`
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du statut";
        console.error("Erreur lors du changement de statut:", error);
        toast.error(errorMessage);
      } finally {
        setIsToggling(null);
      }
    },
    []
  );

  const openMailModal = useCallback(
    (user: User) => {
      if (!user.email) {
        toast.error("L'email de l'utilisateur n'est pas disponible");
        return;
      }
      setSelectedUser(user);
      setModalOpen(true);
    },
    []
  );

  const closeMailModal = useCallback(() => {
    setModalOpen(false);
    setSelectedUser(null);
  }, []);

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
        "text-sm",
      ],
      td: [
        "py-4",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  // Vue mobile (cartes)
  if (isMobile) {
    return (
      <div className="w-full space-y-4 pb-4">
        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
          <div className="flex-1 max-w-full sm:max-w-md">
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="md"
              startContent={<FaSearch className="text-default-400" />}
              variant="bordered"
              classNames={{
                input: "text-sm",
                inputWrapper: "border-default-200",
              }}
            />
          </div>
          <div className="text-sm text-default-500 font-medium">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Liste des utilisateurs en cartes */}
        {filteredUsers.length === 0 ? (
          <Card className="w-full">
            <CardBody className="text-center py-12">
              <p className="text-default-500 text-lg">
                {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
              </p>
              {search && (
                <p className="text-default-400 text-sm mt-2">
                  Essayez avec d'autres mots-clés
                </p>
              )}
            </CardBody>
          </Card>
        ) : (
          filteredUsers.map((user, index) => (
            <Card
              key={user.id}
              className="w-full shadow-md hover:shadow-lg transition-shadow"
            >
              <CardBody className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500 font-medium text-sm">
                      #{index + 1}
                    </span>
                    <Chip
                      color={user.status === "Actif" ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {user.status}
                    </Chip>
                  </div>
                  <span className="text-xs text-default-400">{user.createdAt}</span>
                </div>

                <div>
                  <p className="text-sm text-default-500 mb-1">Nom & Prénom</p>
                  <p className="text-base font-semibold text-default-700">
                    {user.name || "Non renseigné"}
                  </p>
                </div>

                <div className="space-y-2">
                  {user.email && (
                    <div>
                      <p className="text-xs text-default-500 mb-1">Email</p>
                      <p className="text-sm font-medium break-all">{user.email}</p>
                    </div>
                  )}
                  {user.telephone && (
                    <div>
                      <p className="text-xs text-default-500 mb-1">Téléphone</p>
                      <p className="text-sm font-medium">{user.telephone}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-divider">
                  <Button
                    size="sm"
                    color={user.status === "Actif" ? "warning" : "success"}
                    variant="flat"
                    className="w-full"
                    onPress={() => toggleStatus(user)}
                    isLoading={isToggling === user.id}
                    startContent={
                      user.status === "Actif" ? (
                        <FaUserLock className="text-xs" />
                      ) : (
                        <FaUserCheck className="text-xs" />
                      )
                    }
                  >
                    {user.status === "Actif" ? "Bloquer" : "Débloquer"}
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="w-full"
                    onPress={() => openMailModal(user)}
                    startContent={<FaEnvelope className="text-xs" />}
                  >
                    Envoyer un mail
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}

        {/* Modal mail */}
        {selectedUser && (
          <MailModal
            user={selectedUser}
            isOpen={modalOpen}
            onClose={closeMailModal}
          />
        )}
      </div>
    );
  }

  // Vue desktop (tableau)
  return (
    <div className="w-full">
      {/* En-tête avec recherche et statistiques */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
        <div className="flex-1 max-w-full sm:max-w-md">
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="md"
            startContent={<FaSearch className="text-default-400" />}
            variant="bordered"
            classNames={{
              input: "text-sm",
              inputWrapper: "border-default-200",
            }}
          />
        </div>
        <div className="text-sm text-default-500 font-medium whitespace-nowrap">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}{" "}
          {search && `trouvé${filteredUsers.length > 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-divider overflow-hidden">
        <Table
          aria-label="Liste des Utilisateurs"
          isStriped
          removeWrapper
          classNames={tableClassNames}
        >
          <TableHeader>
            <TableColumn className="w-16">N°</TableColumn>
            <TableColumn>NOM & PRÉNOM</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TÉLÉPHONE</TableColumn>
            <TableColumn className="w-32">STATUT</TableColumn>
            <TableColumn className="w-36">DATE CRÉATION</TableColumn>
            <TableColumn className="w-64">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Aucun utilisateur trouvé">
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>
                  <span className="text-default-600 font-medium">{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-default-700 font-medium">
                    {user.name || "Non renseigné"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-default-700 break-all text-sm">
                    {user.email || "Non renseigné"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-default-700 text-sm">
                    {user.telephone || "Non renseigné"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={user.status === "Actif" ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {user.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-default-500 text-sm">{user.createdAt}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      color={user.status === "Actif" ? "warning" : "success"}
                      variant="flat"
                      onPress={() => toggleStatus(user)}
                      isLoading={isToggling === user.id}
                      startContent={
                        user.status === "Actif" ? (
                          <FaUserLock className="text-xs" />
                        ) : (
                          <FaUserCheck className="text-xs" />
                        )
                      }
                    >
                      {user.status === "Actif" ? "Bloquer" : "Débloquer"}
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => openMailModal(user)}
                      startContent={<FaEnvelope className="text-xs" />}
                    >
                      Mail
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal mail */}
      {selectedUser && (
        <MailModal
          user={selectedUser}
          isOpen={modalOpen}
          onClose={closeMailModal}
        />
      )}
    </div>
  );
}
