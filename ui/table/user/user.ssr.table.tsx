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
  Avatar,
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

  // Fonction pour extraire les initiales (2 premières lettres)
  const getInitials = useCallback((name: string | null): string => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const firstLetter = parts[0]?.charAt(0)?.toUpperCase() || "";
    const secondLetter = parts[1]?.charAt(0)?.toUpperCase() || parts[0]?.charAt(1)?.toUpperCase() || "";
    return (firstLetter + secondLetter).slice(0, 2) || "U";
  }, []);

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
              startContent={<FaSearch className="text-gray-400" />}
              variant="bordered"
              classNames={{
                input: "text-sm",
                inputWrapper: "border-gray-200 hover:border-gray-300",
              }}
            />
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Liste des utilisateurs en cartes */}
        {filteredUsers.length === 0 ? (
          <Card className="w-full border border-gray-200 shadow-sm rounded-lg bg-white dark:bg-gray-800">
            <CardBody className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">
                {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
              </p>
              {search && (
                <p className="text-gray-400 text-xs mt-2">
                  Essayez avec d'autres mots-clés
                </p>
              )}
            </CardBody>
          </Card>
        ) : (
          filteredUsers.map((user, index) => (
            <Card
              key={user.id}
              className="w-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg bg-white dark:bg-gray-800"
            >
              <CardBody className="p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold text-xs">
                      #{index + 1}
                    </span>
                    <Chip
                      color={user.status === "Actif" ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                      className="font-medium rounded-full px-3 py-1"
                      classNames={{
                        base: user.status === "Actif" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      }}
                    >
                      {user.status}
                    </Chip>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{user.createdAt}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Avatar
                    name={getInitials(user.name)}
                    size="sm"
                    className="flex-shrink-0 bg-primary text-white font-semibold"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Nom & Prénom</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.name || "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {user.email && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-700 break-all">{user.email}</p>
                    </div>
                  )}
                  {user.telephone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Téléphone</p>
                      <p className="text-sm font-medium text-gray-700">{user.telephone}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    color={user.status === "Actif" ? "warning" : "success"}
                    variant="solid"
                    className="w-full font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
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
                    variant="solid"
                    className="w-full font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
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
            startContent={<FaSearch className="text-gray-400" />}
            variant="bordered"
            classNames={{
              input: "text-sm",
              inputWrapper: "border-gray-200 hover:border-gray-300",
            }}
          />
        </div>
        <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}{" "}
          {search && `trouvé${filteredUsers.length > 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <Table
          aria-label="Liste des Utilisateurs"
          isStriped
          removeWrapper
          classNames={tableClassNames}
        >
          <TableHeader>
            <TableColumn className="w-16 text-xs font-semibold uppercase tracking-wider text-gray-700">N°</TableColumn>
            <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">NOM & PRÉNOM</TableColumn>
            <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">EMAIL</TableColumn>
            <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">TÉLÉPHONE</TableColumn>
            <TableColumn className="w-32 text-xs font-semibold uppercase tracking-wider text-gray-700">STATUT</TableColumn>
            <TableColumn className="w-36 text-xs font-semibold uppercase tracking-wider text-gray-700">DATE CRÉATION</TableColumn>
            <TableColumn className="w-64 text-xs font-semibold uppercase tracking-wider text-gray-700">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 text-sm font-medium">
                  {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                </p>
              </div>
            }
          >
            {filteredUsers.map((user, index) => (
              <TableRow 
                key={user.id}
                className="group hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <TableCell className="py-4 px-6">
                  <span className="text-gray-500 font-medium text-sm">#{index + 1}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={getInitials(user.name)}
                      size="sm"
                      className="flex-shrink-0 bg-primary text-white font-semibold"
                    />
                    <span className="text-gray-800 font-medium text-sm">
                      {user.name || "Non renseigné"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-700 break-all text-sm">
                    {user.email || "Non renseigné"}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-600 text-sm">
                    {user.telephone || "Non renseigné"}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Chip
                    color={user.status === "Actif" ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    className="font-medium rounded-full px-3 py-1"
                    classNames={{
                      base: user.status === "Actif" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    }}
                  >
                    {user.status}
                  </Chip>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-500 text-sm">{user.createdAt}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      color={user.status === "Actif" ? "warning" : "success"}
                      variant="solid"
                      onPress={() => toggleStatus(user)}
                      isLoading={isToggling === user.id}
                      className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
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
                      variant="solid"
                      onPress={() => openMailModal(user)}
                      className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
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
