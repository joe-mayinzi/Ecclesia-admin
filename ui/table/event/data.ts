import React from "react";

const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Title", uid: "name", sortable: true },
  { name: "Déscription", uid: "description", sortable: true },
  { name: "Prix", uid: "price", sortable: true },
  { name: "Bloquer", uid: "blocked", sortable: true },
  { name: "Gratuit", uid: "isFree", sortable: true },
  { name: "Personne max", uid: "totalPerson", sortable: true },
  { name: "Service", uid: "service", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: true },
  { name: "Inactif", uid: false },
  // { name: "Bloquer", uid: "bloquer" },
];



export { columns, statusOptions };
