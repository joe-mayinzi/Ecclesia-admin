const columns = [
  { name: "N°", uid: "id" },
  { name: "UTILISATEUR", uid: "utilisateur" },
  { name: "TITRE FORUM", uid: "title" },
  { name: "IMAGE", uid: "picture" },
  { name: "COMMENTAIRE", uid: "commentaire" },
  { name: "NB SIGNALEMENTS", uid: "nbSignalements" },
  { name: "STATUT", uid: "resolved" },
  { name: "DATE", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = {
  true: { label: "Résolu", color: "success" },
  false: { label: "En attente", color: "warning" },
};

export { columns, statusOptions };
