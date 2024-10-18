"use client"

import React, { useEffect, useState } from "react";

import { ManagementBudget, ManagementIncome } from "@/app/lib/config/interface";
import FinanceBudgetSsrTableUI from "@/ui/table/finance/budget/finance.budget.ssr.table";
import { Session } from "next-auth";
import FinanceIncomeSsrTableUI from "@/ui/table/finance/income/finance.income.ssr.table";
import { Button, Card, DatePicker, Input } from "@nextui-org/react";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";
import moment from "moment";
import { SearchIcon } from "@/ui/icons";
import { IoReload } from "react-icons/io5";
export default function ManangmentIncomePageClient({ initData, session }: { session: Session, initData: ManagementIncome[] }) {
  const dte = moment().format("YYYY-MM-DD").toString();
  const [totaleIncome, setTotaleIncome] = useState<number>(0);
  const [totaleInMonth, setTotaleInMonth] = useState<number>(0);
  const [dateBigin, setDatBigin] = useState<DateValue>(parseDate(dte));
  const [dateEnd, setDateEnd] = React.useState<DateValue>(parseDate(dte));

  const handelFilteByDate = () => {
    let income = 0
    let income_d = 0
    let startDate = moment(dateBigin.toString())
    let endDate = moment(dateEnd.toString())
    initData.map((item) => {
      income += item.amount;
      if (moment(item.createdAt).isBetween(startDate, endDate)) {
        income_d += item.amount
      }
    })
    setTotaleIncome(income)
    setTotaleInMonth(income_d)
  }

  const handelIntialeFilter = () => {
    let income = 0
    let income_d = 0
    let format = moment().format("YYYY-MM");
    initData.map((item) => {
      income += item.amount;
      if (moment(item.createdAt).format("YYYY-MM") === format) {
        income_d += item.amount
      }
    })
    setTotaleIncome(income)
    setTotaleInMonth(income_d)
  }

  useEffect(() => {
    handelIntialeFilter()
  }, [])

  return (
    <div>
      <h1 className="text-2xl">Recette</h1>
      <div className="flex gap-4 items-center mt-4">
        <DatePicker
          fullWidth
          size="sm"
          variant="bordered"
          className="max-w-[284px]"
          label="Date de debut"
          value={dateBigin}
          onChange={setDatBigin}
        />
        <DatePicker
          fullWidth
          size="sm"
          variant="bordered"
          className="max-w-[284px]"
          label="Date de fin"
          value={dateEnd}
          onChange={setDateEnd}
        />
        <Button onClick={handelFilteByDate} size="sm" isIconOnly className="bg-foreground">
          <SearchIcon className="text-background text-2xl" />
        </Button>
        <Button onClick={handelIntialeFilter} size="sm" isIconOnly className="bg-foreground">
          <IoReload size={30} className="text-background" />
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Card className="p-4">
          <p className="text-xl font-medium">Total de Recette</p>
          <p className="text-xl font-medium">$ {totaleIncome}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xl font-medium">Recette de ce mois</p>
          <p className="text-xl font-medium">$ {totaleInMonth}</p>
        </Card>
      </div>
      <FinanceIncomeSsrTableUI initData={initData} session={session} />
    </div>
  );
}
