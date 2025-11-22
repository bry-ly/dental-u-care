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
import { User, Mail, Phone, Calendar, Award, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateDentistAvailability,
  deleteDentist,
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
import { CreateDentistForm } from "@/components/admin/create-dentist-form";
import { IconPlus } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Dentist = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  qualifications: string | null;
  experience: string | null;
  isAvailable: boolean;
  createdAt: Date;
  appointmentsAsDentist: Array<{
    id: string;
    status: string;
  }>;
};

const columns: ColumnDef<Dentist>[] = [
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
    cell: ({ row }) => (
      <div>
        <p className="font-medium">Dr. {row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => row.original.specialization || "-",
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => row.original.experience || "-",
  },
  {
    accessorKey: "appointments",
    header: "Appointments",
    cell: ({ row }) => {
      const appointmentCount = row.original.appointmentsAsDentist.length;
      const completedCount = row.original.appointmentsAsDentist.filter(
        (apt) => apt.status === "completed"
      ).length;
      return (
        <div className="text-sm">
          <p>{appointmentCount} total</p>
          <p className="text-xs text-muted-foreground">
            {completedCount} completed
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isAvailable ? "default" : "secondary"}
        className="text-xs"
      >
        {row.original.isAvailable ? "Available" : "Unavailable"}
      </Badge>
    ),
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
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Profile</DropdownMenuItem>
          <DropdownMenuItem>View Schedule</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type AdminDentistsTableProps = {
  dentists: Dentist[];
};

export function AdminDentistsTable({ dentists }: AdminDentistsTableProps) {
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
  const [selectedDentist, setSelectedDentist] = React.useState<Dentist | null>(
    null
  );

  // Initialize edit form data when dentist is selected
  React.useEffect(() => {
    if (selectedDentist) {
      setEditFormData({
        name: selectedDentist.name,
        email: selectedDentist.email,
        phone: selectedDentist.phone || "",
        specialization: selectedDentist.specialization || "",
        qualifications: selectedDentist.qualifications || "",
        experience: selectedDentist.experience || "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
    }
  }, [selectedDentist]);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [dentistToDelete, setDentistToDelete] =
    React.useState<Dentist | null>(null);
  const [editFormData, setEditFormData] = React.useState<{
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualifications: string;
    experience: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleBulkAvailability = async (isAvailable: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) {
      toast.error("No dentists selected");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateDentistAvailability(ids, isAvailable);
      if (result.success) {
        toast.success(result.message);
        setRowSelection({});
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to update availability`);
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

  const confirmDeleteDentist = async () => {
    if (!dentistToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteDentist(dentistToDelete.id);
      if (result.success) {
        toast.success(result.message);
        setDentistToDelete(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete dentist");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const actionsColumn: ColumnDef<Dentist> = {
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
          <DropdownMenuItem onClick={() => setSelectedDentist(row.original)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedDentist(row.original)}
          >
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedDentist(row.original)}
          >
            View Schedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              handleSingleAction(
                () =>
                  updateDentistAvailability(
                    [row.original.id],
                    !row.original.isAvailable
                  ),
                row.original.isAvailable ? "set unavailable" : "set available"
              )
            }
          >
            {row.original.isAvailable ? "Set Unavailable" : "Set Available"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDentistToDelete(row.original)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };

  const columnsWithActions = [...columns.slice(0, -1), actionsColumn];

  const table = useReactTable({
    data: dentists,
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
            placeholder="Search dentists..."
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
            Create Dentist
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
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleBulkAvailability(true)}
            >
              Set Available
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleBulkAvailability(false)}
            >
              Set Unavailable
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
                    toast.info("Send notification feature coming soon")
                  }
                >
                  Send Notification
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast.info("Export feature coming soon")}
                >
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast.info("Schedule feature coming soon")}
                >
                  View Schedules
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to deactivate these dentists?"
                      )
                    ) {
                      handleBulkAvailability(false);
                    }
                  }}
                >
                  Deactivate Selected
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
                  No dentists found.
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

      {/* Dentist Details Dialog */}
      <Dialog
        open={!!selectedDentist}
        onOpenChange={() => setSelectedDentist(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">Dentist Details</DialogTitle>
                <DialogDescription>ID: {selectedDentist?.id}</DialogDescription>
              </div>
              {selectedDentist && (
                <Badge
                  variant={
                    selectedDentist.isAvailable ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedDentist.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedDentist && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
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
                      <p className="font-medium">Dr. {selectedDentist.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">
                        {selectedDentist.email}
                      </p>
                    </div>
                  </div>
                  {selectedDentist.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedDentist.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(selectedDentist.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedDentist.specialization && (
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Specialization
                        </p>
                        <p className="font-medium">
                          {selectedDentist.specialization}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedDentist.experience && (
                    <div className="flex items-start gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experience
                        </p>
                        <p className="font-medium">
                          {selectedDentist.experience}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {selectedDentist.qualifications && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      Qualifications
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {selectedDentist.qualifications}
                    </p>
                  </div>
                )}
              </div>

              {/* Appointment Statistics */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Appointment Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl font-bold">
                      {selectedDentist.appointmentsAsDentist.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Appointments
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl font-bold">
                      {
                        selectedDentist.appointmentsAsDentist.filter(
                          (apt) => apt.status === "completed"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl font-bold">
                      {
                        selectedDentist.appointmentsAsDentist.filter(
                          (apt) =>
                            apt.status === "pending" ||
                            apt.status === "confirmed"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </div>

              </TabsContent>

              <TabsContent value="edit" className="space-y-4 mt-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedDentist) return;

                    setIsSaving(true);
                    try {
                      // Validate passwords if provided
                      if (editFormData.password) {
                        if (editFormData.password !== editFormData.confirmPassword) {
                          toast.error("Passwords don't match", {
                            description: "Please make sure both passwords are the same.",
                          });
                          setIsSaving(false);
                          return;
                        }

                        if (editFormData.password.length < 8) {
                          toast.error("Password too short", {
                            description: "Password must be at least 8 characters long.",
                          });
                          setIsSaving(false);
                          return;
                        }
                      }

                      const response = await fetch(
                        `/api/admin/dentists/${selectedDentist.id}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: editFormData.name,
                            email: editFormData.email,
                            phone: editFormData.phone || null,
                            specialization: editFormData.specialization || null,
                            qualifications: editFormData.qualifications || null,
                            experience: editFormData.experience || null,
                            password: editFormData.password || undefined,
                            confirmPassword: editFormData.confirmPassword || undefined,
                          }),
                        }
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        toast.error("Failed to update dentist", {
                          description: data.error || "Please try again.",
                        });
                        return;
                      }

                      toast.success("Dentist updated successfully!");
                      setSelectedDentist(null);
                      router.refresh();
                    } catch (error) {
                      console.error("Error updating dentist:", error);
                      toast.error("An unexpected error occurred", {
                        description: "Please try again later.",
                      });
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                >
                  <div className="space-y-4">
                    <Field>
                      <FieldLabel>Full Name</FieldLabel>
                      <FieldContent>
                        <Input
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Full Name"
                          required
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Email"
                          required
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <FieldContent>
                        <Input
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Phone"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Specialization</FieldLabel>
                      <FieldContent>
                        <Input
                          value={editFormData.specialization}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              specialization: e.target.value,
                            }))
                          }
                          placeholder="Specialization"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Experience (Years)</FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          value={editFormData.experience}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              experience: e.target.value,
                            }))
                          }
                          placeholder="Experience"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Qualifications</FieldLabel>
                      <FieldContent>
                        <Textarea
                          value={editFormData.qualifications}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              qualifications: e.target.value,
                            }))
                          }
                          placeholder="Qualifications..."
                          rows={4}
                        />
                      </FieldContent>
                    </Field>

                    <div className="border-t pt-4 space-y-4">
                      <div className="text-sm font-medium">Change Password (Optional)</div>
                      <Field>
                        <FieldLabel>New Password</FieldLabel>
                        <FieldContent>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={editFormData.password}
                              onChange={(e) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              placeholder="Leave empty to keep current password"
                              minLength={8}
                            />
                            <button
                              type="button"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 text-sm opacity-70 hover:opacity-100"
                            >
                              {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                          </div>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Confirm Password</FieldLabel>
                        <FieldContent>
                          <Input
                            type="password"
                            value={editFormData.confirmPassword}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Confirm new password"
                            minLength={8}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedDentist(null);
                        setEditFormData({
                          name: "",
                          email: "",
                          phone: "",
                          specialization: "",
                          qualifications: "",
                          experience: "",
                          password: "",
                          confirmPassword: "",
                        });
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Appointment Schedule
                  </h3>
                  {selectedDentist.appointmentsAsDentist.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No appointments scheduled
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDentist.appointmentsAsDentist.map((apt) => (
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
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dentist Dialog */}
      <CreateDentistForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Dentist Confirmation Dialog */}
      <Dialog
        open={!!dentistToDelete}
        onOpenChange={() => setDentistToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Dentist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dentist? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {dentistToDelete && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Dr. {dentistToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {dentistToDelete.email}
                  </p>
                  {dentistToDelete.phone && (
                    <p className="text-sm text-muted-foreground">
                      {dentistToDelete.phone}
                    </p>
                  )}
                  {dentistToDelete.specialization && (
                    <p className="text-sm text-muted-foreground">
                      {dentistToDelete.specialization}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                ⚠️ This will permanently delete the dentist and all associated
                data including appointments.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDentistToDelete(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDentist}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Dentist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
