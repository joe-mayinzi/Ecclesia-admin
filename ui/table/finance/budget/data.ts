import React from "react";

const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Périod", uid: "period", sortable: true },
  { name: "Ligne budgetaire", uid: "budgetLine", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Dépense", uid: "expenses", sortable: true },
  { name: "Récette", uid: "income", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: true },
  { name: "Inactif", uid: false },
  // { name: "Bloquer", uid: "bloquer" },
];



export { columns, statusOptions };
