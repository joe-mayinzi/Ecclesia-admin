"use client";
import React, { useState } from "react";
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
} from "@nextui-org/react";
import { columns, users } from "./data";
import { statusOptions } from "../annonce/data";

export default function AdminSsrTableUI() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleOpen = () => {
    onOpen();
  };

  return (
    <div>
      <Table aria-label="Liste des Administrateurs" isStriped removeWrapper>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telephone}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Chip color="primary">{user.status}</Chip>
              </TableCell>
              <TableCell>
                <Button size="sm" color="primary" className="text-white">
                  Modifier
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  className="ml-2"
                  onClick={handleOpen}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Modal de confirmation de suppression */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader>Confirmation de Suppression</ModalHeader>
          <ModalBody>
            <p>
              Êtes-vous sûr de vouloir supprimer l'administrateur
              <strong> joemayinzi@gmail.com</strong> ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="text-white">
              Oui, Supprimer
            </Button>
            <Button color="danger">Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
