import { ManagementBudget, ManagementExpenses, TransactionCaisse } from "@/app/lib/config/interface";
import { Card, Table, TableHeader, TableRow, TableBody, TableCell, TableColumn, CardBody, Image } from "@nextui-org/react";
import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";

export const PayementReportingPrint = React.forwardRef(({ filter, data_print }: {
  data_print: TransactionCaisse[], filter: {
    keyWord: string;
    dateDebutFilter: Date;
    dateFinFilter: Date;
  }
}, ref: React.LegacyRef<HTMLDivElement> | undefined) => {
  let totaleIncome = 0
  let totaleInComeMonth = 0
  let totaleExpense = 0
  let totaleExpenseMonth = 0

  let income = 0
  let income_d = 0
  let expense = 0
  let expense_d = 0
  let startDate = moment(filter.dateDebutFilter.toString())
  let endDate = moment(filter.dateFinFilter.toString())
  data_print.map((item) => {
    console.log(item.approvCaisse);

    income += item.approvCaisse || 0;
    expense += item.depense || 0
    if (moment(item.createdAt).isBetween(startDate, endDate)) {
      income_d += item.approvCaisse || 0
      expense_d += item.depense || 0
    }
  })
  totaleIncome = income;
  totaleInComeMonth = income_d;
  totaleExpense = expense;
  totaleExpenseMonth = expense_d;

  return <div className="p-4" ref={ref}>
    <div className="flex w-full items-center justify-between">
      <div className="text-center">
        <Image
          src={`/ecclessia.png`}
          width={100}
          height={100}
          alt="logo EcclesiaBooK"
        />
      </div>
      <div className="text-center">
        <p className="font-bold text-4xl">
          RAPPORT
        </p>
        <p className="font-meduim text-2xl">
          Caise
        </p>
      </div>
      <div className="text-rigth">
        <p>Date d&rsquo;impression: {moment().format("DD/MM/YYYY")} </p>
        {/* <p>Filtré par mot clé: {filter.keyWord} </p> */}
        <p>Filtré par période: Dé {filter.dateDebutFilter ? moment(filter.dateDebutFilter).format("DD/MM/YYYY") : "--"} au {filter.dateFinFilter ? moment(filter.dateFinFilter).format("DD/MM/YYYY") : "--"}</p>
      </div>
    </div>
    <div className="grid grid-cols-5 justify-center gap-4 mt-4">
      <Card className="p-4">
        <p className="text-md font-medium">Total de Recette</p>
        <p className="text-md font-medium">$ {totaleIncome}</p>
      </Card>
      <Card className="p-4">
        <p className="text-md font-medium">Total de depense</p>
        <p className="text-md font-medium">$ {totaleExpense}</p>
      </Card>
      <Card className="p-4">
        <p className="text-md font-medium">Dépenses du mois</p>
        <p className="text-md font-medium">$ {totaleExpenseMonth}</p>
      </Card>
      <Card className="p-4">
        <p className="text-md font-medium">Recettes du mois</p>
        <p className="text-md font-medium">$ {totaleInComeMonth}</p>
      </Card>
      <Card className="p-4">
        <p className="text-md font-medium">Caisse</p>
        <p className="text-md font-medium">$ {totaleIncome - totaleExpense}</p>
      </Card>
    </div>
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableColumn className="border-r border-r-white">#</TableColumn>
          <TableColumn className="border-r border-r-white">Date</TableColumn>
          <TableColumn className="border-r border-r-white">Type de transaction</TableColumn>
          <TableColumn className="border-r border-r-white">Description</TableColumn>
          <TableColumn className="border-r border-r-white">Source d'approv</TableColumn>
          <TableColumn className="border-r border-r-white">Approvisionnement caisse</TableColumn>
          <TableColumn className="border-r border-r-white">Depense</TableColumn>
        </TableHeader>
        <TableBody>
          {
            data_print.map((item, index) => {
              return (
                <TableRow
                  className={clsx("", {
                    "bg-yellow-200 dark:bg-gray-800": index % 2
                  })}
                  key={index}
                >
                  <TableCell className="border-r border-r-white font-medium">{index + 1}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.createdAt).format("DD-MM-YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{item.typeTransaction}</TableCell>
                  <TableCell className="border-r border-r-white">{item.description}</TableCell>
                  <TableCell className="border-r border-r-white">{item.sourceApprov}</TableCell>
                  <TableCell className="border-r border-r-white text-right">${item.approvCaisse || 0}</TableCell>
                  <TableCell className="border-r border-r-white text-right">${item.depense || 0}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  </div>
});

export const BudgetReportingPrint = React.forwardRef(({ filter, data_print }: {
  data_print:{ budget: ManagementBudget[], depenses: ManagementExpenses[] }, filter: {
    keyWord: string;
    dateDebutFilter: Date;
    dateFinFilter: Date;
  }
}, ref: React.LegacyRef<HTMLDivElement> | undefined) => {
  let startDate = moment(filter.dateDebutFilter.toString())
  let endDate = moment(filter.dateFinFilter.toString())

  let filterData = data_print.budget.filter((item) => {
    const d = moment(item.period);
    console.log(d.format("DD-MM-YYYY"));

    if (d.isBetween(startDate, endDate, "month", '[]')) {
      console.log("error date all");

      return d.isBetween(startDate, endDate, "month", '[]')
    }
  })
  let total_budget = 0
  let budget_month = 0
  let budget_accomplished_total = 0
  let budget_accomplished_month = 0

  console.log("Filtre par date");

  filterData.map((item) => {
    if (moment(item.period).isBetween(startDate, endDate,  "month", '[]')) {
      total_budget += item.amount || 0;
    }
  })
  if (data_print.depenses) {
    for (let i = 0; i < data_print.depenses.length; i++) {
      const e = data_print.depenses[i];
      if (moment(e.createdAt).isBetween(startDate, endDate, "month", "[]")) {
        budget_accomplished_total += e.amount
      }
    }
  }


  return <div className="p-4" ref={ref}>
    <div className="flex w-full items-center justify-between">
      <div className="text-center">
        <Image
          src={`/ecclessia.png`}
          width={100}
          height={100}
          alt="logo EcclesiaBooK"
        />
      </div>
      <div className="text-center">
        <p className="font-bold text-4xl">
          RAPPORT
        </p>
        <p className="font-meduim text-2xl">
          Budget
        </p>
      </div>
      <div className="text-rigth">
        <p>Date d&rsquo;impression: {moment().format("DD/MM/YYYY")} </p>
        {/* <p>Filtré par mot clé: {filter.keyWord} </p> */}
        <p>Filtré par période: Dé {filter.dateDebutFilter ? moment(filter.dateDebutFilter).format("DD/MM/YYYY") : "--"} au {filter.dateFinFilter ? moment(filter.dateFinFilter).format("DD/MM/YYYY") : "--"}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 justify-center gap-4 mt-4">
      <Card className="p-4">
        <p className="text-md font-medium">Total de budget prévu pour la période</p>
        <p className="text-md font-medium">$ {total_budget}</p>
      </Card>
      <Card className="p-4">
        <p className="text-md font-medium">Budget réaliser pour la période</p>
        <p className="text-md font-medium">$ {budget_accomplished_total}</p>
      </Card>
    </div>
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableColumn className="border-r border-r-white">#</TableColumn>
          <TableColumn className="border-r border-r-white">Date</TableColumn>
          <TableColumn className="border-r border-r-white">Linge budgetaire</TableColumn>
          <TableColumn className="border-r border-r-white">Description</TableColumn>
          <TableColumn className="border-r border-r-white">Montant</TableColumn>
        </TableHeader>
        <TableBody>
          {
            filterData.map((item, index) => {
              return (
                <TableRow
                  className={clsx("", {
                    "bg-yellow-200 dark:bg-gray-800": index % 2
                  })}
                  key={index}
                >
                  <TableCell className="border-r border-r-white font-medium">{index + 1}</TableCell>
                  <TableCell className="border-r border-r-white">{moment(item.period).format("DD-MM-YYYY")}</TableCell>
                  <TableCell className="border-r border-r-white">{item.budgetLine}</TableCell>
                  <TableCell className="border-r border-r-white">{item.description}</TableCell>
                  <TableCell className="border-r border-r-white">{item.amount}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  </div>
});
