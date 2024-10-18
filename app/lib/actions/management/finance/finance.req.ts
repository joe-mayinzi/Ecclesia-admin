"use server";

import { HttpRequest } from "../../../request/request";

export interface CreateManagementBudgetDto {
  budgetLine: string
  period: Date
  description?: string
  amount: number
}

export interface CreateManagementIncomeDto {
  source: string
  method: string
  amount: number
  budgetId?: number
}

export interface CreateManagementExpensesDto {
  amount: number
  motif?: string
  budgetId?: number
}


export const createManagementBudgetApi = async (dto: CreateManagementBudgetDto) => await HttpRequest(`management-budgets`, "POST", dto);
export const createManagementIncomeApi = async (dto: CreateManagementIncomeDto) => await HttpRequest(`management-expenses-income/create/income`, "POST", dto);
export const createManagementExpensesApi = async (dto: CreateManagementExpensesDto) => await HttpRequest(`management-expenses-income/create/expenses`, "POST", dto);



export const findManagementBudgetByEgliseIdApi = async (eglsieId: number) => await HttpRequest(`management-budgets/findByEgliseId/${eglsieId}`);
export const findManagementIncomeByEgliseIdApi = async (eglsieId: number) => await HttpRequest(`management-expenses-income/findIncomeByEgliseId/${eglsieId}`);
export const findManagementExpensesByEgliseIdApi = async (eglsieId: number) => await HttpRequest(`management-expenses-income/findExpensesByEgliseId/${eglsieId}`);

export const updateManagementBudgetApi = async (dto: Partial<CreateManagementBudgetDto>, budgetId: number) => await HttpRequest(`management-budgets/${budgetId}`, "PATCH", dto);
export const updateManagementExpenseApi = async (dto: Partial<CreateManagementExpensesDto>, incomeId: number) => await HttpRequest(`management-expenses-income/updateExpenses/${incomeId}`, "PATCH", dto);
export const updateManagementIncomeApi = async (dto: Partial<CreateManagementIncomeDto>, incomeId: number) => await HttpRequest(`management-expenses-income/updateIncome/${incomeId}`, "PATCH", dto);
export const updateIncomeUnLinkBudgetApi = async (incomeId: number) => await HttpRequest(`management-expenses-income/incomeUnLinkBudget/${incomeId}`, "PATCH");



export const deleteManagementBudgetApi = async (budgetId: number) => await HttpRequest(`management-budgets/${budgetId}`, "DELETE");
export const deleteManagementIncomeApi = async (budgetId: number) => await HttpRequest(`management-expenses-income/removeIncome/${budgetId}`, "DELETE");
export const deleteManagementExpensesApi = async (budgetId: number) => await HttpRequest(`management-expenses-income/removeExpenses/${budgetId}`, "DELETE");
