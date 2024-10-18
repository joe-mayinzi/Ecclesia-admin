
const columns = [
  { name: "N°", uid: "#", sortable: true },
  { name: "Fichier", uid: "fichier", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Vue", uid: "vue", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Actif", uid: "actif" },
  { name: "Inactif", uid: "inactif" },
  // { name: "Bloquer", uid: "bloquer" },
];



export { columns, statusOptions };
