import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { taskFormSchema } from "@/validation/schemasTask";
import type { TaskFormData } from "@/validation/schemasTask";
import type { MemberFormData } from "@/validation/schema";
import EditTaskForm from "../../component/EditTaskForm";

export default function EditTaskContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskFormData | null>(null);
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTasks = localStorage.getItem("tasks");
        const savedMembers = localStorage.getItem("members");

        if (savedTasks) {
          const tasks: TaskFormData[] = JSON.parse(savedTasks);
          const taskToEdit = tasks.find(t => t.id === Number(id));
          if (taskToEdit) {
            setTask(taskToEdit);
          } else {
            toast.error("Tâche non trouvée");
            navigate("/tasks");
          }
        }

        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Échec du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSubmit = (formData: TaskFormData) => {
 
  const processedData = {
    ...formData,
    memberId: Number(formData.memberId), 
    id: Number(formData.id), 
  };

  try {
    // Validation avec Zod
    const result = taskFormSchema.safeParse(processedData);
    
    if (!result.success) {
     
      result.error.errors.forEach((err) => {
        toast.error(`${err.path.join('.')}: ${err.message}`);
      });
      return;
    }

    
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks: TaskFormData[] = JSON.parse(savedTasks);
      const updatedTasks = tasks.map(t => t.id === processedData.id ? processedData : t);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      toast.success("Tâche mise à jour avec succès");
      navigate("/tasks");
    }
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue lors de la sauvegarde");
  }
};
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Tâche introuvable</h2>
          <p className="text-gray-600 mb-6">La tâche que vous essayez de modifier n'existe pas ou a été supprimée.</p>
          <button 
            onClick={() => navigate("/tasks")} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retour aux tâches
          </button>
        </div>
      </div>
    );
  }

  return <EditTaskForm task={task} members={members} onSubmit={handleSubmit} />;
}