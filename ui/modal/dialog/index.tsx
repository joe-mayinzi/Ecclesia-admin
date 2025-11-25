"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

export default function DialogAction({
  isOpen,
  onClose,
  dialogBody,
  dialogTitle,
  action,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  dialogBody: React.ReactNode;
  dialogTitle: string;
  action: () => Promise<void>;
}) {
  const [pending, setPending] = useState<boolean>(false);

  const handlAction = async () => {
    setPending(true);
    await action();
    setPending(false);
    onClose();
  };

  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {dialogTitle}
            </ModalHeader>
            <ModalBody>{dialogBody}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
                Confirmer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}


