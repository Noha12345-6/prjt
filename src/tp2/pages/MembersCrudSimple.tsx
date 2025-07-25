import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Member } from '../types/member';

const emptyMember: Omit<Member, 'id'> = {
  name: '',
  email: '',
  role: '',
  status: 'active',
  joinDate: '',
  address: '',
  lat: 0,
  lng: 0,
};

export default function MembersCrudSimple() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Member, 'id'>>(emptyMember);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Charger la liste au montage
  useEffect(() => {
    setLoading(true);
    axios
      .get<Member[]>('https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande')
      .then((res) => setMembers(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Gérer le formulaire (ajout ou édition)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const { data } = await axios.put<Member>(
          `https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${editId}`,
          form
        );
        setMembers((prev) => prev.map((m) => (m.id === editId ? data : m)));
        setEditId(null);
      } else {
        const { data } = await axios.post<Member>(
          'https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande',
          form
        );
        setMembers((prev) => [...prev, data]);
      }
      setForm(emptyMember);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditId(member.id);
    setForm({ ...member });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce membre ?')) return;
    await axios.delete(`https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande/${id}`);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm(emptyMember);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CRUD Membres (sans hook custom)</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
        <div className="flex gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nom"
            className="border px-2 py-1 rounded w-1/3"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-2 py-1 rounded w-1/3"
            required
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Rôle"
            className="border px-2 py-1 rounded w-1/3"
            required
          />
        </div>
        <div className="flex gap-2">
          <input
            name="status"
            value={form.status}
            onChange={handleChange}
            placeholder="Statut"
            className="border px-2 py-1 rounded w-1/4"
            required
          />
          <input
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            placeholder="Date d'adhésion"
            type="date"
            className="border px-2 py-1 rounded w-1/4"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Adresse"
            className="border px-2 py-1 rounded w-1/2"
            required
          />
        </div>
        <div className="flex gap-2">
          <input
            name="lat"
            value={form.lat}
            onChange={handleChange}
            placeholder="Latitude"
            type="number"
            step="any"
            className="border px-2 py-1 rounded w-1/2"
            required
          />
          <input
            name="lng"
            value={form.lng}
            onChange={handleChange}
            placeholder="Longitude"
            type="number"
            step="any"
            className="border px-2 py-1 rounded w-1/2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={saving}
        >
          {editId ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border border-gray-300"
            onClick={() => { setEditId(null); setForm(emptyMember); }}
          >
            Annuler
          </button>
        )}
      </form>
      <h2 className="text-xl font-semibold mb-2">Liste des membres</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Rôle</th>
              <th className="border px-2 py-1">Statut</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="even:bg-gray-50">
                <td className="border px-2 py-1">{m.name}</td>
                <td className="border px-2 py-1">{m.email}</td>
                <td className="border px-2 py-1">{m.role}</td>
                <td className="border px-2 py-1">{m.status}</td>
                <td className="border px-2 py-1">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEdit(m)}
                  >
                    Éditer
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(m.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 