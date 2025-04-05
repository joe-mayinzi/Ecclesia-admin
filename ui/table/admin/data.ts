const columns = [
  { name: "UUID", uid: "id", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "TÉLÉPHONE", uid: "telephone" },
  { name: "RÔLE", uid: "role", sortable: true },
  { name: "STATUT", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = {
  Actif: "success",
  Inactif: "danger",
};

const users = [
  {
    id: "1a2b3c4d",
    email: "admin@example.com",
    telephone: "+243 970 000 111",
    role: "Super Admin",
    status: "Actif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g0#h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
  {
    id: "5e6f7g8h",
    email: "user@example.com",
    telephone: "+243 970 222 333",
    role: "Modérateur",
    status: "Inactif",
  },
];

export { columns, statusOptions, users };
