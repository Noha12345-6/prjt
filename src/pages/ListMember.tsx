import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Edit } from "lucide-react";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: "active" | "inactive";
}

const defaultData: Member[] = [
  { id: 1, name: "Alice Johnson", email: "alice@mail.com", role: "Developer", joinDate: "2022-01-15", status: "active" },
  { id: 2, name: "Bob Smith", email: "bob@mail.com", role: "Designer", joinDate: "2021-11-03", status: "active" },
  { id: 3, name: "Charlie Brown", email: "charlie@mail.com", role: "Developer", joinDate: "2023-02-20", status: "active" },
  { id: 4, name: "Diana Prince", email: "diana@mail.com", role: "Manager", joinDate: "2020-05-10", status: "inactive" },
  { id: 5, name: "Evan Wright", email: "evan@mail.com", role: "QA Engineer", joinDate: "2023-04-01", status: "active" },
  { id: 6, name: "Fiona Green", email: "fiona@mail.com", role: "Product Owner", joinDate: "2022-08-22", status: "active" },
];

export default function MembersList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem("members");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  const handleDeleteMember = (id: number) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
  };

  const handleEditMember = (id: number) => {
    navigate(`/members/edit/${id}`);
  };

  const columns = useMemo<ColumnDef<Member>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <span className="font-semibold">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <a href={`mailto:${info.getValue()}`} className="text-blue-600 hover:underline">
          {info.getValue() as string}
        </a>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue() as string;
        const roleColors: Record<string, string> = {
          Developer: "bg-blue-100 text-blue-800",
          Designer: "bg-purple-100 text-purple-800",
          Manager: "bg-green-100 text-green-800",
          "QA Engineer": "bg-yellow-100 text-yellow-800",
          "Product Owner": "bg-indigo-100 text-indigo-800",
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
            {role}
          </span>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string | undefined;
        const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
        const badgeClass = status === "active" 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800";
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEditMember(member.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4 text-blue-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteMember(member.id)}
                className="flex items-center gap-2 cursor-pointer text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: members,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const uniqueRoles = useMemo(() => {
    const roles = new Set(members.map((member) => member.role));
    return Array.from(roles).sort();
  }, [members]);

  const handleRoleFilterChange = (role: string) => {
    setColumnFilters((filters) =>
      role === "all" ? filters.filter((f) => f.id !== "role") : [
        ...filters.filter((f) => f.id !== "role"),
        { id: "role", value: role },
      ]
    );
  };

  const handleStatusFilterChange = (status: string) => {
    setColumnFilters((filters) =>
      status === "all" ? filters.filter((f) => f.id !== "status") : [
        ...filters.filter((f) => f.id !== "status"),
        { id: "status", value: status },
      ]
    );
  };

  const currentRoleFilter = (columnFilters.find((f) => f.id === "role")?.value as string) || "all";
  const currentStatusFilter = (columnFilters.find((f) => f.id === "status")?.value as string) || "all";

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <Button onClick={() => navigate("/members/add")} className="bg-blue-600 hover:bg-blue-700">
            Add Member
          </Button>
        </div>

        <div className="w-full max-w-sm">
          <Label htmlFor="searchInput" className="sr-only">Search members</Label>
          <Input
            id="searchInput"
            type="search"
            placeholder="Search members..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-6 bg-gray-50 p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Label htmlFor="roleFilter" className="font-medium text-gray-700">Role:</Label>
          <Select value={currentRoleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger id="roleFilter" className="w-[180px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="statusFilter" className="font-medium text-gray-700">Status:</Label>
          <Select value={currentStatusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger id="statusFilter" className="w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left text-sm font-semibold text-gray-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <footer className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of {members.length} members
          </p>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => table.previousPage()} 
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => table.nextPage()} 
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}