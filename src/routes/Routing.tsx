import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MembersList from "../pages/ListMember";
import AddMember from "@/pages/AddMemberForm";
import TasksList from "../pages/tasks/TasksList"; 
import NewTask from "@/pages/tasks/new"; 
import EditTask from "@/pages/tasks/EditTask"; 
import EditMember from "@/pages/EditMember";
import Layout from "@/component/Layout"; 
export default function AppRoutes() {
  const routes = [
    {
      path: "/",
      element: <Layout />, 
      children: [
        { index: true, element: <Dashboard /> },
        { 
          path: "members",
          children: [
            { index: true, element: <MembersList /> },
            { path: "add", element: <AddMember /> },
            { path: "edit/:id", element: <EditMember /> }
          ]
        },
        { 
          path: "tasks",
          children: [
            { index: true, element: <TasksList /> },
            { path: "new", element: <NewTask /> },
            { path: "edit/:id", element: <EditTask /> }
          ]
        },
        { path: "*", element: <Dashboard /> } // Page par défaut
      ]
    }
  ];

  return useRoutes(routes);
}