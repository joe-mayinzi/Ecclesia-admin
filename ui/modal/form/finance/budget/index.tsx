"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea, DatePicker, Link, Switch, DropdownItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { capitalize } from "@/app/lib/config/func";
import { ManagementBudget } from "@/app/lib/config/interface";
import { createManagementBudgetApi, updateManagementBudgetApi } from "@/app/lib/actions/management/finance/finance.req";
import Alert from "@/ui/modal/alert";

type CreateBudgetProps = {
  handleFindBudget: () => Promise<void>,
  event?: ManagementBudget
}

export default function CreateBudgetFormModal({ handleFindBudget }: CreateBudgetProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [budgetLine, setBudgetLine] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period, setPeriod] = React.useState<DateValue>(parseDate(moment().format("YYYY-MM-DD")));
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
      budgetLine,
      description,
      period: new Date(period.toString()),
      amount
    }
    console.log(dto);

    const create = await createManagementBudgetApi(dto);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindBudget();
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
        Créer une ligne budgetaire
      </Button>
      <Modal backdrop={"opaque"} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Créer une ligne budgetaire
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Ligne budgetaire"
                  variant="bordered"
                  value={budgetLine}
                  onChange={(e) => { setBudgetLine(e.target.value) }}
                  placeholder="Ligne budgetaire"
                  isInvalid={budgetLine === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <Textarea
                  size="md"
                  label="Description de la ligne budgetaire"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de la ligne budgetaire"
                  isInvalid={description === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <div className="w-full flex flex-col gap-y-2">
                  <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={period}
                    onChange={setPeriod}
                  />
                  <p className="text-default-500 text-sm">
                    Période du {moment(period.toString()).format("MMMM")} {moment(period.toString()).format("YYYY")}
                  </p>
                </div>

                <Input
                  size="md"
                  label="Montant"
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

export function UpdateBudgetFormModal({ handleFindEvent, budget, isOpen, onClose }: any) {

  const [pending, setPending] = useState<boolean>(false);

  const [budgetLine, setBudgetLine] = useState<string>(budget.budgetLine);
  const [description, setDescription] = useState<string>(budget.description);
  const [period, setPeriod] = React.useState<DateValue>(parseDate(moment(budget.period).format("YYYY-MM-DD")));
  const [amount, setAmount] = useState<number>(budget.amount)


  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");


  const handlAction = async () => {
    setPending(true);
    const dto = {
      budgetLine,
      description,
      period: new Date(period.toString()),
      amount
    }
    console.log(dto);

    const create = await updateManagementBudgetApi(dto, budget.id);
    setPending(false);

    if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
      handleFindEvent();
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
                Modifier la ligne budgetaire
              </ModalHeader>
              <ModalBody>
                <Input
                  size="md"
                  label="Ligne budgetaire"
                  variant="bordered"
                  value={budgetLine}
                  onChange={(e) => { setBudgetLine(e.target.value) }}
                  placeholder="Ligne budgetaire"
                  isInvalid={budgetLine === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <Textarea
                  size="md"
                  label="Description de la ligne budgetaire"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de la ligne budgetaire"
                  isInvalid={description === ""}
                  errorMessage="Vous devez obligatoirement compléter ce champ."
                />
                <div className="w-full flex flex-col gap-y-2">
                  <DatePicker
                    fullWidth
                    variant="bordered"
                    className="max-w-[284px]"
                    label="Date"
                    value={period}
                    onChange={setPeriod}
                  />
                  <p className="text-default-500 text-sm">
                    Période du {moment(period.toString()).format("MMMM")} {moment(period.toString()).format("YYYY")}
                  </p>
                </div>

                <Input
                  size="md"
                  label="Montant"
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



