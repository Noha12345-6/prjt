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
      <div className="p-6 space-y-6 bg-white rounded-xl shadow-md">
        {/* Header amélioré */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
              Team Members
            </h1>
            <Button 
              onClick={() => navigate("/members/add")} 
              className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Member
            </Button>
          </div>
  
          <div className="w-full max-w-sm relative">
            <Label htmlFor="searchInput" className="sr-only">Search members</Label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <Input
                id="searchInput"
                type="search"
                placeholder="Search members..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </header>
  
        {/* Filters améliorés */}
        <section className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <Label htmlFor="roleFilter" className="font-medium text-gray-700 text-sm">Filter by Role:</Label>
            <Select value={currentRoleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger id="roleFilter" className="w-[180px] bg-white">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md shadow-lg">
                <SelectItem value="all" className="hover:bg-gray-50">All roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role} className="hover:bg-gray-50">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          <div className="flex items-center space-x-2">
            <Label htmlFor="statusFilter" className="font-medium text-gray-700 text-sm">Filter by Status:</Label>
            <Select value={currentStatusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger id="statusFilter" className="w-[140px] bg-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md shadow-lg">
                <SelectItem value="all" className="hover:bg-gray-50">All statuses</SelectItem>
                <SelectItem value="active" className="hover:bg-gray-50">Active</SelectItem>
                <SelectItem value="inactive" className="hover:bg-gray-50">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
  
        {/* Table améliorée */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th 
                      key={header.id} 
                      className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
  
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">No members found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        key={cell.id} 
                        className="p-4 text-sm text-gray-700"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination améliorée */}
        {table.getPageCount() > 1 && (
          <footer className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
              <span className="font-medium">{members.length}</span> members
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="border-gray-300 hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="border-gray-300 hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
          </footer>
        )}
      </div>
    );
  }
