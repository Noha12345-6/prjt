import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MembersList from "../pages/ListMember";
import AddMember from "@/pages/AddMemberForm";
import EditMember from "@/pages/EditMember";
import TasksList from "../pages/TasksList"; // Nouveau
import NewTask from "@/pages/new"; // Nouveau
import EditTask from "@/pages/EditTask"; // Nouveau

export default function AppRoutes() {
  const routes = [
    { path: "/", element: <Dashboard /> },
    { 
      path: "/members",
      children: [
        { index: true, element: <MembersList /> },
        { path: "add", element: <AddMember /> },
        { path: "edit/:id", element: <EditMember /> }
      ]
    },
    { 
      path: "/tasks",
      children: [
        { index: true, element: <TasksList /> }, // Liste des tâches
        { path: "new", element: <NewTask /> }, // Création de tâche
        { path: "edit/:id", element: <EditTask /> } // Édition de tâche
      ]
    },
    { path: "*", element: <Dashboard /> }
  ];

  const element = useRoutes(routes);

  return element;
}