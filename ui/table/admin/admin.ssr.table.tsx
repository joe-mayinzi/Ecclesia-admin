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
          <Card className="w-full">
            <CardBody className="text-center py-12">
              <p className="text-default-500 text-lg">Aucun administrateur trouvé</p>
            </CardBody>
          </Card>
        ) : (
          admins.map((admin, index) => (
            <Card key={admin.id} className="w-full shadow-md hover:shadow-lg transition-shadow">
              <CardBody className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500 font-medium text-sm">#{index + 1}</span>
                    <Chip
                      color={admin.status === "Actif" ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {admin.status || "Actif"}
                    </Chip>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-default-500 mb-1">Email</p>
                    <p className="text-sm font-medium break-all">{admin.email}</p>
                  </div>
                  {admin.telephone && (
                    <div>
                      <p className="text-xs text-default-500 mb-1">Téléphone</p>
                      <p className="text-sm font-medium">{admin.telephone}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-divider">
                  <Button
                    size="sm"
                    color={admin.status === "Actif" ? "warning" : "success"}
                    variant="flat"
                    className="w-full"
                    onClick={() => toggleStatus(admin)}
                  >
                    {admin.status === "Actif" ? "Désactiver" : "Activer"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="flex-1"
                      onClick={() => openUpdateModal(admin)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="flex-1"
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
      <div className="rounded-lg border border-divider overflow-hidden">
        <Table
          aria-label="Liste des Administrateurs"
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
          <TableBody emptyContent="Aucun administrateur trouvé">
            {admins.map((admin, index) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <span className="text-default-600 font-medium">{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-default-700 break-all">{admin.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-default-700">{admin.telephone || "-"}</span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={admin.status === "Actif" ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {admin.status || "Actif"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      color={admin.status === "Actif" ? "warning" : "success"}
                      variant="flat"
                      onClick={() => toggleStatus(admin)}
                    >
                      {admin.status === "Actif" ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClick={() => openUpdateModal(admin)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onClick={() => openDeleteModal(admin)}
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
