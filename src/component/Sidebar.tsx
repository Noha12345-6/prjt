import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Eye,
  Plus,
  List,
  Settings,
  Bell,
  LogOut,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface SidebarNavItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  path: string;
  color?: string;
  hasDropdown?: boolean;
  subItems?: SidebarNavItem[];
  badge?: number;
}

const sidebarItems = [
    { 
      id: "dashboard", 
      labelKey: "dashboard.title", 
      icon: Home, 
      path: "/",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "members",
      labelKey: "members-management",
      icon: Users,
      path: "/members",
      hasDropdown: true,
      color: "from-emerald-500 to-emerald-600",
      subItems: [
        { 
          id: "add-member", 
          labelKey: "add-member", 
          icon: UserPlus, 
          path: "/members/add"
        },
        { 
          id: "view-members", 
          labelKey: "view-members", 
          icon: Eye, 
          path: "/members"
        },
      ],
    },
    {
      id: "tasks",
      labelKey: "tasks-management",
      icon: BarChart3,
      path: "/tasks",
      hasDropdown: true,
      color: "from-purple-500 to-purple-600",
      subItems: [
        { 
          id: "add-task", 
          labelKey: "add-task", 
          icon: Plus, 
          path: "/tasks/new"
        },
        { 
          id: "view-tasks", 
          labelKey: "view-tasks", 
          icon: List, 
          path: "/tasks"
        },
      ],
    },
  ];

  const bottomItems = [
   {
      id: "settings",
      labelKey: "settings",
      icon: Settings,
      path: "/settings"
    }
   
  ];

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const [__forceLangRerender, setLang] = useState(i18n.language);

  useEffect(() => {
    const onLangChanged = () => setLang(i18n.language);
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  }, [i18n]);

  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    members: false,
    tasks: false,
  });

  // Synchroniser l'item actif avec la route actuelle
  const [activeItem, setActiveItem] = useState(() => {
    const currentPath = location.pathname;
    
    // Vérifier d'abord les subItems
    for (const item of sidebarItems) {
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.path === currentPath);
        if (subItem) {
          // Ouvrir le dropdown parent si nécessaire
          setOpenDropdowns(prev => ({ ...prev, [item.id]: true }));
          return subItem.id;
        }
      }
    }
    
    // Vérifier les items principaux
    const mainItem = sidebarItems.find(item => item.path === currentPath) || 
                     bottomItems.find(item => item.path === currentPath);
    
    return mainItem?.id || "dashboard";
  });

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenDropdowns({ members: false, tasks: false });
    }
  };

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.path && !item.hasDropdown) {
      navigate(item.path);
      setActiveItem(item.id);
    }
    if (item.hasDropdown && !isCollapsed) {
      toggleDropdown(item.id);
    }
  };

  const handleSubItemClick = (subItem: SidebarNavItem) => {
    navigate(subItem.path);
    setActiveItem(subItem.id);
  };

  const isItemActive = (itemId: string) => activeItem === itemId;
  const isDropdownOpen = (itemId: string) => openDropdowns[itemId] ?? false;

  interface SidebarItemProps {
    item: SidebarNavItem;
    isActive: boolean;
    onClick: () => void;
    children?: React.ReactNode;
  }

  const SidebarItem = ({ item, isActive, onClick, children }: SidebarItemProps) => {
    const Icon = item.icon;
    const content = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 py-2.5 h-auto transition-all duration-200 group ${
          isActive 
            ? "bg-accent text-accent-foreground shadow-sm border border-border/50" 
            : "hover:bg-accent/50 hover:text-accent-foreground"
        }`}
        onClick={onClick}
      >
        <div className={`p-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? `bg-gradient-to-r ${item.color} text-white shadow-md` 
            : "bg-muted group-hover:bg-gradient-to-r group-hover:" + item.color?.split(' ')[0] + " group-hover:text-white"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        {!isCollapsed && (
          <>
            <span className="font-medium text-sm">{t(item.labelKey)}</span>
            {children}
          </>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {t(item.labelKey)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <div className={`flex flex-col h-screen bg-background border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-gradient-to-r from-amber-400 to-orange-400 border-0">
                  <Sparkles className="w-2 h-2" />
                </Badge>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Teams </h2>
               
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleSidebar}
          >
            {isCollapsed ? 
              <ChevronRight className="w-4 h-4" /> : 
              <ChevronLeft className="w-4 h-4" />
            }
          </Button>
        </div>

        {/* Menu principal */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = isItemActive(item.id);
              const isOpen = isDropdownOpen(item.id);

              return (
                <div key={item.id} className="space-y-1">
                  <SidebarItem
                    item={item}
                    isActive={isActive || item.subItems?.some(sub => isItemActive(sub.id))}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.hasDropdown && (
                      <div className="ml-auto">
                        {isOpen ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </div>
                    )}
                  </SidebarItem>

                  {/* Sous-menu */}
                  {!isCollapsed && item.hasDropdown && isOpen && (
                    <div className="ml-6 space-y-1 border-l-2 border-border pl-4">
                      {item.subItems?.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = isItemActive(sub.id);
                        
                        return (
                          <Button
                            key={sub.id}
                            variant={isSubActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 px-3 py-2 h-auto text-sm ${
                              isSubActive 
                                ? "bg-accent text-accent-foreground" 
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => handleSubItemClick(sub)}
                          >
                            <div className={`p-1.5 rounded-md ${
                              isSubActive 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}>
                              <SubIcon className="w-3 h-3" />
                            </div>
                            <span>{t(sub.labelKey)}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* TP2 Section */}
        <Separator />
        <div className="p-3 space-y-2">
          <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">TP2</div>
          <Button className="w-full justify-start" variant="ghost" onClick={() => navigate('/tp2/members-table')}>
            Liste Membres (Table)
          </Button>
          <Button className="w-full justify-start" variant="ghost" onClick={() => navigate('/tp2/members-add')}>
            Ajouter Membre
          </Button>
          
        </div>
        <Separator />

        <Separator />

        {/* Section du bas */}
        <div className="p-3 space-y-2">
          {bottomItems.map((item) => {
            const isActive = isItemActive(item.id);
            
            return (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.path);
                }}
              >
                {item.badge && (
                  <Badge className="ml-auto bg-destructive text-destructive-foreground">
                    {item.badge}
                  </Badge>
                )}
              </SidebarItem>
            );
          })}

          {/* Profil utilisateur */}
          {!isCollapsed && (
            <Card className="mt-4">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/40/40" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Admin</p>
                    <p className="text-xs text-muted-foreground truncate">admin@teams</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>John Doe</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}