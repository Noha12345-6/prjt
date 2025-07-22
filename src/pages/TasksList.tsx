import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/component/TaskCard";
import type { TaskFormData } from "@/validation/schemasTask";
import type { MemberFormData } from "@/validation/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  ListTodo,
  Filter,
  Search,
  Calendar,
  Users
} from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TasksList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Charger les tâches et membres
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTasks = localStorage.getItem("tasks");
        const savedMembers = localStorage.getItem("members");

        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedMembers) setMembers(JSON.parse(savedMembers));
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  // Sauvegarder les tâches quand elles changent
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleEditTask = (task: TaskFormData) => {
    navigate(`/tasks/edit/${task.id}`);
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete));
      toast.success("Task deleted successfully");
    }
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const getTaskCountByStatus = () => {
    return {
      all: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      in_progress: tasks.filter(t => t.status === "in_progress").length,
      done: tasks.filter(t => t.status === "done").length,
    };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const taskCounts = getTaskCountByStatus();

  const StatCard: React.FC<StatCardProps> = ({ title, count, icon: Icon, color, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border transition-all duration-200 text-left w-full ${
        isActive 
          ? `${color} text-white shadow-md transform scale-105` 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isActive ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
            {count}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${isActive ? 'text-white/80' : 'text-gray-400'}`} />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Tâches</h1>
              <p className="text-gray-600 mt-2">
                Organisez et suivez toutes vos tâches en un seul endroit
              </p>
            </div>
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/tasks/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Nouvelle Tâche</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toutes les tâches"
            count={taskCounts.all}
            icon={ListTodo}
            color="bg-gray-600"
            isActive={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatCard
            title="À faire"
            count={taskCounts.todo}
            icon={Clock}
            color="bg-orange-500"
            isActive={statusFilter === "todo"}
            onClick={() => setStatusFilter("todo")}
          />
          <StatCard
            title="En cours"
            count={taskCounts.in_progress}
            icon={PlayCircle}
            color="bg-blue-500"
            isActive={statusFilter === "in_progress"}
            onClick={() => setStatusFilter("in_progress")}
          />
          <StatCard
            title="Terminées"
            count={taskCounts.done}
            icon={CheckCircle2}
            color="bg-green-500"
            isActive={statusFilter === "done"}
            onClick={() => setStatusFilter("done")}
          />
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des tâches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assigné
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des tâches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ListTodo className="w-12 h-12 text-gray-400" />
              </div>
              {tasks.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune tâche trouvée
                  </h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    Créez votre première tâche pour commencer à organiser votre travail
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/tasks/new" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Créer une tâche
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun résultat
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Aucune tâche ne correspond à vos critères de recherche
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {statusFilter === "all" ? "Toutes les tâches" : 
                   statusFilter === "todo" ? "Tâches à faire" :
                   statusFilter === "in_progress" ? "Tâches en cours" :
                   "Tâches terminées"} ({filteredTasks.length})
                </h2>
                {statusFilter !== "all" && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setStatusFilter("all")}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Voir toutes
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                {filteredTasks.map(task => (
                  <div key={task.id} className="border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <TaskCard
                      task={task}
                      members={members}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Cette action ne peut pas être annulée. La tâche sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTask}
              className="bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}