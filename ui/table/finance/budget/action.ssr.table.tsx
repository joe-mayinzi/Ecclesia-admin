"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { StatusAcounteEnum } from "@/app/lib/config/enum";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { UpdateEventFormModal } from "@/ui/modal/form/event";
import { ManagementBudget } from "@/app/lib/config/interface";
import { SubPrevisionFormModal, UpdateBudgetFormModal } from "@/ui/modal/form/finance/budget";
import { deleteManagementBudgetApi } from "@/app/lib/actions/management/finance/finance.req";

export const ActionBudget = ({ budget, handleFindBudget }: {
  budget: ManagementBudget
  handleFindBudget: () => Promise<void>
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleDeleteManagementBudget = async () => {
    const update = await deleteManagementBudgetApi(budget.id);
    if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("message")) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof update.message === "object") {
        let message = '';
        update.message.map((item: string) => message += `${item} \n`)
        setAlertMsg(message);
      } else {
        setAlertMsg(update.message);
      }
    } else {
      handleFindBudget();
      setOpenModal(false);
      setOpenAlert(true);
      setAlertTitle("Suppresion réussi");
      setAlertMsg("La suppresion de cette ligne budgetaire se effectuer avec succés.");
    }
  }

  return <div className="relative flex justify-end items-center gap-2">
    <Dropdown className="bg-background border-1 border-default-200">
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <VerticalDotsIcon className="text-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => { setOpenModal(true) }}>Détail</DropdownItem>
        <DropdownItem onClick={onOpen}>Modifier</DropdownItem>
        <DropdownItem onClick={() => { setOnBloqued(true) }}>Supprimer</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    <DialogAction
      isOpen={onBloqued}
      onOpen={() => { setOnBloqued(true) }}
      onClose={() => { setOnBloqued(false) }}
      dialogBody={<p>Étes-vous sure de vouloir supprimer cette ligne budgetaire?</p>}
      dialogTitle={"supprimer la ligne budgetaire"}
      action={handleDeleteManagementBudget}
    />
    <UpdateBudgetFormModal handleFindEvent={handleFindBudget} onClose={onClose} isOpen={isOpen} budget={budget} />
    <SubPrevisionFormModal isOpen={openModal} onClose={() => { setOpenModal(false) }} budget={budget} />
  </div>
}