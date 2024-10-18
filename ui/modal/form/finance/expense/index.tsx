"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { ManagementBudget, ManagementIncome } from "@/app/lib/config/interface";
import { createManagementExpensesApi, createManagementIncomeApi, findManagementBudgetByEgliseIdApi, updateManagementExpenseApi, updateManagementIncomeApi } from "@/app/lib/actions/management/finance/finance.req";
import Alert from "@/ui/modal/alert";
import { Session } from "next-auth";

type CreateIncomeProps = {
  handleFindExpense: () => Promise<void>,
  income?: ManagementIncome
  session: Session
}

export default function CreateExpenseFormModal({ session, handleFindExpense }: CreateIncomeProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [budgetId, setBudgetId] = useState<number>(0);
  const [motif, setMethod] = useState<string>("");
  const [amount, setAmount] = useState<number>(0)
  const [budgets, setbudgets] = useState<ManagementBudget[]>([])

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  let formatter = useDateFormatter({ dateStyle: "full" });

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(session.user.eglise.id_eglise);
      if (find) {
        const r :ManagementBudget[] = [];
        find.map((item: ManagementBudget) => {
          if (item.income && item.income.length > 0) {
             r.push(item)
          }
        });
        console.log(r);
        setbudgets(r);
      }
    }
  }


  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetId,
      motif,
      amount
    }
    console.log(dto);
    const create = await createManagementExpensesApi(dto);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindExpense();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = '';
        create.message.map((item: string) => message += `${item} \n`);
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };

  useEffect(() => {
    handleFindBudget()
  }, []);


  return (
    <>
      <Button onClick={onOpen} size="sm" variant="flat">
        Effectuer une dépense
      </Button>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Effectuer une dépense
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Montant de la dépense"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant de la dépense"
                />
                <Textarea
                  size="md"
                  label="Motif de la dépense"
                  variant="bordered"
                  value={motif}
                  onChange={(e) => { setMethod(e.target.value) }}
                  placeholder="Motif de la dépense"
                />
                <Select
                  fullWidth
                  required
                  value={budgetId}
                  label="Ligne budgetaire"
                  className="mb-2"
                  placeholder="Assicier la recette à une ligne budgetaire"
                  aria-label="1"
                  onChange={(e) => {
                    setBudgetId(parseInt(e.target.value));
                  }}
                >
                  {budgets.map((cat, idx) => (
                    <SelectItem key={cat.id} textValue={cat.budgetLine} value={cat.id}>
                      {cat.budgetLine} - {moment(cat.period).format("MM-YYYY")}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
    </>
  );
}

export function UpdateExpenseFormModal({ handleFindExpense, expense, isOpen, onClose, session }: any) {

  const [pending, setPending] = useState<boolean>(false);

  const [motif, setMethod] = useState<string>(expense.motif);
  const [amount, setAmount] = useState<number>(expense.amount)
  const [budgetId, setBudgetId] = useState<number>(expense.budget ? expense.budget.id : 0)

  const [budgets, setbudgets] = useState<ManagementBudget[]>([])


  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(session.user.eglise.id_eglise);
      if (find) {
        const r: ManagementBudget[] = [];
        find.map((item: ManagementBudget) => {
          if (item.income && item.income.length > 0) {
            r.push(item)
          }
        });
        console.log(r);
        setbudgets(r);
      }
    }
  }

  useEffect(() => {
    handleFindBudget();
  }, []);

  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetId,
      motif,
      amount
    }
    console.log(dto);
    console.log(dto);

    const create = await updateManagementExpenseApi(dto, expense.id);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindExpense();
      onClose();
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      if (typeof create.message === "object") {
        let message = '';
        create.message.map((item: string) => message += `${item} \n`);
        setAlertMsg(message);
      } else {
        setAlertMsg(create.message);
      }
    }
  };


  return (
    <>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier la dépense
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Montant de la dépense"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant de la dépense"
                />
                <Textarea
                  size="md"
                  label="Motif de la dépense"
                  variant="bordered"
                  value={motif}
                  onChange={(e) => { setMethod(e.target.value) }}
                  placeholder="Motif de la dépense"
                />
                <Select
                  fullWidth
                  required
                  value={budgetId}
                  label="Ligne budgetaire"
                  className="mb-2"
                  placeholder="Assicier la recette à une ligne budgetaire"
                  aria-label="1"
                  onChange={(e) => {
                    setBudgetId(parseInt(e.target.value));
                  }}
                >
                  {budgets.map((cat, idx) => {
                    return (

                      <SelectItem key={cat.id} textValue={cat.budgetLine} value={cat.id}>
                        {cat.budgetLine} - {moment(cat.period).format("MM-YYYY")}
                      </SelectItem>

                    )
                  })}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button className="text-white" color="primary" isLoading={pending} onPress={handlAction}>
                  Modifier
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
    </>
  );
}



