import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { memberFormSchema, MemberRoles } from "../validation/schema";
import type { MemberFormData } from "../validation/schema";

type Member = MemberFormData & {
  id: number;
};

export default function AddMember() {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active"
    }
  });

  const navigate = useNavigate();

  const onSubmit = (data: MemberFormData) => {
    const existingMembers: Member[] = JSON.parse(
      localStorage.getItem("members") || "[]"
    );

    const newId = existingMembers.length > 0 
      ? Math.max(...existingMembers.map(m => m.id)) + 1 
      : 1;

    const newMember: Member = {
      ...data,
      id: newId
    };

    const updatedMembers = [...existingMembers, newMember];
    localStorage.setItem("members", JSON.stringify(updatedMembers));

    navigate("/members");
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Member</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Select */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MemberRoles.map((role) => (
                      <SelectItem 
                        key={role} 
                        value={role}
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <RoleIcon role={role} />
                          {role}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Join Date Field */}
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Select */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem 
                      value="active"
                      className="hover:bg-green-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </SelectItem>
                    <SelectItem 
                      value="inactive"
                      className="hover:bg-red-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Inactive
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/members")}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!form.formState.isValid}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Add Member
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Helper component for role icons
function RoleIcon({ role }: { role: string }) {
  const iconMap: Record<string, string> = {
    "Developer": "💻",
    "Designer": "🎨",
    "Manager": "👔",
    "QA Engineer": "🔍",
    "Product Owner": "📊"
  };

  return (
    <span className="text-sm">
      {iconMap[role] || "👤"}
    </span>
  );
}