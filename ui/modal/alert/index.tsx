"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";

import { AlertPros } from "@/types";

export default function Alert({
  isOpen,
  onClose,
  alertBody,
  alertTitle,
}: AlertPros) {
  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {alertTitle}
            </ModalHeader>
            <ModalBody>{alertBody}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
