import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MembersList from "../pages/ListMember"; 
import AddMember from "@/pages/AddMemberForm";
import EditMember from "@/pages/EditMember"; 
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
    { path: "*", element: <Dashboard /> }
  ];

  const element = useRoutes(routes);

  return element;
}