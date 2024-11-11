"use client"

import React, { useEffect, useRef, useState } from "react";

import { ManagementBudget, ManagementExpenses, ManagementIncome, TransactionCaisse } from "@/app/lib/config/interface";
import { Session } from "next-auth";
import { Button, Card, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { DateValue, parseDate, } from "@internationalized/date";
import moment from "moment";
import { SearchIcon } from "@/ui/icons";
import { IoReload } from "react-icons/io5";
import CreateExpenseFormModal from "@/ui/modal/form/finance/expense";
import { findManagementIncomeByEgliseIdApi, findManagementExpensesByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";
import CreateIncomeFormModal from "@/ui/modal/form/finance/income";
import { PayementReportingPrint } from "@/ui/print/print.financial";
import { useReactToPrint } from "react-to-print";

export default function ManangmentIncomePageClient({ initData, session }: { session: Session, initData: TransactionCaisse[] }) {
  const dte = moment().format("YYYY-MM-DD").toString();
  const [caisse, setCaisse] = useState<TransactionCaisse[]>(initData)
  const [caisseFILTERD, setCaisseFilterd] = useState<TransactionCaisse[]>(initData)
  const [totaleIncome, setTotaleIncome] = useState<number>(0);
  const [totaleInComeMonth, setTotaleInComeMonth] = useState<number>(0);
  const [totaleExpense, setTotaleExpense] = useState<number>(0);
  const [totaleExpenseMonth, setTotaleExpenseMonth] = useState<number>(0);
  const [dateBigin, setDatBigin] = useState<DateValue>(parseDate(dte));
  const [dateEnd, setDateEnd] = React.useState<DateValue>(parseDate(dte));
  const [view, setView] = useState<"APPRO" | "DEPENS" | "all">("all");

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const fusionnerTransactions = async (recettes: ManagementIncome[], depenses: ManagementExpenses[]): Promise<TransactionCaisse[]> => {
    const recettesTransformees = recettes.map(recette => ({
      typeTransaction: "Encaissement",
      description: recette.source,
      sourceApprov: recette.method,
      approvCaisse: recette.amount,
      depense: null,
      createdAt: new Date(recette.createdAt.toString())
    }));

    const depensesTransformees = depenses.map(depense => ({
      typeTransaction: "Décaissement",
      description: depense.motif || depense.budget?.budgetLine || "Décaissement sans motif",
      sourceApprov: null,
      approvCaisse: null,
      depense: depense.amount,
      createdAt: new Date(depense.createdAt.toString())
    }));

    const transactions = [...recettesTransformees, ...depensesTransformees];

    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const handelFindAll = async () => {
    const recettes = await findManagementIncomeByEgliseIdApi(session.user.eglise.id_eglise);
    const depenses = await findManagementExpensesByEgliseIdApi(session.user.eglise.id_eglise);

    const transactionsFusionneesEtTriees = await fusionnerTransactions(recettes, depenses);
    setCaisse(transactionsFusionneesEtTriees)
  }

  const handelFilteByDate = () => {
    let income = 0
    let income_d = 0
    let expense = 0
    let expense_d = 0
    let startDate = moment(dateBigin.toString())
    let endDate = moment(dateEnd.toString())
    caisse.map((item) => {
      console.log(item.approvCaisse);

      income += item.approvCaisse || 0;
      expense += item.depense || 0
      if (moment(item.createdAt).isBetween(startDate, endDate)) {
        income_d += item.approvCaisse || 0
        expense_d += item.depense || 0
      }
    })
    let filter = [...caisse];
    filter = filter.filter((item) => {
      let a = moment(item.createdAt)
      return a.isBetween(startDate, endDate)
    });
    setCaisseFilterd(filter)
    setTotaleIncome(income)
    setTotaleInComeMonth(income_d)
    setTotaleExpense(expense)
    setTotaleExpenseMonth(expense_d)
  }

  const handelIntialeFilter = () => {
    let income = 0
    let income_d = 0
    let expense = 0
    let expense_d = 0
    let format = moment().format("YYYY-MM");
    caisse.map((item) => {
      income += item.approvCaisse || 0;
      expense += item.depense || 0
      if (moment(item.createdAt).format("YYYY-MM") === format) {
        income_d += item.approvCaisse || 0;
        expense_d += item.depense || 0

      }
    })
    setTotaleIncome(income)
    setTotaleInComeMonth(income_d)
    setTotaleExpense(expense)
    setTotaleExpenseMonth(expense_d)
  }

  const handelChangeView = (value: "APPRO" | "DEPENS" | "all") => {
    setView(value)
    const filter = value !== "all" ? initData.filter((item) => value === "APPRO" ? item.typeTransaction === "Encaissement" : item.typeTransaction === "Décaissement") : initData
    setCaisse(filter)
  }
  useEffect(() => {
    handelIntialeFilter()
  }, [])

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <div>
      <h1 className="text-2xl">Caisse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-4">
        <div className="flex gap-4 w-fill">
          <DatePicker
            fullWidth
            size="sm"
            variant="bordered"
            // className="max-w-[284px]"
            label="Date de debut"
            value={dateBigin}
            onChange={setDatBigin}
          />
          <DatePicker
            fullWidth
            size="sm"
            variant="bordered"
            // className="max-w-[284px]"
            label="Date de fin"
            value={dateEnd}
            onChange={setDateEnd}
          />
        </div>
        <div className="flex gap-4 items-center justify-start mt-4 md:mt-0 md:justify-end">
          <Button onClick={handelFilteByDate} variant="flat" size="sm">
            <SearchIcon style={{ fontSize: 16 }} />
            Filtrer par date
          </Button>
          <Button onClick={handelIntialeFilter} size="sm" variant="flat">
            <IoReload size={17} />
            Réinitialiser
          </Button>
          <Button size="sm" variant="flat" onClick={() => { handlePrint() }}>
            Imprimer
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="flat"
              >
                <p>{view === "all" ? "Tout" : view === "APPRO" ? "Approvisionnement" : "Dépense"}</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem onClick={() => { handelChangeView("all") }} key="new">Tout voir</DropdownItem>
              <DropdownItem onClick={() => { handelChangeView("DEPENS") }} key="copy">Voir les Dépense</DropdownItem>
              <DropdownItem onClick={() => { handelChangeView("APPRO") }} key="edit">Voir les Approvisionnement</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Card className="p-4">
          <p className="text-md font-medium">Total encaissement</p>
          <p className="text-md font-medium">$ {totaleIncome}</p>
        </Card>
        <Card className="p-4">
          <p className="text-md font-medium">Total decaissement</p>
          <p className="text-md font-medium">$ {totaleExpense}</p>
        </Card>
        <Card className="p-4">
          <p className="text-md font-medium">Total decaissement de la période</p>
          <p className="text-md font-medium">$ {totaleExpenseMonth}</p>
        </Card>
        <Card className="p-4">
          <p className="text-md font-medium">Total encaissement de la période</p>
          <p className="text-md font-medium">$ {totaleInComeMonth}</p>
        </Card>
        <Card className="p-4">
          <p className="text-md font-medium">Solde</p>
          <p className="text-md font-medium">$ {totaleIncome - totaleExpense}</p>
        </Card>
        {/* <Card className="p-4">
          <p className="text-md font-medium">Recette de ce mois</p>
          <p className="text-md font-medium">$ {totaleInMonth}</p>
        </Card> */}
      </div>
      <div className="flex justify-end mt-4 gap-4">
        <CreateExpenseFormModal session={session} handleFindExpense={handelFindAll} />
        <CreateIncomeFormModal handleFindIncome={handelFindAll} />
      </div>


      <div className="mt-4">
        <Table
          isCompact={false}
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          // bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper: "max-h-[382px] after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={classNames}
          // selectionMode="multiple"
          // sortDescriptor={sortDescriptor}
          // defaultSelectedKeys={selectedKeys}
          // topContent={topContent}
          topContentPlacement="outside"
        // onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Type de transaction</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Source d'approv</TableColumn>
            <TableColumn>Approvisionnement caisse</TableColumn>
            <TableColumn>Depense</TableColumn>
          </TableHeader>
          <TableBody>
            {caisseFILTERD.map((item, i) => {
              return <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{moment(item.createdAt).format("DD-MM-YYYY")}</TableCell>
                <TableCell>{item.typeTransaction}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.sourceApprov}</TableCell>
                <TableCell>{item.approvCaisse || 0}USD</TableCell>
                <TableCell>{item.depense || 0}USD</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </div>

      <div className="hidden">
        <PayementReportingPrint
          filter={{
            keyWord: "",
            dateDebutFilter: new Date(dateBigin.toString()),
            dateFinFilter: new Date(dateEnd.toString())
          }}
          data_print={caisse}
          ref={componentRef}
        />
      </div>
    </div>
  );
}
