"use client";

import React, { useState } from "react";
import { VerticalDotsIcon } from "@/ui/icons";
import Alert from "@/ui/modal/alert";
import DialogAction from "@/ui/modal/dialog";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ManagementExpenses } from "@/app/lib/config/interface";
import { deleteManagementExpensesApi, deleteManagementIncomeApi, updateIncomeUnLinkBudgetApi } from "@/app/lib/actions/management/finance/finance.req";
import { Session } from "next-auth";
import { UpdateExpenseFormModal } from "@/ui/modal/form/finance/expense";

export const ActionExpense = ({ session, expense, handleFindExpense }: {
  expense: ManagementExpenses
  handleFindExpense: () => Promise<void>,
  session: Session
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleDeleteManagementIncome = async () => {
    const update = await deleteManagementExpensesApi(expense.id);
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
      handleFindExpense();
      setOpenAlert(true);
      setAlertTitle("Suppresion réussi");
      setAlertMsg("La suppresion de cette depense s'est effectuer avec succés.");
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
        <DropdownItem onClick={onOpen}>Modifier</DropdownItem>
        <DropdownItem onClick={() => { setOnBloqued(true) }}>Supprimer</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    <DialogAction
      isOpen={onBloqued}
      onOpen={() => { setOnBloqued(true) }}
      onClose={() => { setOnBloqued(false) }}
      dialogBody={<p>Étes-vous sure de vouloir supprimer cette depense?</p>}
      dialogTitle={"Supprimer la depense"}
      action={handleDeleteManagementIncome}
    />
    <UpdateExpenseFormModal handleFindExpense={handleFindExpense} onClose={onClose} isOpen={isOpen} expense={expense} session={session} />
  </div>
}