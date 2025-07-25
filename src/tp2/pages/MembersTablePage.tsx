import { useEffect, useMemo, useState } from 'react';
import { type Member } from '../types/member';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type CellContext,
  type Row,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, UserCheck, UserX } from 'lucide-react';

export default function MembersTablePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get<Member[]>('https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande')
      .then((res) => setMembers(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Supprimer un membre
  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce membre ?')) return;
    await axios.delete(`https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${id}`);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Commencer l'édition
  const handleEdit = (member: Member) => {
    setEditId(member.id);
    setEditForm({ ...member });
  };

  // Sauvegarder l'édition
  const handleEditSave = async () => {
    if (!editId) return;
    const { data } = await axios.put<Member>(
      `https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${editId}`,
      editForm
    );
    setMembers((prev) => prev.map((m) => (m.id === editId ? data : m)));
    setEditId(null);
    setEditForm({});
  };

  // Badges status et rôle
  const StatusBadge = ({ status }: { status: string }) => {
    const isActive = status === 'active';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
        isActive 
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
      }`}>
        {isActive ? (
          <UserCheck className="w-3 h-3 mr-1" />
        ) : (
          <UserX className="w-3 h-3 mr-1" />
        )}
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const RoleBadge = ({ role }: { role: string }) => {
    const roleColors: Record<string, string> = {
      'Developer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Designer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Manager': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'QA Engineer': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Product Owner': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        roleColors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      }`}>
        {role}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Membre',
        cell: (ctx: CellContext<Member, unknown>) => {
          const member = ctx.row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {getInitials(member.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground truncate">
                  {member.name}
                </div>
                <div className="text-sm text-muted-foreground flex items-center truncate">
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>
          );
        }
      },
      { 
        accessorKey: 'role', 
        header: 'Rôle',
        cell: (ctx: CellContext<Member, unknown>) => <RoleBadge role={ctx.getValue() as string} />
      },
      { 
        accessorKey: 'status', 
        header: 'Statut',
        cell: (ctx: CellContext<Member, unknown>) => <StatusBadge status={ctx.getValue() as string} />
      },
      { 
        accessorKey: 'address', 
        header: 'Localisation',
        cell: (ctx: CellContext<Member, unknown>) => {
          const member = ctx.row.original;
          return (
            <div className="max-w-xs">
              <div className="text-sm text-foreground flex items-start">
                <MapPin className="w-3 h-3 mr-1 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="line-clamp-2">{member.address}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 ml-4">
                {member.lat}, {member.lng}
              </div>
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (ctx: CellContext<Member, unknown>) => {
          const member = ctx.row.original;
          return editId === member.id ? (
            <div className="flex gap-2">
              <button
                className="text-green-600 hover:underline"
                onClick={handleEditSave}
              >
                Sauver
              </button>
              <button
                className="text-gray-600 hover:underline"
                onClick={() => setEditId(null)}
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(member)}
              >
                Éditer
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(member.id)}
              >
                Supprimer
              </button>
            </div>
          );
        },
      },
    ],
    [editId, editForm]
  );

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-xl shadow-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Liste des membres (API)</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          onClick={() => navigate('/tp2/members-add')}
        >
          Ajouter
        </button>
      </div>
      {loading ? (
        <div className="text-muted-foreground">Chargement...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border text-sm bg-card rounded-lg overflow-hidden">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted dark:bg-muted">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border-b border-border px-2 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted dark:bg-muted">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="even:bg-muted/50 hover:bg-accent/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-2 text-foreground border-b border-border">
                      {editId === row.original.id && cell.column.id !== 'actions' ? (
                        <input
                          className="border px-1 py-0.5 rounded w-full bg-background text-foreground"
                          value={editForm[cell.column.id as keyof Member] ?? ''}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              [cell.column.id]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}