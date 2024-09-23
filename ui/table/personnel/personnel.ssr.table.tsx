import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
} from "@nextui-org/react";
import { columns, statusOptions } from "./data";
import { capitalize } from "@/app/lib/config/func";
import DialogAction from "../../modal/dialog";
import Alert from "../../modal/alert";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "../../icons";
import { Session } from "next-auth";
import { StatusAcounteEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";

const statusColorMap: Record<string, ChipProps["color"]> = {
  actif: "success",
  inactif: "warning",
  bloquer: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["nom", "telephone", "email", "adresse", "status", "actions"];


export default function GestionPersonnelSsrTableUI({ initData, session }: { session: Session, initData: any }) {
  const [membres, setMembres] = useState<any>(initData)
  const [day, setDay] = useState<any[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  type Membres = typeof membres[0];

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(membres.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredMembres = [...membres];

    if (hasSearchFilter) {
      filteredMembres = filteredMembres.filter((membre) =>
        membre.nom.toLowerCase().includes(filterValue.toLowerCase()) ||
        membre.prenom.toLowerCase().includes(filterValue.toLowerCase()) ||
        membre.telephone.toLowerCase().includes(filterValue.toLowerCase()) ||
        membre.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        `${membre.nom} ${membre.prenom}`.toLowerCase().includes(filterValue.toLowerCase()) ||
        `${membre.prenom} ${membre.nom}`.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredMembres = filteredMembres.filter((membre) =>
        Array.from(statusFilter).includes(membre.status),
      );
    }

    return filteredMembres;
  }, [membres, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof Membres] as number;
      const second = b[sortDescriptor.column as keyof Membres] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((membre: Membres, columnKey: React.Key) => {
    const {user} = membre;
    console.log(user);
    
    switch (columnKey) {
      case "nom":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: `${file_url}${user.profil}` }}
            classNames={{
              description: "text-default-500",
            }}
            description={user.telephone}
            name={`${user.nom} ${user.prenom}`}
          >
            {user.nom} {user.prenom}
          </User>
        );
      case "telephone":
        return (<p>{user.telephone} </p>);
      case "email":
        return (<p>{user.email} </p>);
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[user.status] || "danger"}
            size="sm"
            variant="dot"
          >
            {statusOptions.find(item => item.uid === membre.id)?.name}
          </Chip>
        );
      case "actions":
        return (
          <ActionMembre handleFindMemebres={handleFindMemebres} membre={membre} setMembres={setMembres} membres={user} />
        );
      default:
        return <></>;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleFindMemebres = async () => {
    // if (session) {
    //   const find = await findMembreApi(session.user.eglise.id_eglise);
    //   if (find) {
    //     setMembres(find);
    //   }
    // }

  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Rechercher par date..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="none"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="none"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <AddMembreFormModal id_eglise={session.user.eglise.id_eglise} handleFindMemebres={handleFindMemebres} /> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {membres.length} membres</span>
          <label className="flex items-center text-default-400 text-small">
            Lignes par page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    day,
    setDay
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les éléments séléctionné"
            : `${selectedKeys.size} à ${items.length} sélectionné`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      isCompact={false}
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "max-h-[382px] after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Aucun rendez-vous trouvé"} items={sortedItems}>
        {(item: Membres) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


export const ActionMembre = ({ membre, membres, setMembres, handleFindMemebres }: {
  membre: any
  setMembres: Dispatch<SetStateAction<any>>
  membres: any[],
  handleFindMemebres: any
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onBloqued, setOnBloqued] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const handleBloqueMembres = async () => {
    // const update = await updateMembreApi({
    //   status: membre.status === StatusAcounteEnum.ACTIF ? StatusAcounteEnum.INACTIF : StatusAcounteEnum.ACTIF
    // }, membre.id);
    // if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("message")) {
    //   setOpenAlert(true);
    //   setAlertTitle("Erreur");
    //   if (typeof update.message === "object") {
    //     let message = '';
    //     update.message.map((item: string) => message += `${item} \n`)
    //     setAlertMsg(message);
    //   } else {
    //     setAlertMsg(update.message);
    //   }
    // } else {
    //   handleFindMemebres();
    //   setOpenModal(false);
    //   setOpenAlert(true);
    //   setAlertTitle("Modification réussi");
    //   setAlertMsg("La mofidication de compte du membre a réussi.");
    // }
  }

  return <div className="relative flex justify-end items-center gap-2">
    <Dropdown className="bg-background border-1 border-default-200">
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <VerticalDotsIcon className="text-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => { setOpenModal(true) }}>Modifier</DropdownItem>
        <DropdownItem onClick={() => { setOnBloqued(true) }}> {membre.status === StatusAcounteEnum.ACTIF ? "Bloquer" : "Débloquer"}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    <DialogAction
      isOpen={onBloqued}
      onOpen={() => { setOnBloqued(true) }}
      onClose={() => { setOnBloqued(false) }}
      dialogBody={<p>Étes-vous sure de vouloir {membre.status === StatusAcounteEnum.ACTIF ? "bloquer" : "débloquer"} ce membre?</p>}
      dialogTitle={"Bloquer le membres"}
      action={handleBloqueMembres}
    />
    {/* <UpdateMembreFormModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      membre={membre}
      handleFindMemebres={handleFindMemebres}
    /> */}
  </div>
}