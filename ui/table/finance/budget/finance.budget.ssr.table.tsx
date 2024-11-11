import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  DatePicker,
  Card,
} from "@nextui-org/react";
import { columns, statusOptions } from "./data";
import { capitalize } from "@/app/lib/config/func";
import { Session } from "next-auth";
import { ManagementBudget, ManagementExpenses } from "@/app/lib/config/interface";
import { SearchIcon, ChevronDownIcon } from "@/ui/icons";
import moment from "moment";
import { ActionBudget } from "./action.ssr.table";
import CreateBudgetFormModal from "@/ui/modal/form/finance/budget";
import { findManagementBudgetByEgliseIdApi } from "@/app/lib/actions/management/finance/finance.req";
import { useReactToPrint } from "react-to-print";
import { DateValue, parseDate, } from "@internationalized/date";
import { IoReload } from "react-icons/io5";
import { BudgetReportingPrint } from "@/ui/print/print.financial";

const statusColorMap: Record<string, ChipProps["color"]> = {
  actif: "success",
  inactif: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["budgetLine", "period", "amount", "expenses", "description", "actions"];


export default function FinanceBudgetSsrTableUI({ initData, session }: { session: Session, initData: { budget: ManagementBudget[], depenses: ManagementExpenses[] } }) {
  const [events, setEvents] = useState<ManagementBudget[]>(initData.budget)
  const [day, setDay] = useState<any[]>([]);
  const dt = moment(initData.budget[initData.budget.length - 1].period.toString()).format("YYYY-MM-DD").toString();
  const dte = moment(initData.budget[0].period.toString()).format("YYYY-MM-DD").toString();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([1, 2]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [budgetMonth, setBudgetMonth] = useState<number>(0);
  const [budgetAccomplishedTotal, setBudgetAccomplishedTotal] = useState<number>(0);
  const [budgetAaccomplishedMonth, setBudgetAaccomplishedMonth] = useState<number>(0);
  const [dateBigin, setDatBigin] = useState<DateValue>(parseDate(dt));
  const [dateEnd, setDateEnd] = React.useState<DateValue>(parseDate(dte));

  type Budgets = ManagementBudget

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(events.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredEvents = [...events];

    // if (hasSearchFilter) {
    //   filteredEvents = filteredEvents.filter((event) =>
    //     event.budgetLine.toLowerCase().includes(filterValue.toLowerCase())
    //   );
    // }

    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredEvents = filteredEvents.filter((event) =>
    //     Array.from(statusFilter).includes(event.isBlocked ? "inactif" : "actif"),
    //   );
    // }

    if (dateBigin || dateEnd) {
      console.log("date change");
 
      let startDate = moment(dateBigin.toString(), "DD-MM-YYYY")
      let endDate = moment(dateEnd.toString(), "DD-MM-YYYY")
      console.log("startDate", startDate);
      console.log("endDate",endDate);
      filteredEvents = filteredEvents.filter((item) => {
        const d = moment(item.period, "DD-MM-YYYY");
        if (d.isBetween(startDate, endDate, "month", "[]")) {
          console.log("error date all");

          return d.isBetween(startDate, endDate, "month", "[]")
        }
      })
    }
    return filteredEvents;
  }, [events, dateBigin, dateEnd]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof Budgets] as number;
      const second = b[sortDescriptor.column as keyof Budgets] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((budget: Budgets, columnKey: React.Key) => {
    let income: number = 0
    budget.income?.map((item) => {
      income += item.amount
    });
    let expenses: number = 0
    budget.expenses?.map((item) => {
      expenses += item.amount
    });
    switch (columnKey) {
      case "budgetLine":
        return (
          <p> {budget.budgetLine}</p>
        );
      case "description":
        return <div className="w-96">
          <p className="line-clamp-3">{budget.description} </p>
        </div>
      case "period":
        return <div>
          <p className="line-clamp-3">{moment(budget.period).format("MM-YYYY")} </p>
        </div>
      case "amount":
        return (<p>{budget.amount} USD</p>);

      case "income":
        return (<p>{income} USD</p>);

      case "expenses":
        return (<p>{expenses} USD</p>);
      case "actions":
        return (
          <ActionBudget handleFindBudget={handleFindBudget} budget={budget} />
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

  const handelStatistique = useCallback(() => {
    if (dateBigin || dateEnd) {
      let total_budget = 0
      let budget_month = 0
      let budget_accomplished_total = 0
      let budget_accomplished_month = 0
      let startDate = moment(dateBigin.toString())
      let endDate = moment(dateEnd.toString())
      console.log("Filtre par date");

      initData.budget.map((item) => {
        total_budget += item.amount || 0;
        if (moment(item.period).isBetween(startDate, endDate, "month", "[]")) {
          budget_month += item.amount || 0
        }
      });

      if (initData.depenses) {
        for (let i = 0; i < initData.depenses.length; i++) {
          const e = initData.depenses[i];
          budget_accomplished_total += e.amount
          if (moment(e.createdAt).isBetween(startDate, endDate, "month", "[]")) {
            budget_accomplished_month += e.amount
          }
        }
      }

      setTotalBudget(total_budget)
      setBudgetMonth(budget_month)
      setBudgetAccomplishedTotal(budget_accomplished_total)
      setBudgetAaccomplishedMonth(budget_accomplished_month)
    }
  }, [dateBigin , dateEnd]);

  const handelIntialeFilter = useCallback(() => {
    let total_budget = 0
    let budget_month = 0
    let budget_accomplished_total = 0
    let budget_accomplished_month = 0
    let format = moment().format("YYYY-MM");
    initData.budget.map((item) => {
      total_budget += item.amount || 0;
      if (moment(item.period).format("YYYY-MM") === format) {
        budget_month += item.amount || 0
      }
    })

    if (initData.depenses) {
      for (let i = 0; i < initData.depenses.length; i++) {
        const e = initData.depenses[i];
        budget_accomplished_total += e.amount
        if (moment(e.createdAt).format("YYYY-MM") === format) {
          budget_accomplished_month += e.amount
        }
      }
    }
    setTotalBudget(total_budget)
    setBudgetMonth(budget_month)
    setBudgetAccomplishedTotal(budget_accomplished_total)
    setBudgetAaccomplishedMonth(budget_accomplished_month)
  }, [sortedItems]);

  const handleFindBudget = async () => {
    if (session) {
      const find = await findManagementBudgetByEgliseIdApi(session.user.eglise.id_eglise);
      if (find) {
        setEvents(find);
      }
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 items-center mt-4">
          <div className="flex gap-2 w-fill">
            <DatePicker
              fullWidth
              size="sm"
              variant="bordered"
              // className="max-w-[284px]"
              label="Date de debut"
              value={dateBigin}
              onChange={setDatBigin}
            />
            <DatePicker
              fullWidth
              size="sm"
              variant="bordered"
              // className="max-w-[284px]"
              label="Date de fin"
              value={dateEnd}
              onChange={setDateEnd}
            />
          </div>
          <div className="flex gap-2 items-center justify-start mt-4  md:justify-end">
            <Button onClick={handelStatistique} variant="flat" size="sm">
              <SearchIcon style={{ fontSize: 16 }} />
              Filtrer par date
            </Button>
            <Button onClick={handelIntialeFilter} size="sm" variant="flat">
              <IoReload size={17} />
              Réinitialiser
            </Button>
            <Button size="sm" variant="flat" onClick={() => { handlePrint() }}>
              Imprimer
            </Button>
            <CreateBudgetFormModal handleFindBudget={handleFindBudget} />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4 mt-4">
          <Card className="p-4">
            <p className="text-md font-medium">Total de budget</p>
            <p className="text-md font-medium">$ {totalBudget}</p>
          </Card>
          <Card className="p-4">
            <p className="text-md font-medium">Budget réaliser</p>
            <p className="text-md font-medium">$ {budgetAccomplishedTotal}</p>
          </Card>
          <Card className="p-4">
            <p className="text-md font-medium">Budget du mois</p>
            <p className="text-md font-medium">$ {budgetMonth}</p>
          </Card>
          <Card className="p-4">
            <p className="text-md font-medium">Budget du mois réaliser</p>
            <p className="text-md font-medium">$ {budgetAaccomplishedMonth}</p>
          </Card>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {events.length} bubget</span>
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
    setDay,
    dateBigin,
    dateEnd,
    setDatBigin,
    setDateEnd,
    handelIntialeFilter,
    handelStatistique,
    totalBudget,
    budgetMonth,
    budgetAccomplishedTotal,
    budgetAaccomplishedMonth
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

  useEffect(() => {
    console.log(events);
    handelIntialeFilter()
    // events.map((item: ManagementEvent) => {
    //   if (item.isCancel !== null) {
    //     console.log("isCancel", new Set([item.id]));
    //     setSelectedKeys(new Set([`${item.id}`]))
    //   }
    // })

  }, [events])

  return (
    <main>
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
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        defaultSelectedKeys={selectedKeys}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
        color={"danger"}
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
        <TableBody emptyContent={"Aucun événement trouvé"} items={sortedItems}>
          {(item: Budgets) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="hidden">
        <BudgetReportingPrint
          filter={{
            keyWord: "",
            dateDebutFilter: new Date(dateBigin.toString()),
            dateFinFilter: new Date(dateEnd.toString())
          }}
          data_print={initData}
          ref={componentRef}
        />
      </div>
    </main>
  );
}


