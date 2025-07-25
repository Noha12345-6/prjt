import { useState } from 'react';
import axios from 'axios';
import type { Member } from '../types/member';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MemberRoles } from '../../validation/schema';

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

export default function AddMemberPage() {
  const [form, setForm] = useState<Omit<Member, 'id'>>(emptyMember);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post<Member>(
        'https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp/demande',
        form
      );
      toast.success('Membre ajouté avec succès !');
      navigate('/tp2/members-table');
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'ajout du membre");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-xl shadow-lg border border-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter un nouveau membre</h1>
        <p className="text-muted-foreground">Remplissez le formulaire pour ajouter un membre à votre organisation</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-8 space-y-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jean.dupont@example.com"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Sélectionner un rôle</option>
              {MemberRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          <div>
            <label htmlFor="joinDate" className="block text-sm font-medium text-foreground mb-1">
              Date d'adhésion <span className="text-red-500">*</span>
            </label>
            <input
              id="joinDate"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              type="date"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Rue de la Paix, Paris"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-foreground mb-1">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              id="lat"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              placeholder="48.8566"
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-foreground mb-1">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              id="lng"
              name="lng"
              value={form.lng}
              onChange={handleChange}
              placeholder="2.3522"
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/tp2/members-table')}
            className="px-6 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
          >
            Retour à la liste
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Ajouter le membre'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}