import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Calendar,
  TrendingUp,
  UserCheck,
  Clock,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: '2', label: 'Gestion de Membres', icon: Users },
    { id: '3', label: 'Gestion des taches', icon: BarChart3 },
    
  ];

  const statsCards: StatCardProps[] = [
    {
      title: 'Membres Actifs',
      value: '42',
      change: '+12%',
      trend: 'up' as const,
      icon: UserCheck,
      color: 'bg-blue-500'
    },
    {
      title: 'Projets Complétés',
      value: '18',
      change: '+8%',
      trend: 'up' as const,
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Temps Moyen',
      value: '2.4h',
      change: '-15%',
      trend: 'down' as const,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Score Performance',
      value: '94%',
      change: '+5%',
      trend: 'up' as const,
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { user: 'Marie Dupont', action: 'a complété le projet Alpha', time: 'il y a 2h' },
    { user: 'Pierre Martin', action: 'a rejoint l\'équipe Design', time: 'il y a 4h' },
    { user: 'Sophie Bernard', action: 'a mis à jour le rapport', time: 'il y a 6h' },
    { user: 'Thomas Dubois', action: 'a créé une nouvelle tâche', time: 'il y a 8h' }
  ];

  interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<any>;
    color: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <TrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500'} ${trend === 'down' ? 'rotate-180' : ''}`} />
        <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">TeamPulse</h2>
          </div>
        </div>
        
        <nav className="px-4 pb-4">
        {sidebarItems.map((item) => {
  const Icon = item.icon;
  return (
    <button
      key={item.id}
      onClick={() => {
        setActiveTab(item.id);
        if (item.id === '2') navigate('/members');
        else if (item.id === '3') navigate('/tasks');
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 mb-1 ${
        activeTab === item.id
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{item.label}</span>
    </button>
  );
})}


        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Bienvenue sur TeamPulse! Voici un aperçu de l'activité de votre équipe.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance de l'équipe</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>3 derniers mois</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-500">Graphique de performance</p>
                  <p className="text-sm text-gray-400">Les données seront affichées ici</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Voir toute l'activité
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Users className="w-4 h-4" />
                <span>Ajouter Membre</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <Target className="w-4 h-4" />
                <span>Nouveau Projet</span>
              </button>
              <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Voir Rapports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}