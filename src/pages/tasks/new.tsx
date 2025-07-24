// src/pages/tasks/new.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskFormSchema, type TaskFormData } from "@/validation/schemasTask";
import { type MemberFormData } from "@/validation/schema";
import { TaskForm } from "./TaskForm"
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

export default function NewTask() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<MemberFormData[]>([]);
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      memberId: undefined
    }
  });

  useEffect(() => {
    const loadMembers = () => {
      try {
        const savedMembers = localStorage.getItem("members");
        if (savedMembers) {
          const parsedMembers: MemberFormData[] = JSON.parse(savedMembers);
          setMembers(parsedMembers.filter(m => m.id !== undefined));
        }
      } catch (error) {
        console.error("Failed to load members:", error);
      }
    };

    loadMembers();
  }, []);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      const tasks = savedTasks ? JSON.parse(savedTasks) : [];
      const newTask = {
        ...data,
        id: Date.now(),
        memberId: Number(data.memberId)
      };

      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
      navigate("/tasks", { replace: true });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="mb-4 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux tâches
          </Button>
          
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Créer une nouvelle tâche
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Définissez les détails de votre nouvelle tâche</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <TaskForm
            form={form}
            members={members}
            onSubmit={onSubmit}
            onCancel={() => navigate("/tasks")}
          />
        </div>
      </div>
    </div>
  );
}