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
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { columns } from "./data";
import { deleteAdminApi, toggleAdminStatusApi } from "@/app/lib/actions/admin/admin.req";
import UpdateAdminDataForm from "@/ui/formUdpateUser";

type Props = { data: any[] };

type Admin = {
  id: string | number;
  email: string;
  telephone: string;
  status: string;
  nom?: string;
  prenom?: string;
  deletedAt?: string | null;
};

export default function AdminSsrTableUI({ data }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [admins, setAdmins] = useState<Admin[]>(
    data.filter((a: Admin) => !a.deletedAt)
  );
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
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

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // Gestion de la suppression
  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setIsDeleting(true);
    try {
      const adminId = typeof selectedAdmin.id === "string" 
        ? parseInt(selectedAdmin.id, 10) 
        : selectedAdmin.id;
      await deleteAdminApi(adminId);
      toast.success(`Administrateur ${selectedAdmin.nom || selectedAdmin.email} supprimé !`);
      setAdmins((prev) => prev.filter((a) => a.id !== selectedAdmin.id));
      onClose();
      setSelectedAdmin(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  // Gestion de la mise à jour
  const handleUpdateSuccess = (updatedAdmin: Admin | Partial<Admin>) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id === updatedAdmin.id) {
          // Preserve status and other fields if not provided in update
          return {
            ...a,
            ...updatedAdmin,
            status: updatedAdmin.status ?? a.status,
          } as Admin;
        }
        return a;
      })
    );
    setIsUpdateOpen(false);
    setSelectedAdmin(null);
    toast.success("Administrateur mis à jour !");
  };

  // Toggle du statut
  const toggleStatus = async (admin: Admin) => {
    try {
      const newStatus = admin.status === "Actif" ? "Inactif" : "Actif";
      const adminId = typeof admin.id === "string" 
        ? parseInt(admin.id, 10) 
        : admin.id;
      await toggleAdminStatusApi(adminId, newStatus);
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
      );
      toast.success(`Statut de ${admin.nom || admin.email} mis à jour : ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  // Ouvrir modal de suppression
  const openDeleteModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    onOpen();
  };

  // Ouvrir modal de modification
  const openUpdateModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsUpdateOpen(true);
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

  // Loader avec les couleurs du logo (rouge et bleu foncé)
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {/* Cercle rouge (côté gauche du logo) */}
            <div className="absolute inset-0 border-4 border-transparent border-l-[#DC2626] border-b-[#DC2626] rounded-full animate-spin"></div>
            {/* Cercle bleu foncé (côté droit du logo) */}
            <div className="absolute inset-0 border-4 border-transparent border-r-[#1E3A8A] border-t-[#1E3A8A] rounded-full animate-spin" style={{ animationDuration: "1.2s" }}></div>
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
        {admins.length === 0 ? (
          <Card className="w-full border border-gray-200 shadow-sm rounded-lg bg-white dark:bg-gray-800">
            <CardBody className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">Aucun administrateur trouvé</p>
            </CardBody>
          </Card>
        ) : (
          admins.map((admin, index) => (
            <Card key={admin.id} className="w-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
              <CardBody className="p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold text-xs">#{index + 1}</span>
                    <Chip
                      color={admin.status === "Actif" ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                      className="font-medium rounded-full px-3 py-1"
                      classNames={{
                        base: admin.status === "Actif" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      }}
                    >
                      {admin.status || "Actif"}
                    </Chip>
                  </div>
                </div>

                <div className="space-y-3">
                  {(admin.prenom || admin.nom) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Nom</p>
                      <p className="text-sm font-medium text-gray-800">
                        {[admin.prenom, admin.nom].filter(Boolean).join(" ")}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-gray-800 break-all">{admin.email}</p>
                  </div>
                  {admin.telephone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Téléphone</p>
                      <p className="text-sm font-medium text-gray-700">{admin.telephone}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    color={admin.status === "Actif" ? "warning" : "success"}
                    variant="solid"
                    className="w-full font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                    onClick={() => toggleStatus(admin)}
                  >
                    {admin.status === "Actif" ? "Désactiver" : "Activer"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      className="flex-1 font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                      onClick={() => openUpdateModal(admin)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="flex-1 font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                      onClick={() => openDeleteModal(admin)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}

        {/* Modal de suppression */}
        <Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Confirmation de suppression
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">
                Êtes-vous sûr de vouloir supprimer{" "}
                <strong>{selectedAdmin?.nom || selectedAdmin?.email}</strong> ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                isDisabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                color="danger"
                onPress={handleDelete}
                isLoading={isDeleting}
              >
                Supprimer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de mise à jour */}
        <UpdateAdminDataForm
          isOpen={isUpdateOpen}
          onClose={() => {
            setIsUpdateOpen(false);
            setSelectedAdmin(null);
          }}
          adminData={selectedAdmin}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    );
  }

  // Vue desktop (tableau)
  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <Table
          aria-label="Liste des Administrateurs"
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
                <p className="text-gray-500 text-sm font-medium">Aucun administrateur trouvé</p>
              </div>
            }
          >
            {admins.map((admin, index) => (
              <TableRow 
                key={admin.id}
                className="group hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <TableCell className="py-4 px-6">
                  <span className="text-gray-500 font-medium text-sm">#{index + 1}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-800 font-medium text-sm">
                    {[admin.prenom, admin.nom].filter(Boolean).join(" ") || "-"}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-800 break-all font-medium text-sm">{admin.email}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-gray-600 text-sm">{admin.telephone || "-"}</span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Chip
                    color={admin.status === "Actif" ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    className="font-medium rounded-full px-3 py-1"
                    classNames={{
                      base: admin.status === "Actif" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    }}
                  >
                    {admin.status || "Actif"}
                  </Chip>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      color={admin.status === "Actif" ? "warning" : "success"}
                      variant="solid"
                      onClick={() => toggleStatus(admin)}
                      className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                    >
                      {admin.status === "Actif" ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      onClick={() => openUpdateModal(admin)}
                      className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="solid"
                      onClick={() => openDeleteModal(admin)}
                      className="font-medium text-xs h-8 px-4 text-white transition-all hover:opacity-90"
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de suppression */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirmation de suppression
          </ModalHeader>
          <ModalBody>
            <p className="text-default-600">
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{selectedAdmin?.nom || selectedAdmin?.email}</strong> ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onClose}
              isDisabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de mise à jour */}
      <UpdateAdminDataForm
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedAdmin(null);
        }}
        adminData={selectedAdmin}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
