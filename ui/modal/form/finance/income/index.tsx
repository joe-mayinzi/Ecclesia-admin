"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea, DatePicker, Link, Switch, DropdownItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Select, SelectItem } from "@nextui-org/react";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { capitalize } from "@/app/lib/config/func";
import { ManagementBudget, ManagementIncome } from "@/app/lib/config/interface";
import { createManagementBudgetApi, createManagementIncomeApi, findManagementBudgetByEgliseIdApi, updateManagementBudgetApi, updateManagementIncomeApi } from "@/app/lib/actions/management/finance/finance.req";
import Alert from "@/ui/modal/alert";

type CreateIncomeProps = {
  handleFindIncome: () => Promise<void>,
  income?: ManagementIncome
}

export default function CreateIncomeFormModal({ handleFindIncome }: CreateIncomeProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [source, setSource] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [amount, setAmount] = useState<number>(0)

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  let formatter = useDateFormatter({ dateStyle: "full" });


  const handlAction = async () => {
    setPending(true);
    const dto = {
      source,
      method,
      amount
    }
    console.log(dto);

    const create = await createManagementIncomeApi(dto);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindIncome();
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
      <Button onClick={onOpen} size="sm" variant="flat">
        Créer une récette
      </Button>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer une récette
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Source de la recette"
                  variant="bordered"
                  value={source}
                  onChange={(e) => { setSource(e.target.value) }}
                  placeholder="Source de la recette"
                  isInvalid={source === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <p className="text-sm text-default-500">ex: Dîme, Offrand, Don, Événement</p>
                <Input
                  size="md"
                  label="Method d'acquisition"
                  variant="bordered"
                  value={method}
                  onChange={(e) => { setMethod(e.target.value) }}
                  placeholder="Source de la recette"
                  isInvalid={method === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <p className="text-sm text-default-500">ex: Bank, Mobil Money, Cash</p>
                <Input
                  size="md"
                  label=" Montant"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant"
                />
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

export function UpdateIncomeFormModal({ handleFindIncome, income, isOpen, onClose, session }: any) {

  const [pending, setPending] = useState<boolean>(false);

  const [source, setSource] = useState<string>(income.source);
  const [method, setMethod] = useState<string>(income.method);
  const [amount, setAmount] = useState<number>(income.amount)
  const [budgetId, setbudget] = useState<string>(income.budget ? income.budget.id.toString(): 0)

  const [budgets, setbudgets] = useState<ManagementBudget[]>([])


  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(session.user.eglise.id_eglise);
      if (find) {
        setbudgets(find);
      }
    }
  }

  useEffect(() => {
    handleFindBudget();
  }, []);

  const handlAction = async () => {
    setPending(true);
    const dto = {
      source,
      method,
      amount,
      budgetId: parseInt(budgetId)
    }
    console.log(dto);

    const create = await updateManagementIncomeApi(dto, income.id);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindIncome();
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
                Modifier la recette
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Source de la recette"
                  variant="bordered"
                  value={source}
                  onChange={(e) => { setSource(e.target.value) }}
                  placeholder="Source de la recette"
                  isInvalid={source === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <p className="text-sm text-default-500">ex: Dîme, Offrand, Don, Événement</p>
                <Input
                  size="md"
                  label="Method d'acquisition"
                  variant="bordered"
                  value={method}
                  onChange={(e) => { setMethod(e.target.value) }}
                  placeholder="Source de la recette"
                  isInvalid={method === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <p className="text-sm text-default-500">ex: Bank, Mobil Money, Cash</p>
                <Input
                  size="md"
                  label="Montant"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant"
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
                    setbudget(e.target.value);
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



