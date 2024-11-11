import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findManagementExpensesByEgliseIdApi, findManagementIncomeByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";
import ManangmentIncomePageClient from "./page.client";
import { ManagementExpenses, ManagementIncome, TransactionCaisse } from "@/app/lib/config/interface";
import moment from "moment";


export default async function ManangmentIncomePage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const recettes = await findManagementIncomeByEgliseIdApi(id_eglise);
  const depenses = await findManagementExpensesByEgliseIdApi(id_eglise);

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

    return  transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() );
  };

  const transactionsFusionneesEtTriees = await fusionnerTransactions(recettes, depenses);
  console.log(transactionsFusionneesEtTriees);


  return (
    <ManangmentIncomePageClient initData={transactionsFusionneesEtTriees} session={session} />
  );
}
