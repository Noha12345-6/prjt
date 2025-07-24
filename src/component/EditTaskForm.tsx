import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { TaskStatuses, TaskPriorities } from "@/validation/schemasTask";
import type { TaskFormData } from "@/validation/schemasTask";
import type { MemberFormData } from "@/validation/schema";
import { useTranslation } from "react-i18next";

interface EditTaskFormProps {
  task: TaskFormData;
  members: MemberFormData[];
  onSubmit: (formData: TaskFormData) => void;
}

export default function EditTaskForm({ task, members, onSubmit }: EditTaskFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TaskFormData>(task);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('tasks.back')}</span>
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                </svg>
              </span>
              <span>{t('tasks.editTaskTitle')}</span>
            </h1>
            <p className="text-muted-foreground mt-2 ml-11">{t('tasks.editTaskSubtitle')}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Titre */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="9" x2="20" y2="9"></line>
                      <line x1="4" y1="15" x2="20" y2="15"></line>
                      <line x1="10" y1="3" x2="8" y2="21"></line>
                      <line x1="16" y1="3" x2="14" y2="21"></line>
                    </svg>
                  </span>
                  {t('tasks.title')} <span className="text-destructive ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground"
                  required
                  placeholder={t('tasks.titlePlaceholder')}
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </span>
                  {t('tasks.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground"
                  placeholder={t('tasks.descriptionPlaceholder')}
                />
              </div>

              {/* Statut */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4l3 3"></path>
                    </svg>
                  </span>
                  {t('tasks.status')} <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none transition-all duration-200 bg-background text-foreground"
                    required
                  >
                    {TaskStatuses.map(status => (
                      <option key={status} value={status}>
                        {t(`tasks.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Priorité */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </span>
                  {t('tasks.priority')} <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none transition-all duration-200 bg-background text-foreground"
                    required
                  >
                    {TaskPriorities.map(priority => (
                      <option key={priority} value={priority}>
                        {t(`tasks.priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date d'échéance */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  {t('tasks.dueDate')} <span className="text-destructive ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground"
                  required
                />
              </div>

              {/* Assigné à */}
              <div>
                <label htmlFor="memberId" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  {t('tasks.assignTo')} <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id="memberId"
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none transition-all duration-200 bg-background text-foreground"
                    required
                  >
                    <option value="">{t('tasks.assignPlaceholder')}</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tasks")}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">{t('common.save')}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}