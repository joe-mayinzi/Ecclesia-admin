import React, { useState } from "react";
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
import { capitalize, formatBytes, getFileIcon } from "@/app/lib/config/func";
import { VerticalDotsIcon, SearchIcon, ChevronDownIcon } from "@/ui/icons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CiFolderOn } from "react-icons/ci";
import moment from "moment";
import BtnSwitchArchive from "@/ui/btn/switch.archive";
import CreateFolderArchiveFormModal from "@/ui/modal/form/archive";
import { ArchiveProps } from "@/app/church/management/archive/component/archive.card";
import { useRouter } from "next/navigation";
import { file_url } from "@/app/lib/request/request";
import ArchiveOptionActionComponent from "@/app/church/management/archive/component/archive.option.action";


const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "date", "size", "actions"];



export default function ArchiveSsrTable(props: ArchiveProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const router = useRouter();

  const [page, setPage] = React.useState(1);

  type Archivage = typeof props.initData[0];

  const pages = Math.ceil(props.initData.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredArchivage = [...props.initData];

    if (hasSearchFilter) {
      filteredArchivage = filteredArchivage.filter((archive) =>
        archive.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredArchivage = filteredArchivage.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredArchivage;
  }, [props.initData, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Archivage, b: Archivage) => {
      const first = a[sortDescriptor.column as keyof Archivage] as number;
      const second = b[sortDescriptor.column as keyof Archivage] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((archive: Archivage, columnKey: React.Key) => {
    const cellValue = archive[columnKey as keyof Archivage];
    console.log(archive);

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-4">
            {archive.hasOwnProperty("typeMime") ? getFileIcon(archive.name, 30) : <CiFolderOn size={30} />}

            {archive.name}
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-small capitalize">{cellValue}</p> */}
            <p className="text-bold text-tiny capitalize text-default-500">{moment(archive.updatedAt).format('ll')}</p>
          </div>
        );
      case "size":
        return (
          <p className="text-center">
            {archive.hasOwnProperty("typeMime") ? formatBytes(archive.size) : "-"}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <ArchiveOptionActionComponent id={archive.id} type={archive.hasOwnProperty("typeMime") ? "Document" : "Folder"} handelFindArchiveByEgliseId={props.handelFindArchiveByEgliseId} name={archive.name} />
          </div>
        );
      default:
        return cellValue;
    }
  }, [props]);


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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex items-center gap-3">
            <BtnSwitchArchive state={props.state} setState={props.setState} />
            <CreateFolderArchiveFormModal setDocumentsUrl={props.setDocumentsUrl} documentsUrl={props.documentsUrl} created={props.created} setCreated={props.setCreated} onUploadDocument={props.onUploadDocument} setOnUploadDocument={props.setOnUploadDocument} id={props.id} handelFindArchiveByEgliseId={props.handelFindArchiveByEgliseId} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {props.initData.length} content</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
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
    props.initData.length,
    hasSearchFilter,
    props.handelFindArchiveByEgliseId,
    props.setState,
    props.state,
    props.id,
    props
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
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
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
        "hover:bg-danger-50"
      ],
    }),
    [],
  );

  return (
    <Table
      isCompact
      isStriped
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      // selectionMode="multiple"
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
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id} className="cursor-pointer" onDoubleClick={() => { router.push(item.hasOwnProperty("typeMime") ? `${file_url}${item.path}` : `/church/management/archive/${item.uuidName}`) }}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
