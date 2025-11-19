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
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
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
import { CreatePatientForm } from "@/components/admin/create-patient-form";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deletePatient } from "@/lib/actions/admin-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  medicalHistory: string | null;
  createdAt: Date;
  appointmentsAsPatient: Array<{
    id: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
  }>;
};

const columns: ColumnDef<Patient>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <IconMail className="size-3" />
          <span className="text-xs">{row.original.email}</span>
        </div>
        {row.original.phone && (
          <div className="flex items-center gap-1 text-sm">
            <IconPhone className="size-3" />
            <span className="text-xs">{row.original.phone}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) =>
      row.original.dateOfBirth
        ? new Date(row.original.dateOfBirth).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "appointments",
    header: "Appointments",
    cell: ({ row }) => row.original.appointmentsAsPatient.length,
  },
  {
    accessorKey: "totalSpent",
    header: () => <div className="text-right">Total Spent</div>,
    cell: ({ row }) => {
      const totalSpent = row.original.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      return <div className="text-right">₱{totalSpent.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => toast.info("View details feature coming soon")}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.info("Edit feature coming soon")}
          >
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.info("View history feature coming soon")}
          >
            View History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              // Will be handled by parent component
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type AdminPatientsTableProps = {
  patients: Patient[];
};

export function AdminPatientsTable({ patients }: AdminPatientsTableProps) {
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
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [patientToDelete, setPatientToDelete] =
    React.useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] =
    React.useState<Patient | null>(null);

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;

    setIsLoading(true);
    try {
      const result = await deletePatient(patientToDelete.id);
      if (result.success) {
        toast.success(result.message);
        setPatientToDelete(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete patient");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const actionsColumn: ColumnDef<Patient> = {
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
            onClick={() => setSelectedPatient(row.original)}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedPatient(row.original);
              // Edit will be handled in the details dialog
            }}
          >
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedPatient(row.original);
              // History will be shown in the details dialog
            }}
          >
            View History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setPatientToDelete(row.original)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };

  const columnsWithActions = [...columns.slice(0, -1), actionsColumn];

  const table = useReactTable({
    data: patients,
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

  const handleCreateSuccess = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            size="sm"
            className="gap-2"
          >
            <IconPlus className="size-4" />
            Create Patient
          </Button>
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
      </div>

      {/* Bulk Actions Toolbar */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
          <span className="text-sm font-medium">
            {table.getFilteredSelectedRowModel().rows.length} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              Send Email
            </Button>
            <Button variant="outline" size="sm">
              Send SMS
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  More Actions
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export Selected</DropdownMenuItem>
                <DropdownMenuItem>Add to Group</DropdownMenuItem>
                <DropdownMenuItem>Send Appointment Reminder</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
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
                  No patients found.
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

      {/* Patient Details Dialog */}
      <Dialog
        open={!!selectedPatient}
        onOpenChange={() => setSelectedPatient(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Patient Details</DialogTitle>
            <DialogDescription>
              Patient ID: {selectedPatient?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedPatient.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{selectedPatient.email}</p>
                      </div>
                    </div>
                    {selectedPatient.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedPatient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedPatient.dateOfBirth && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p className="font-medium">
                            {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedPatient.medicalHistory && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Medical History</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {selectedPatient.medicalHistory}
                      </p>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-2xl font-bold">
                        {selectedPatient.appointmentsAsPatient.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Appointments</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-2xl font-bold">
                        {selectedPatient.appointmentsAsPatient.filter(
                          (apt) => apt.status === "completed"
                        ).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-2xl font-bold">
                        ₱{selectedPatient.payments
                          .reduce((sum, payment) => sum + payment.amount, 0)
                          .toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <FieldContent>
                      <Input
                        defaultValue={selectedPatient.name}
                        placeholder="Full Name"
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        defaultValue={selectedPatient.email}
                        placeholder="Email"
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <FieldContent>
                      <Input
                        defaultValue={selectedPatient.phone || ""}
                        placeholder="Phone"
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <FieldContent>
                      <Input
                        type="date"
                        defaultValue={
                          selectedPatient.dateOfBirth
                            ? new Date(selectedPatient.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Medical History</FieldLabel>
                    <FieldContent>
                      <Textarea
                        defaultValue={selectedPatient.medicalHistory || ""}
                        placeholder="Medical history..."
                        rows={4}
                      />
                    </FieldContent>
                  </Field>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.info("Edit functionality will be implemented with API endpoint");
                      setSelectedPatient(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Appointment History
                  </h3>
                  {selectedPatient.appointmentsAsPatient.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No appointments found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatient.appointmentsAsPatient.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">Appointment #{apt.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {apt.status}
                            </p>
                          </div>
                          <Badge
                            variant={
                              apt.status === "completed"
                                ? "default"
                                : apt.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Payment History
                  </h3>
                  {selectedPatient.payments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No payments found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatient.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">Payment #{payment.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₱{payment.amount.toFixed(2)}
                            </p>
                          </div>
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Patient Dialog */}
      <CreatePatientForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Patient Confirmation Dialog */}
      <Dialog
        open={!!patientToDelete}
        onOpenChange={() => setPatientToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {patientToDelete && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{patientToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patientToDelete.email}
                  </p>
                  {patientToDelete.phone && (
                    <p className="text-sm text-muted-foreground">
                      {patientToDelete.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                ⚠️ This will permanently delete the patient and all associated
                data including appointments and payment history.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPatientToDelete(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePatient}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Patient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
