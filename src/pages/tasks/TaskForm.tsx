// src/components/TaskForm.tsx

import { type TaskFormData } from "@/validation/schemasTask";
import {  type MemberFormData } from "@/validation/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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

interface TaskFormProps {
  form: any; // Ou utilisez le type correct Form<TaskFormData>
  members: MemberFormData[];
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "high":
      return { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700", icon: AlertCircle };
    case "medium":
      return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700", icon: Flag };
    default:
      return { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", icon: CheckCircle2 };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "done":
      return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700", icon: CheckCircle2 };
    case "in_progress":
      return { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", icon: Clock };
    default:
      return { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700", icon: ClipboardList };
  }
};

export const TaskForm = ({ form, members, onSubmit, onCancel }: TaskFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* Section Informations principales */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Informations principales
          </div>

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Titre de la tâche
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Développer la nouvelle fonctionnalité..."
                    {...field}
                    className="h-12 text-base bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
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
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description détaillée
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez les détails de la tâche, les objectifs et les livrables attendus..."
                    {...field}
                    rows={4}
                    className="resize-none bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section Configuration */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <Flag className="w-5 h-5 text-purple-500 dark:text-purple-400" />
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
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      Statut
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={`h-12 ${statusConfig.bg} border-2 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200`}>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                        <SelectItem value="todo" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            À faire
                          </div>
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            En cours
                          </div>
                        </SelectItem>
                        <SelectItem value="done">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <PriorityIcon className="w-4 h-4" />
                      Priorité
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={`h-12 ${priorityConfig.bg} border-2 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200`}>
                          <SelectValue placeholder="Sélectionner la priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                            Faible
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            Moyenne
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
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
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date d'échéance
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
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
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <Users className="w-5 h-5 text-green-500 dark:text-green-400" />
            Assignation
          </div>

          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assigner à un membre de l'équipe
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                      <SelectValue placeholder="Choisir un membre de l'équipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    {members
                      .filter((member): member is MemberFormData & { id: number } => !!member.id)
                      .map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
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
        <div className="flex justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-8 h-12 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200"
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
  );
};