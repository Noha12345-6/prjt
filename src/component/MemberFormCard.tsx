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
import {
  User,
  Mail,
  Shield,
  Calendar,
  Activity,
  Plus,
  CheckCircle,
} from "lucide-react";

import { MemberRoles } from "@/validation/schema";
import { useNavigate } from "react-router-dom";

type Props = {
  form: any;
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
};

export default function MemberFormCard({ form, onSubmit, isEditMode = false }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {isEditMode ? "Edit Member" : "Member Information"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode 
                ? "Update the details of this team member" 
                : "Fill in the details below to add a new team member"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Personal Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter full name" 
                          className="h-11"
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
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="email@example.com" 
                          className="h-11"
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
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Role & Status</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Role *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MemberRoles.map((role) => (
                            <SelectItem 
                              key={role} 
                              value={role}
                            >
                              <div className="flex items-center gap-3">
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
                      <FormLabel className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Status
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Active</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
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
              <div className="flex items-center gap-2 pb-2 border-b">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Timeline</h3>
              </div>
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="space-y-2 max-w-sm">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Join Date *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="h-11"
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
                <div className="flex items-center gap-2 pb-2 border-b">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h3 className="font-medium">Preview</h3>
                </div>
                <div className="bg-accent rounded-lg p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{form.watch("name")}</h4>
                      <p className="text-sm text-muted-foreground">{form.watch("email")}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/members")}
                className="h-11 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="h-11 px-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isEditMode ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}