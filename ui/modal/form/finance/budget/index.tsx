"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea, DatePicker, Link, Switch, DropdownItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Select } from "@nextui-org/react";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
import { capitalize } from "@/app/lib/config/func";
import { ManagementBudget } from "@/app/lib/config/interface";
import { createManagementBudgetApi, createManagementSubPrevisionBudgetApi, updateManagementBudgetApi } from "@/app/lib/actions/management/finance/finance.req";
import Alert from "@/ui/modal/alert";

type CreateBudgetProps = {
  handleFindBudget: () => Promise<void>,
  event?: ManagementBudget
}

type SubPrevisionBudget = {
  description: string,
  qt: number,
  unitPrice: number,
  dateExpense: DateValue
}

export default function CreateBudgetFormModal({ handleFindBudget }: CreateBudgetProps) {

  const [pending, setPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [budgetLine, setBudgetLine] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period, setPeriod] = React.useState<DateValue>(parseDate(moment().format("YYYY-MM-DD")));
  const [amount, setAmount] = useState<number>(0)
  const [subPrevisionBudget, setSubPrevisionBudget] = useState<SubPrevisionBudget[]>([{ description: "", qt: 0, unitPrice: 0, dateExpense: parseDate(moment().format("YYYY-MM-DD")) }]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);


  const handleAddSubPrevisionBudgetForm = () => {
    const lastIndex = subPrevisionBudget.length - 1;
    const lastItem = subPrevisionBudget[lastIndex];
    if (lastItem.description !== "" && lastItem.qt !== 0 && lastItem.unitPrice !== 0) {
      setSubPrevisionBudget([...subPrevisionBudget, { description: "", qt: 0, unitPrice: 0, dateExpense: parseDate(moment().format("YYYY-MM-DD")) }]);
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur")
      setAlertMsg("Veillez remplir le dérnier prévision correctement!")
    }
  }

  const handleResetSubPrevisionBudgetForm = () => {
    setSubPrevisionBudget([{ description: "", qt: 0, unitPrice: 0, dateExpense: parseDate(moment().format("YYYY-MM-DD")) }]);
  }

  const getTotalAmount = (subPrevisions: SubPrevisionBudget[]): number => {
    return subPrevisions.reduce((total, item) => {
      return total + (item.qt * item.unitPrice);
    }, 0);
  };


  const isSubPrevisionBudgetValid = (subPrevision: SubPrevisionBudget): boolean => {
    return (
      subPrevision.description.trim() !== "" &&
      subPrevision.qt > 0 &&
      subPrevision.unitPrice > 0 &&
      subPrevision.dateExpense.toString().trim() !== ""
    );
  };

  const hasValidSubPrevision = (subPrevisions: SubPrevisionBudget[]): boolean => {
    return subPrevisions.some(isSubPrevisionBudgetValid);
  };

  const handlAction = async () => {


    if (hasValidSubPrevision(subPrevisionBudget)) {
      setPending(true);
      const dto = {
        budgetLine,
        description,
        period: new Date(period.toString()),
        amount: getTotalAmount(subPrevisionBudget)
      }
      const create = await createManagementBudgetApi(dto);
      setPending(false);

      if (!create.hasOwnProperty("statusCode") && (!create.hasOwnProperty("error") || !create.hasOwnProperty("error"))) {
        setPending(true);
        const data = { dto: subPrevisionBudget.map((item) => ({ ...item, dateExpense: new Date(item.dateExpense.toString()) })) }
        const addSubPrevision = await createManagementSubPrevisionBudgetApi(data, create.id)
        setPending(false);
        if (!addSubPrevision.hasOwnProperty("statusCode") && (!addSubPrevision.hasOwnProperty("error") || !addSubPrevision.hasOwnProperty("error"))) {
          handleFindBudget();
          onClose();
        } else {
          onClose();
          setOpenAlert(true);
          setAlertTitle("Message d'erreur");
          if (typeof addSubPrevision.message === "object") {
            let message = '';
            addSubPrevision.message.map((item: string) => message += `${item} \n`);
            setAlertMsg(message);
          } else {
            setAlertMsg(addSubPrevision.message);
          }
        }
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
    } else {
      setOpenAlert(true);
      setAlertTitle("Message d'erreur");
      setAlertMsg("Aucune prévision budgétaire n'est valide.");

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
                  size="sm"
                  label="Ligne budgetaire"
                  variant="bordered"
                  value={budgetLine}
                  onChange={(e) => { setBudgetLine(e.target.value) }}
                  placeholder="Ligne budgetaire"
                />
                <Textarea
                  size="sm"
                  label="Description de la ligne budgetaire"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de la ligne budgetaire"
                />
                <div className="w-full flex flex-col gap-y-2">
                  <DatePicker
                    fullWidth
                    size="sm"
                    variant="bordered"
                    label="Date"
                    value={period}
                    onChange={setPeriod}
                  />
                  <p className="text-default-500 text-sm">
                    Période du {moment(period.toString()).format("MMMM")} {moment(period.toString()).format("YYYY")}
                  </p>
                </div>

                <p className="text-xl">Détail de la prévision budgétaire</p>
                <div className="m-4">
                  {subPrevisionBudget.map((_, i) => <AddSubPrevisionBudgetComponent index={i} subPrevisionBudget={subPrevisionBudget} key={i} setSubPrevisionBudget={setSubPrevisionBudget} />)}
                </div>
                {/* <Input
                  size="sm"
                  label="Montant"
                  variant="bordered"
                  type="number"
                  value={amount.toString()}
                  onChange={(e) => { setAmount(parseInt(e.target.value)) }}
                  placeholder="Montant"
                /> */}
                <div className="flex justify-end items-center">
                  <Button type="button" className="bg-primary text-white mb-5" onClick={handleAddSubPrevisionBudgetForm}>
                    Ajouter une prévision
                  </Button>
                </div>

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
                />
                <Textarea
                  size="md"
                  label="Description de la ligne budgetaire"
                  variant="bordered"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  placeholder="Description de la ligne budgetaire"
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

export function AddSubPrevisionBudgetComponent({ index, subPrevisionBudget, setSubPrevisionBudget }: {
  index: number,
  subPrevisionBudget: SubPrevisionBudget[],
  setSubPrevisionBudget: React.Dispatch<React.SetStateAction<SubPrevisionBudget[]>>
}) {

  const handleChange = (input: keyof SubPrevisionBudget, value: SubPrevisionBudget[keyof SubPrevisionBudget]) => {
    setSubPrevisionBudget((prev) => {
      const newSubPrevisionBudget = [...prev];

      const formToUpdate: any = { ...newSubPrevisionBudget[index] };
      formToUpdate[input] = value;

      newSubPrevisionBudget[index] = formToUpdate;

      return newSubPrevisionBudget;

    });
  }

  const removeSubPrevisionBudget = () => {
    setSubPrevisionBudget((prev) => {
      const newSubPrevisionBudget = prev.filter((_, i) => i !== index);
      return newSubPrevisionBudget;
    });
  };

  return <div className="flex flex-col gap-4 mb-2">
    <Input
      type="text"
      name="description"
      placeholder="Déscription"
      label="Déscription"
      variant="bordered"
      value={subPrevisionBudget[index].description}
      onChange={(e) => handleChange("description", e.target.value)}
    />
    <Input
      type="number"
      name="unitPrice"
      placeholder="Prix unitaire"
      label="Prix unitaire"
      variant="bordered"
      value={subPrevisionBudget[index].unitPrice.toString()}
      onChange={(e) => handleChange("unitPrice", parseInt(e.target.value))}
    />
    <Input
      type="text"
      name="qt"
      placeholder="Quantité"
      label="Quantité"
      variant="bordered"
      value={subPrevisionBudget[index].qt.toString()}
      onChange={(e) => handleChange("qt", parseInt(e.target.value))}
    />
    <div className="w-full flex flex-col gap-y-2">
      <DatePicker
        fullWidth
        size="sm"
        variant="bordered"
        label="Période de la depense"
        value={subPrevisionBudget[index].dateExpense}
        onChange={(e) => handleChange("dateExpense", e)}
      />
      <p className="text-default-500 text-sm">
        Période du {moment(subPrevisionBudget[index].dateExpense.toString()).format("MMMM")} {moment(subPrevisionBudget[index].dateExpense.toString()).format("YYYY")}
      </p>
    </div>
    {subPrevisionBudget.length > 1 &&
      <div className="flex justify-end">
        <Button size="sm" color="danger" variant="bordered" onClick={removeSubPrevisionBudget}>Supprimer</Button>
      </div>
    }
  </div>
}


export function SubPrevisionFormModal({ budget, isOpen, onClose }: { budget: any, isOpen: boolean, onClose: () => void }) {

  const [pending, setPending] = useState<boolean>(false);
  const [subPrevision, setSubPrevision] = useState<any[]>(Array.isArray(budget.subPrevision) ? budget.subPrevision : [])

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const getTotalAmount = (subPrevisions: SubPrevisionBudget[]): number => {
    return subPrevisions.reduce((total, item) => {
      return total + (item.qt * item.unitPrice);
    }, 0);
  };

  const handlAction = async () => {
    setPending(true);

    setPending(false);
  };

  return (
    <>
      <Modal backdrop={"opaque"} size="2xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Liste de prevision budgetaire:
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Total de prévision</p>
                    <p>{subPrevision.length}</p>
                  </div>
                  <div className="items-center gap-4 border border-default p-4 rounded-lg">
                    <p>Montant Total</p>
                    <p> {budget.amount} USD</p>

                  </div>
                </div>
                <div>
                  <Table fullWidth isStriped aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>#</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Quantité</TableColumn>
                      <TableColumn>Print unitaire</TableColumn>
                      <TableColumn>Print total</TableColumn>
                      <TableColumn>Période de la depense</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {subPrevision.map((item, i) => {
                        return <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.qt}</TableCell>
                          <TableCell>{item.unitPrice}</TableCell>
                          <TableCell>{item.unitPrice * item.qt}</TableCell>
                          <TableCell>Le {moment(item.dateExpense).format("DD-MM-YYYY")}</TableCell>
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p className="text-center">{alertMsg}</p>} alertTitle={alertTitle} />
    </>
  );
}


