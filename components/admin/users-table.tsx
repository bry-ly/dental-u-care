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
  IconShield,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { User as UserIcon, Mail, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  updateUserEmailVerification,
  deleteUsers,
  deleteUser,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
};

const getRoleBadge = (role?: string) => {
  const roleConfig: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: React.ReactNode;
    }
  > = {
    admin: { variant: "destructive", icon: <IconShield className="size-3" /> },
    dentist: { variant: "default", icon: <IconUserCheck className="size-3" /> },
    patient: { variant: "secondary", icon: <IconUser className="size-3" /> },
  };

  const config =
    roleConfig[role?.toLowerCase() || "patient"] || roleConfig.patient;

  return (
    <Badge variant={config.variant} className="text-xs gap-1">
      {config.icon}
      {role || "Patient"}
    </Badge>
  );
};

const columns: ColumnDef<User>[] = [
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
      <div className="flex items-center gap-2">
        {row.original.image ? (
          <Image
            src={row.original.image}
            alt={row.original.name}
            className="size-8 rounded-full object-cover"
            width={32}
            height={32}
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <IconUser className="size-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => getRoleBadge(row.original.role),
  },
  {
    accessorKey: "emailVerified",
    header: "Email Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.emailVerified ? "default" : "secondary"}
        className="text-xs"
      >
        {row.original.emailVerified ? "Verified" : "Unverified"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
];

type AdminUsersTableProps = {
  users: User[];
};

export function AdminUsersTable({ users }: AdminUsersTableProps) {
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
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [changeRoleUser, setChangeRoleUser] = React.useState<User | null>(null);
  const [newRole, setNewRole] = React.useState<string>("");
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  const [resetPasswordUser, setResetPasswordUser] = React.useState<User | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleChangeRole = async () => {
    if (!changeRoleUser || !newRole) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${changeRoleUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Role changed to ${newRole} successfully`);
        setChangeRoleUser(null);
        setNewRole("");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to change role");
      }
    } catch (error) {
      toast.error("Failed to change role");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkEmailVerification = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) {
      toast.error("No users selected");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserEmailVerification(ids, true);
      if (result.success) {
        toast.success(result.message);
        setRowSelection({});
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to verify emails");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) {
      toast.error("No users selected");
      return;
    }

    // Check if any admin is selected
    const hasAdmin = selectedRows.some((row) => row.original.role === "admin");
    if (hasAdmin) {
      toast.error("Cannot delete admin users");
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteUsers(ids);
      if (result.success) {
        toast.success(result.message);
        setRowSelection({});
        setShowBulkDeleteDialog(false);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete users");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteUser(userToDelete.id);
      if (result.success) {
        toast.success(result.message);
        setUserToDelete(null);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
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
        window.location.reload();
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

  const actionsColumn: ColumnDef<User> = {
    id: "actions",
    cell: ({ row }) => {
      const isAdmin = row.original.role === "admin";
      return (
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
            <DropdownMenuItem onClick={() => setSelectedUser(row.original)}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(row.original);
                // Edit will be handled in the details dialog
              }}
            >
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setChangeRoleUser(row.original);
                setNewRole(row.original.role || "patient");
              }}
            >
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!row.original.emailVerified && (
              <DropdownMenuItem
                onClick={() =>
                  handleSingleAction(
                    () => updateUserEmailVerification([row.original.id], true),
                    "verify email"
                  )
                }
              >
                Verify Email
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(row.original);
                // Reset password will be handled in the details dialog
              }}
            >
              Reset Password
            </DropdownMenuItem>
            {!isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setUserToDelete(row.original)}
                >
                  Delete User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columnsWithActions = [...columns, actionsColumn];

  const table = useReactTable({
    data: users,
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
            placeholder="Search users..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
              onClick={handleBulkEmailVerification}
            >
              Verify Emails
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => toast.info("Change role feature coming soon")}
            >
              Change Role
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
                  onClick={() =>
                    toast.info("Reset passwords feature coming soon")
                  }
                >
                  Reset Passwords
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast.info("Export feature coming soon")}
                >
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setShowBulkDeleteDialog(true)}
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
                  No users found.
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

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">User Profile</DialogTitle>
                <DialogDescription>
                  User ID: {selectedUser?.id}
                </DialogDescription>
              </div>
              {selectedUser && getRoleBadge(selectedUser.role)}
            </div>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit User</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Profile Picture & Basic Info */}
                <div className="flex items-center gap-4 pb-4 border-b">
                {selectedUser.image ? (
                  <Image
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="size-20 rounded-full object-cover"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="size-10 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant={
                        selectedUser.emailVerified ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {selectedUser.emailVerified
                        ? "✓ Email Verified"
                        : "Email Unverified"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email Address
                      </p>
                      <p className="font-medium text-sm break-all">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">
                        {selectedUser.role || "Patient"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member Since
                      </p>
                      <p className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
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

              {/* Account Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Account Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Email Verification
                    </p>
                    <p className="text-lg font-semibold">
                      {selectedUser.emailVerified
                        ? "Verified ✓"
                        : "Not Verified"}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Last Updated
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(selectedUser.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
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
                        defaultValue={selectedUser.name}
                        placeholder="Full Name"
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        defaultValue={selectedUser.email}
                        placeholder="Email"
                      />
                    </FieldContent>
                  </Field>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.info("Edit functionality will be implemented with API endpoint");
                      setSelectedUser(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResetPasswordUser(selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    Reset Password
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={!!resetPasswordUser}
        onOpenChange={() => {
          setResetPasswordUser(null);
          setNewPassword("");
          setConfirmPassword("");
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetPasswordUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </FieldContent>
            </Field>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResetPasswordUser(null);
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  toast.error("Passwords do not match");
                  return;
                }
                if (newPassword.length < 8) {
                  toast.error("Password must be at least 8 characters");
                  return;
                }
                toast.info("Reset password functionality will be implemented with API endpoint");
                setResetPasswordUser(null);
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={!!changeRoleUser}
        onOpenChange={() => setChangeRoleUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for <strong>{changeRoleUser?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label
              htmlFor="role-select"
              className="text-sm font-medium mb-2 block"
            >
              Select New Role
            </Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger id="role-select" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">
                  <div className="flex items-center gap-2">
                    <IconUser className="size-4" />
                    <span>Patient</span>
                  </div>
                </SelectItem>
                <SelectItem value="dentist">
                  <div className="flex items-center gap-2">
                    <IconUserCheck className="size-4" />
                    <span>Dentist</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <IconShield className="size-4" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {changeRoleUser?.role && (
              <p className="text-sm text-muted-foreground mt-2">
                Current role:{" "}
                <strong className="capitalize">{changeRoleUser.role}</strong>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeRoleUser(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={
                isLoading || !newRole || newRole === changeRoleUser?.role
              }
            >
              {isLoading ? "Changing..." : "Change Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {userToDelete && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {userToDelete.image ? (
                  <Image
                    src={userToDelete.image}
                    alt={userToDelete.name}
                    className="size-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-background">
                    <IconUser className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{userToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {userToDelete.email}
                  </p>
                  <div className="mt-1">{getRoleBadge(userToDelete.role)}</div>
                </div>
              </div>

              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                ⚠️ This will permanently delete the user and all associated
                data.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Multiple Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected users? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">
                {table.getFilteredSelectedRowModel().rows.length} user(s) will
                be deleted:
              </p>
              <div className="mt-3 max-h-[200px] overflow-y-auto space-y-2">
                {table.getFilteredSelectedRowModel().rows.map((row) => (
                  <div
                    key={row.original.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {row.original.image ? (
                      <Image
                        src={row.original.image}
                        alt={row.original.name}
                        className="size-8 rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-background">
                        <IconUser className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {row.original.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {row.original.email}
                      </p>
                    </div>
                    {getRoleBadge(row.original.role)}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
              ⚠️ This will permanently delete all selected users and their
              associated data.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              {isLoading
                ? "Deleting..."
                : `Delete ${table.getFilteredSelectedRowModel().rows.length} User(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
