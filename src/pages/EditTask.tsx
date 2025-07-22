// src/pages/tasks/edit/[id].tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskFormSchema, type TaskFormData } from "@/validation/schemasTask";
import { type MemberFormData } from "@/validation/schema";
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
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  // Charger la tâche et les membres
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Charger les membres
        const savedMembers = localStorage.getItem("members");
        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        }

        // Charger la tâche à éditer
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
          const tasks: TaskFormData[] = JSON.parse(savedTasks);
          const taskToEdit = tasks.find(task => task.id === Number(id));

          // Modifiez cette partie :
if (taskToEdit) {
  form.reset({
    ...taskToEdit,
    status: taskToEdit.status, // assurez-vous que c'est bien un des valeurs enum
    priority: taskToEdit.priority, // assurez-vous que c'est bien un des valeurs enum
    memberId: taskToEdit.memberId, // doit être un number
    dueDate: new Date(taskToEdit.dueDate).toISOString().split('T')[0]
  });
} else {
            toast.error("Task not found");
            navigate("/tasks");
          }
        }
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load task data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate]);

  const onSubmit = (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const tasks: TaskFormData[] = JSON.parse(savedTasks);
        const updatedTasks = tasks.map(task => 
          task.id === Number(id) ? { ...data, id: Number(id) } : task
        );
        
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        toast.success("Task updated successfully");
        navigate("/tasks");
      }
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Task</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Task title"
                    {...field}
                    className="focus:ring-2 focus:ring-blue-500"
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Task description"
                    {...field}
                    rows={4}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status, Priority, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select 
  onValueChange={field.onChange} 
  value={field.value}
>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority *</FormLabel>
                  <Select 
  onValueChange={field.onChange} 
  value={field.value}
>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split('T')[0]}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Assignee */}
         <FormField
  control={form.control}
  name="memberId"
  render={({ field }) => {
    // Convertit explicitement en string
    const selectValue = field.value ? field.value.toString() : "";
    
    return (
      <FormItem>
        <FormLabel>Assigné à *</FormLabel>
        <Select
          onValueChange={(value) => {
            field.onChange(value ? Number(value) : undefined);
          }}
          value={selectValue}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un membre" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {members
              .filter(member => member.id !== undefined)
              .map((member) => (
                <SelectItem 
                  key={member.id} 
                  value={member.id!.toString()}
                >
                  {member.name} ({member.role})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  }}
/>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tasks")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}