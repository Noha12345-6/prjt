import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema, MemberRoles, MemberStatuses } from "../validation/schema";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type MemberFormData = z.infer<typeof memberFormSchema>;

export default function MemberEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<MemberFormData | null>(null);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Developer",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  });

  useEffect(() => {
    const fetchMember = () => {
      setIsLoading(true);
      try {
        const savedMembers = localStorage.getItem("members");
        if (savedMembers) {
          const members = JSON.parse(savedMembers);
          const memberToEdit = members.find((m: any) => m.id === Number(id));
          if (memberToEdit) {
            setMember(memberToEdit);
            form.reset(memberToEdit);
          }
        }
      } catch (error) {
        console.error("Failed to load member", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id, form]);

  const onSubmit = (data: MemberFormData) => {
    setIsLoading(true);
    try {
      const savedMembers = localStorage.getItem("members");
      if (savedMembers) {
        const members = JSON.parse(savedMembers);
        const updatedMembers = members.map((m: any) =>
          m.id === Number(id) ? { ...data, id: Number(id) } : m
        );
        localStorage.setItem("members", JSON.stringify(updatedMembers));
      }
      navigate("/members", { replace: true });
    } catch (error) {
      console.error("Failed to update member", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !member) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-foreground">Member not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-sm">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Member</h1>
        <p className="text-muted-foreground">Update the member details below</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="john@example.com" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MemberRoles.map((role) => (
                      <SelectItem key={role} value={role}>
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
                  <Input type="date" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MemberStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/members")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
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