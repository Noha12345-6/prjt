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
    const navigate=useNavigate();
  const getMemberName = (id: number) => {
    const member = members.find(m => m.id === id);
    return member ? member.name : "Unassigned";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          label: "Terminé"
        };
      case "in_progress":
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: PlayCircle,
          label: "En cours"
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200",
          text: "text-slate-700",
          badge: "bg-slate-100 text-slate-800 border-slate-200",
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
      transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl
      ${statusConfig.bg} hover:shadow-lg
      ${isOverdue ? 'border-red-200 bg-red-50' : ''}
    `}>
      {/* Indicateur de statut visuel */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        task.status === "done" ? "bg-emerald-500" :
        task.status === "in_progress" ? "bg-blue-500" :
        isOverdue ? "bg-red-500" : "bg-slate-400"
      }`} />
      
      {/* Boutons d'action - Version améliorée avec texte */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Bouton Éditer */}
        <button 
        onClick={(e) => {
          e.stopPropagation();
          if (task.id !== undefined) {
            navigate(`edit/${task.id}`);
          } else {
            console.error("Cannot edit task without ID");
            
          }
        }}
        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:bg-blue-50 transition-all
                  border border-gray-200 hover:border-blue-200
                  flex items-center justify-center"
        aria-label="Modifier la tâche"
      >
        <Edit2 className="w-4 h-4 text-blue-600" />
        <span className="ml-2 text-sm font-medium text-blue-600 hidden sm:inline">Éditer</span>
      </button>
        
        {/* Bouton Supprimer */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (task.id !== undefined) {
              onDelete?.(task.id);
            } else {
              console.error("Cannot delete task without ID");
            }
          }}
          className="p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:bg-red-50 transition-all
                    border border-gray-200 hover:border-red-200
                    flex items-center justify-center"
          aria-label="Supprimer la tâche"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
          <span className="ml-2 text-sm font-medium text-red-600 hidden sm:inline">Supprimer</span>
        </button>
      </div>

      {/* Header avec titre et badge de statut */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-semibold text-lg leading-tight pr-3 ${
          isOverdue && task.status !== "done" ? "text-red-800" : "text-slate-800"
        }`}>
          {task.title}
        </h3>
        <div className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
          transition-colors duration-200 whitespace-nowrap
          ${isOverdue && task.status !== "done" ? "bg-red-100 text-red-800 border-red-200" : statusConfig.badge}
        `}>
          <StatusIcon className="w-3.5 h-3.5" />
          {isOverdue && task.status !== "done" ? "En retard" : statusConfig.label}
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-sm leading-relaxed mb-4 ${
        isOverdue && task.status !== "done" ? "text-red-700" : "text-slate-600"
      }`}>
        {task.description}
      </p>
      
      {/* Footer avec assignation et date */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{getMemberName(task.memberId)}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 ${
          isOverdue && task.status !== "done" ? "text-red-600" : "text-slate-600"
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}