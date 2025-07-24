import type { TaskFormData } from "@/validation/schemasTask";
import type { MemberFormData } from "@/validation/schema";
import { useNavigate } from "react-router-dom";
import { Calendar, User, CheckCircle2, Clock, PlayCircle, Edit2, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: TaskFormData;
  members: MemberFormData[];
  onEdit?: (task: TaskFormData) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskCard({ task, members, onEdit, onDelete }: TaskCardProps) {
  const navigate = useNavigate();
  
  const getMemberName = (id: number) => {
    const member = members.find(m => m.id === id);
    return member ? member.name : "Unassigned";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
          text: "text-emerald-700 dark:text-emerald-400",
          badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700",
          icon: CheckCircle2,
          label: "Terminé"
        };
      case "in_progress":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-400",
          badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700",
          icon: PlayCircle,
          label: "En cours"
        };
      default:
        return {
          bg: "bg-muted border-border",
          text: "text-foreground/80",
          badge: "bg-muted text-foreground/70 border-border",
          icon: Clock,
          label: "À faire"
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";
  
  return (
    <div className={`
      group relative overflow-hidden rounded-xl border-2 p-5 
      transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg
      ${statusConfig.bg}
      ${isOverdue ? 'border-destructive/30 bg-destructive/5 dark:bg-destructive/10' : ''}
    `}>
      {/* Indicateur de statut visuel */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        task.status === "done" ? "bg-emerald-500 dark:bg-emerald-400" :
        task.status === "in_progress" ? "bg-blue-500 dark:bg-blue-400" :
        isOverdue ? "bg-destructive" : "bg-muted-foreground/50"
      }`} />
      
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (task.id !== undefined) {
              navigate(`edit/${task.id}`);
            } else {
              console.error("Cannot edit task without ID");
            }
          }}
          className="p-2 rounded-lg bg-background/90 backdrop-blur-sm shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all
                    border border-border hover:border-blue-300 dark:hover:border-blue-700
                    flex items-center justify-center"
          aria-label="Modifier la tâche"
        >
          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400 hidden sm:inline">Éditer</span>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (task.id !== undefined) {
              onDelete?.(task.id);
            } else {
              console.error("Cannot delete task without ID");
            }
          }}
          className="p-2 rounded-lg bg-background/90 backdrop-blur-sm shadow-sm hover:bg-destructive/10 transition-all
                    border border-border hover:border-destructive/50
                    flex items-center justify-center"
          aria-label="Supprimer la tâche"
        >
          <Trash2 className="w-4 h-4 text-destructive dark:text-destructive-foreground" />
          <span className="ml-2 text-sm font-medium text-destructive dark:text-destructive-foreground hidden sm:inline">Supprimer</span>
        </button>
      </div>

      {/* Header avec titre et badge de statut */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-semibold text-lg leading-tight pr-3 ${
          isOverdue && task.status !== "done" ? "text-destructive dark:text-destructive-foreground" : "text-foreground"
        }`}>
          {task.title}
        </h3>
        <div className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
          transition-colors duration-200 whitespace-nowrap
          ${isOverdue && task.status !== "done" ? 
            "bg-destructive/10 text-destructive dark:text-destructive-foreground border-destructive/20" : 
            statusConfig.badge}
        `}>
          <StatusIcon className="w-3.5 h-3.5" />
          {isOverdue && task.status !== "done" ? "En retard" : statusConfig.label}
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-sm leading-relaxed mb-4 ${
        isOverdue && task.status !== "done" ? "text-destructive/90 dark:text-destructive-foreground/80" : "text-muted-foreground"
      }`}>
        {task.description}
      </p>
      
      {/* Footer avec assignation et date */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-medium">{getMemberName(task.memberId)}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 ${
          isOverdue && task.status !== "done" ? "text-destructive dark:text-destructive-foreground" : "text-muted-foreground"
        }`}>
          <Calendar className="w-4 h-4" />
          <span className="font-medium">
            {new Date(task.dueDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
      
      {/* Effet de hover subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}