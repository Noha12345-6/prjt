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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { memberFormSchema, MemberRoles } from "../validation/schema";
import type { MemberFormData } from "../validation/schema";
import { 
  UserPlus, 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Activity, 
  ArrowLeft, 
  Plus,
  Code,
  Palette,
  Briefcase,
  Search,
  BarChart3,
  CheckCircle
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header avec breadcrumb */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/members")}
            className="mb-4 text-gray-600 hover:text-gray-900 gap-2 p-0 h-auto font-normal"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              Add New Member
            </h1>
            <p className="text-gray-600 ml-13">Create a new team member profile</p>
          </div>
        </div>

        {/* Carte principale du formulaire */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Member Information</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new team member</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section informations personnelles */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <User className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-3 h-3" />
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter full name" 
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="email@example.com" 
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section rôle et statut */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-900">Role & Status</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Role *
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MemberRoles.map((role) => (
                                <SelectItem 
                                  key={role} 
                                  value={role}
                                  className="py-3 hover:bg-blue-50 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <RoleIcon role={role} />
                                    <span>{role}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            Status
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem 
                                value="active"
                                className="py-3 hover:bg-green-50 cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Active</span>
                                </div>
                              </SelectItem>
                              <SelectItem 
                                value="inactive"
                                className="py-3 hover:bg-red-50 cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  <span>Inactive</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section date */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-900">Timeline</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="joinDate"
                    render={({ field }) => (
                      <FormItem className="space-y-2 max-w-sm">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          Join Date *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preview card si le formulaire est valide */}
                {form.formState.isValid && form.watch("name") && form.watch("email") && form.watch("role") && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <h3 className="font-medium text-gray-900">Preview</h3>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{form.watch("name")}</h4>
                          <p className="text-sm text-gray-600">{form.watch("email")}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <RoleIcon role={form.watch("role")} />
                              {form.watch("role")}
                            </div>
                            <div className={`flex items-center gap-1 text-xs ${form.watch("status") === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${form.watch("status") === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              {form.watch("status")?.charAt(0).toUpperCase() + form.watch("status")?.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-gray-100">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/members")}
                    className="h-11 px-6 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="h-11 px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for role icons with Lucide icons
function RoleIcon({ role }: { role: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    "Developer": <Code className="w-4 h-4 text-blue-600" />,
    "Designer": <Palette className="w-4 h-4 text-purple-600" />,
    "Manager": <Briefcase className="w-4 h-4 text-green-600" />,
    "QA Engineer": <Search className="w-4 h-4 text-orange-600" />,
    "Product Owner": <BarChart3 className="w-4 h-4 text-indigo-600" />
  };

  return (
    <div className="flex items-center justify-center">
      {iconMap[role] || <User className="w-4 h-4 text-gray-600" />}
    </div>
  );
}