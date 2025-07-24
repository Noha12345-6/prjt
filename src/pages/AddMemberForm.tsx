// src/pages/AddMember.tsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberFormCard from "@/component/MemberFormCard";
import { memberFormSchema } from "@/validation/schema";
import type { MemberFormData } from "@/validation/schema";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Member = MemberFormData & {
  id: number;
};

export default function AddMember() {
  const { t } = useTranslation();
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
  <div className="min-h-screen bg-background text-foreground">
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header avec breadcrumb */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="mb-4 text-muted-foreground gap-2 p-0 h-auto font-normal"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('members.back')}
        </Button>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            {t('members.addTitle')}
          </h1>
          <p className="text-muted-foreground ml-13">{t('members.addSubtitle')}</p>
        </div>
      </div>

      <MemberFormCard form={form} onSubmit={onSubmit} />
    </div>
  </div>
);
}