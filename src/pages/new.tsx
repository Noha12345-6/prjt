// src/pages/tasks/new.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskFormSchema, type TaskFormData } from "@/validation/schemasTask";
import { type MemberFormData } from "../validation/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardList, 
  FileText, 
  Calendar, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Flag,
  ArrowLeft,
  Plus
} from "lucide-react";

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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertCircle };
      case "medium":
        return { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Flag };
      default:
        return { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle2 };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
      case "in_progress":
        return { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Clock };
      default:
        return { color: "text-slate-600", bg: "bg-slate-50 border-slate-200", icon: ClipboardList };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="mb-4 text-slate-600 hover:text-slate-800 hover:bg-white/70 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux tâches
          </Button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Créer une nouvelle tâche
                </h1>
                <p className="text-slate-600 mt-1">Définissez les détails de votre nouvelle tâche</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
              
              {/* Section Informations principales */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 pb-2 border-b border-slate-200">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Informations principales
                </div>

                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Titre de la tâche
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Développer la nouvelle fonctionnalité..."
                          {...field}
                          className="h-12 text-base bg-slate-50/50 border-slate-200 focus:border-blue-400 focus:bg-white transition-all duration-200 hover:bg-white/80"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description détaillée
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez les détails de la tâche, les objectifs et les livrables attendus..."
                          {...field}
                          rows={4}
                          className="resize-none bg-slate-50/50 border-slate-200 focus:border-blue-400 focus:bg-white transition-all duration-200 hover:bg-white/80"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section Configuration */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 pb-2 border-b border-slate-200">
                  <Flag className="w-5 h-5 text-purple-500" />
                  Configuration de la tâche
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => {
                      const statusConfig = getStatusConfig(field.value);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            Statut
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={`h-12 ${statusConfig.bg} border-2 hover:bg-white transition-all duration-200`}>
                                <SelectValue placeholder="Sélectionner le statut" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-sm">
                              <SelectItem value="todo" className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <ClipboardList className="w-4 h-4 text-slate-500" />
                                  À faire
                                </div>
                              </SelectItem>
                              <SelectItem value="in_progress">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  En cours
                                </div>
                              </SelectItem>
                              <SelectItem value="done">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  Terminé
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Priority */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => {
                      const priorityConfig = getPriorityConfig(field.value);
                      const PriorityIcon = priorityConfig.icon;
                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <PriorityIcon className="w-4 h-4" />
                            Priorité
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={`h-12 ${priorityConfig.bg} border-2 hover:bg-white transition-all duration-200`}>
                                <SelectValue placeholder="Sélectionner la priorité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-sm">
                              <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  Faible
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                  <Flag className="w-4 h-4 text-amber-500" />
                                  Moyenne
                                </div>
                              </SelectItem>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                  Élevée
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Due Date */}
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date d'échéance
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                            className="h-12 bg-slate-50/50 border-slate-200 focus:border-blue-400 focus:bg-white transition-all duration-200 hover:bg-white/80"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section Assignation */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 pb-2 border-b border-slate-200">
                  <Users className="w-5 h-5 text-green-500" />
                  Assignation
                </div>

                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Assigner à un membre de l'équipe
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 focus:border-blue-400 hover:bg-white/80 transition-all duration-200">
                            <SelectValue placeholder="Choisir un membre de l'équipe" />
                          </SelectTrigger>
                        </FormControl>
                       
<SelectContent>
  {members
    .filter((member): member is MemberFormData & { id: number } => !!member.id)
    .map((member) => (
      <SelectItem
        key={member.id}
        value={member.id.toString()}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{member.name}</span>
          <span className="text-xs text-gray-500">
            ({member.role})
          </span>
        </div>
      </SelectItem>
    ))}
</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/tasks")}
                  className="px-8 h-12 hover:bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-800 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="px-8 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la tâche
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}