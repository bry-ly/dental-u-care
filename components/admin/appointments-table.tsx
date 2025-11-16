"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconSearch,
} from "@tabler/icons-react";
import { Calendar, Clock, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  confirmAppointments,
  cancelAppointments,
  completeAppointments,
  deleteAppointments,
  deleteAppointment,
} from "@/lib/actions/admin-actions";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Appointment = {
  id: string;
  date: Date;
  timeSlot: string;
  status: string;
  notes: string | null;
  patient: {
    name: string;
    email: string;
  };
  dentist: {
    name: string;
  };
  service: {
    name: string;
    price: string;
  };
  payment: {
    status: string;
    amount: number;
  } | null;
};

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    pending: "secondary",
    confirmed: "default",
    cancelled: "destructive",
    completed: "outline",
    rescheduled: "secondary",
  };

  return (
    <Badge variant={variants[status] || "default"} className="text-xs">
      {status.toUpperCase()}
    </Badge>
  );
};

const getPaymentBadge = (status: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    paid: "default",
    pending: "secondary",
    failed: "destructive",
    refunded: "outline",
  };

  return (
    <Badge variant={variants[status] || "default"} className="text-xs">
      {status.toUpperCase()}
    </Badge>
  );
};

const columns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "patientName",
    accessorFn: (row) => row.patient.name,
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.patient.name}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.patient.email}
        </p>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "dentistName",
    accessorFn: (row) => row.dentist.name,
    header: "Dentist",
    cell: ({ row }) => <span>Dr. {row.original.dentist.name}</span>,
  },
  {
    id: "serviceName",
    accessorFn: (row) => row.service.name,
    header: "Service",
    cell: ({ row }) => row.original.service.name,
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => (
      <div>
        <p>{new Date(row.original.date).toLocaleDateString()}</p>
        <p className="text-xs text-muted-foreground">{row.original.timeSlot}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "paymentStatus",
    accessorFn: (row) => row.payment?.status || "none",
    header: "Payment",
    cell: ({ row }) =>
      row.original.payment ? getPaymentBadge(row.original.payment.status) : "-",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      if (row.original.payment) {
        const amount = row.original.payment.amount;
        return <div className="text-right">₱{amount.toFixed(2)}</div>;
      }
      // service.price is a string (e.g., "₱500 – ₱1,500" or "₱1,500")
      const price = row.original.service.price;
      return <div className="text-right">{price}</div>;
    },
  },
];

type AdminAppointmentsTableProps = {
  appointments: Appointment[];
};

export function AdminAppointmentsTable({
  appointments,
}: AdminAppointmentsTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] =
    React.useState<Appointment | null>(null);

  const formatPrice = (price: number | string): string => {
    if (typeof price === "string") {
      return price;
    }
    if (isNaN(price)) {
      return "Contact for pricing";
    }
    return `₱${price.toLocaleString()}`;
  };

  const handleBulkAction = async (
    action: (ids: string[]) => Promise<{ success: boolean; message: string }>,
    actionName: string
  ) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) {
      toast.error("No appointments selected");
      return;
    }

    setIsLoading(true);
    try {
      const result = await action(ids);
      if (result.success) {
        toast.success(result.message);
        setRowSelection({});
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${actionName}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleAction = async (
    action: () => Promise<{ success: boolean; message: string }>,
    actionName: string
  ) => {
    setIsLoading(true);
    try {
      const result = await action();
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${actionName}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteAppointment(appointmentToDelete.id);
      if (result.success) {
        toast.success(result.message);
        setAppointmentToDelete(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete appointment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const actionsColumn: ColumnDef<Appointment> = {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            disabled={isLoading}
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setSelectedAppointment(row.original)}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.info("Edit feature coming soon")}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.info("Reschedule feature coming soon")}
          >
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              handleSingleAction(
                () => cancelAppointments([row.original.id]),
                "cancel appointment"
              )
            }
          >
            Cancel
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAppointmentToDelete(row.original)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };

  const columnsWithActions = [...columns, actionsColumn];

  const table = useReactTable({
    data: appointments,
    columns: columnsWithActions,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={
              (table.getColumn("patientName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("patientName")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions Toolbar */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
          <span className="text-sm font-medium">
            {table.getFilteredSelectedRowModel().rows.length} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() =>
                handleBulkAction(confirmAppointments, "confirm appointments")
              }
            >
              Confirm Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => toast.info("Reschedule feature coming soon")}
            >
              Reschedule Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => toast.info("Send reminders feature coming soon")}
            >
              Send Reminders
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  More Actions
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    handleBulkAction(
                      completeAppointments,
                      "complete appointments"
                    )
                  }
                >
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast.info("Export feature coming soon")}
                >
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleBulkAction(cancelAppointments, "cancel appointments")
                  }
                >
                  Cancel Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    handleBulkAction(deleteAppointments, "delete appointments")
                  }
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  Appointment Details
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedAppointment?.id}
                </DialogDescription>
              </div>
              {selectedAppointment &&
                getStatusBadge(selectedAppointment.status)}
            </div>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Patient Name
                      </p>
                      <p className="font-medium">
                        {selectedAppointment.patient.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">
                        {selectedAppointment.patient.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Service Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">
                      {selectedAppointment.service.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">
                      {formatPrice(selectedAppointment.service.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Schedule */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Appointment Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(selectedAppointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {selectedAppointment.timeSlot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dentist Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Assigned Dentist
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dentist</p>
                    <p className="font-medium">
                      Dr. {selectedAppointment.dentist.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedAppointment.payment && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Status
                      </p>
                      <div className="mt-1">
                        {getPaymentBadge(selectedAppointment.payment.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        ₱{selectedAppointment.payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Special Requests / Notes
                  </h3>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {/* Admin Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedAppointment.status === "pending" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const id = selectedAppointment.id;
                      setSelectedAppointment(null);
                      handleSingleAction(
                        () => confirmAppointments([id]),
                        "confirm appointment"
                      );
                    }}
                    disabled={isLoading}
                  >
                    Confirm Appointment
                  </Button>
                )}
                {(selectedAppointment.status === "pending" ||
                  selectedAppointment.status === "confirmed") && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAppointment(null);
                        toast.info("Reschedule feature coming soon");
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        const id = selectedAppointment.id;
                        setSelectedAppointment(null);
                        handleSingleAction(
                          () => cancelAppointments([id]),
                          "cancel appointment"
                        );
                      }}
                      disabled={isLoading}
                    >
                      Cancel Appointment
                    </Button>
                  </>
                )}
                {selectedAppointment.status === "confirmed" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const id = selectedAppointment.id;
                      setSelectedAppointment(null);
                      handleSingleAction(
                        () => completeAppointments([id]),
                        "mark as completed"
                      );
                    }}
                    disabled={isLoading}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Appointment Confirmation Dialog */}
      <Dialog
        open={!!appointmentToDelete}
        onOpenChange={() => setAppointmentToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {appointmentToDelete && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">
                    {appointmentToDelete.patient?.name || "Patient"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointmentToDelete.service?.name || "Service"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointmentToDelete.date).toLocaleDateString()}{" "}
                    {appointmentToDelete.timeSlot}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {appointmentToDelete.status}
                  </p>
                </div>
              </div>

              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                ⚠️ This will permanently delete the appointment and all
                associated data.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAppointmentToDelete(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAppointment}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
