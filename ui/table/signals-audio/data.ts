const columns = [
  { name: "N°", uid: "id" },
  { name: "TITRE AUDIO", uid: "titre" },
  { name: "AUTEUR", uid: "auteur" },
  { name: "COMMENTAIRE", uid: "commentaire" },
  { name: "UTILISATEUR", uid: "utilisateur" }, // ajout utilisateur
  { name: "NB SIGNALEMENTS", uid: "nbSignalements" }, // ajout du compteur
  { name: "STATUT", uid: "resolved" },
  { name: "DATE", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];


const statusOptions = {
  true: { label: "Résolu", color: "success" },
  false: { label: "En attente", color: "warning" },
};

export { columns, statusOptions };
