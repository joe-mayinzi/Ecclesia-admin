import React from "react";

const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Motif", uid: "motif", sortable: true },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Budget", uid: "budget", sortable: true },
  
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: true },
  { name: "Inactif", uid: false },
  // { name: "Bloquer", uid: "bloquer" },
];



export { columns, statusOptions };
