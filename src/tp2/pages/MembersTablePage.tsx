import { useEffect, useMemo, useState } from 'react';
import { type Member } from '../types/member';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export default function MembersTablePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get<Member[]>(
          'https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande'
        );
        setMembers(data);
      } catch (err) {
        setError('Erreur lors du chargement des membres');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    try {
      await axios.delete(
        `https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${id}`
      );
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const handleEdit = (member: Member) => {
    setEditId(member.id);
    setEditForm({ ...member });
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      const { data } = await axios.put<Member>(
        `https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${editId}`,
        editForm
      );
      setMembers((prev) => prev.map((m) => (m.id === editId ? data : m)));
      setEditId(null);
      setEditForm({});
    } catch (err) {
      setError('Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Nom' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'role', header: 'Rôle' },
      { 
        accessorKey: 'status', 
        header: 'Statut',
        cell: ({ getValue }: any) => {
          const status = getValue();
          return (
            <span className={`px-2 py-1 rounded-full text-xs ${
              status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          );
        }
      },
      { accessorKey: 'address', header: 'Adresse' },
      { 
        accessorKey: 'lat', 
        header: 'Position',
        cell: ({ row }: any) => (
          <span>
            {row.original.lat}, {row.original.lng}
          </span>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => {
          const member = row.original;
          return editId === member.id ? (
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={handleEditSave}
              >
                Sauver
              </button>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setEditId(null)}
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => handleEdit(member)}
              >
                Éditer
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Membres</h1>
          <p className="text-gray-600">Liste des membres de l'organisation</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => navigate('/tp2/members-add')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Ajouter un membre
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {editId === row.original.id && cell.column.id !== 'actions' ? (
                          <input
                            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {members.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Aucun membre trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}