import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema } from "../validation/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import EditMemberForm from "./EditMemberForm";

type MemberFormData = z.infer<typeof memberFormSchema>;

export default function MemberEdit() {
  const { t } = useTranslation();
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
          const members: (MemberFormData & { id: number })[] = JSON.parse(savedMembers);
          const memberToEdit = members.find((m) => m.id === Number(id));
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
        const members: (MemberFormData & { id: number })[] = JSON.parse(savedMembers);
        const updatedMembers = members.map((m) =>
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
        <p className="text-foreground">{t('members.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-sm">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('members.editTitle')}</h1>
        <p className="text-muted-foreground">{t('members.editSubtitle')}</p>
      </header>
      <EditMemberForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        navigate={navigate}
        t={t}
      />
    </div>
  );
}