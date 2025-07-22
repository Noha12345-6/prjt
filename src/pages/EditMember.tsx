import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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

interface MemberWithId extends MemberFormData {
  id: number;
}

// Type guard pour vérifier les rôles valides
function isValidRole(role: string): role is typeof MemberRoles[number] {
  return MemberRoles.includes(role as typeof MemberRoles[number]);
}

export default function EditMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      role: "Developer",
      joinDate: new Date().toISOString().split('T')[0],
      status: "active"
    }
  });

  useEffect(() => {
    const members: MemberWithId[] = JSON.parse(localStorage.getItem("members") || "[]");
    const memberToEdit = members.find(m => m.id === Number(id));

    if (memberToEdit) {
      // Utilisation du type guard pour vérifier le rôle
      const role = isValidRole(memberToEdit.role) 
        ? memberToEdit.role 
        : "Developer";

      form.reset({
        name: memberToEdit.name,
        email: memberToEdit.email,
        role,
        joinDate: memberToEdit.joinDate,
        status: memberToEdit.status,
      });
    } else {
      navigate("/members", { replace: true });
    }
  }, [id, form, navigate]);

  const onSubmit = (data: MemberFormData) => {
    setIsLoading(true);
    
    try {
      const members: MemberWithId[] = JSON.parse(localStorage.getItem("members") || "[]");
      const updatedMembers = members.map(member => 
        member.id === Number(id) ? { ...member, ...data } : member
      );
      
      localStorage.setItem("members", JSON.stringify(updatedMembers));
      navigate("/members");
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Member</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/members")}
              className="hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!form.formState.isValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}