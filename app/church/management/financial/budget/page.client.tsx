"use client"

import React from "react";

import { ManagementBudget, ManagementExpenses } from "@/app/lib/config/interface";
import FinanceBudgetSsrTableUI from "@/ui/table/finance/budget/finance.budget.ssr.table";
import { Session } from "next-auth";

export default function ManangmentBubgetPageClient({ initData, session }: { session: Session, initData: {budget: ManagementBudget[], depenses: ManagementExpenses[] } }) {


  return (
    <div>
       <h1 className="text-2xl">Prévision budgetaire </h1>
       <FinanceBudgetSsrTableUI initData={initData} session={session} />
    </div>
  );
}
