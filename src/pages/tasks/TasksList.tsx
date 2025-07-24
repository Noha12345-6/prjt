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
  Search,
  Filter,
  X,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  isActive: boolean;
  onClick: () => void;
  loading?: boolean;
}

export default function TasksList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

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
        toast.error("Échec du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate async loading
    const timer = setTimeout(() => loadData(), 800);
    return () => clearTimeout(timer);
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
      toast.success("Tâche supprimée avec succès", {
        action: {
          label: "Annuler",
          onClick: () => {
            // Optionnel: Implémenter la restauration de la tâche
          },
        },
      });
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

  const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    count, 
    icon: Icon, 
    color, 
    isActive, 
    onClick,
    loading = false
  }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
        isActive 
          ? `${color} border-transparent text-white shadow-lg` 
          : 'bg-card hover:bg-accent/50 border-border'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isActive ? 'text-white/90' : 'text-muted-foreground'
          }`}>
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-8 w-12 mt-1 bg-muted" />
          ) : (
            <p className={`text-2xl font-bold mt-1 ${
              isActive ? 'text-white' : 'text-foreground'
            }`}>
              {count}
            </p>
          )}
        </div>
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        ) : (
          <Icon className={`w-8 h-8 ${
            isActive ? 'text-white/90' : 'text-muted-foreground'
          }`} />
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('tasks.dashboardTitle')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('tasks.dashboardSubtitle')}
              </p>
            </div>
            <Button 
              asChild 
              className="shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
            >
              <Link to="/tasks/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{t('tasks.createTask')}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('tasks.allTasks')}
            count={taskCounts.all}
            icon={ListTodo}
            color="bg-primary"
            isActive={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            loading={isLoading}
          />
          <StatCard
            title={t('tasks.statusTodo')}
            count={taskCounts.todo}
            icon={Clock}
            color="bg-amber-500"
            isActive={statusFilter === "todo"}
            onClick={() => setStatusFilter("todo")}
            loading={isLoading}
          />
          <StatCard
            title={t('tasks.statusInProgress')}
            count={taskCounts.in_progress}
            icon={PlayCircle}
            color="bg-blue-500"
            isActive={statusFilter === "in_progress"}
            onClick={() => setStatusFilter("in_progress")}
            loading={isLoading}
          />
          <StatCard
            title={t('tasks.statusDone')}
            count={taskCounts.done}
            icon={CheckCircle2}
            color="bg-emerald-500"
            isActive={statusFilter === "done"}
            onClick={() => setStatusFilter("done")}
            loading={isLoading}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('tasks.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder={t('tasks.filterByStatus')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('tasks.allStatuses')}</SelectItem>
                  <SelectItem value="todo">{t('tasks.statusTodo')}</SelectItem>
                  <SelectItem value="in_progress">{t('tasks.statusInProgress')}</SelectItem>
                  <SelectItem value="done">{t('tasks.statusDone')}</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <ListTodo className="w-10 h-10 text-muted-foreground" />
              </div>
              {tasks.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('tasks.noneFound')}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    {t('tasks.noneFoundSubtitle')}
                  </p>
                  <Button asChild>
                    <Link to="/tasks/new" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      {t('tasks.createTask')}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('tasks.noResult')}
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    {t('tasks.noResultSubtitle')}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t('tasks.resetFilters')}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {statusFilter === "all" ? t('tasks.allTasks') : 
                     statusFilter === "todo" ? t('tasks.tasksTodo') :
                     statusFilter === "in_progress" ? t('tasks.tasksInProgress') :
                     t('tasks.tasksDone')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredTasks.length} {filteredTasks.length > 1 ? t('tasks.tasksPlural') : t('tasks.taskSingular')} {t('tasks.found')}
                  </p>
                </div>
                {statusFilter !== "all" && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setStatusFilter("all")}
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {t('tasks.seeAll')}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    members={members}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-destructive" />
              {t('tasks.confirmDelete')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              {t('tasks.confirmDeleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg flex items-center gap-2"
            >
              {t('tasks.deleteForever')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}