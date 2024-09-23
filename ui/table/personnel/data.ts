import React from "react";
const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Nom & prenom", uid: "nom", sortable: true },
  { name: "Téléphone", uid: "telephone", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  { name: "Service", uid: "service", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: "actif" },
  { name: "Inactif", uid: "inactif" },
  // { name: "Bloquer", uid: "bloquer" },
];



export { columns, statusOptions };
