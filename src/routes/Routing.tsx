import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MembersList from "../pages/ListMember";
import AddMember from "@/pages/AddMemberForm";
import TasksList from "../pages/tasks/TasksList"; 
import NewTask from "@/pages/tasks/new"; 
import EditTask from "@/pages/tasks/EditTask"; 
import EditMember from "@/pages/EditMember";
import Layout from "@/component/Layout"; 
import { useTranslation } from "react-i18next";
import TestAddressMap from '../pages/TestAddressMap';
import MembersTablePage from '@/tp2/pages/MembersTablePage';
// import MembersCrudFormPage from '@/tp2/pages/MembersCrudFormPage';
import AddMemberPage from '@/tp2/pages/AddMemberPage';
// import MembersCrudPage from '@/tp2/pages/MembersCrudPage';

export default function AppRoutes() {
  const { i18n } = useTranslation();
  const routes = [
    {
      path: "/",
      element: <Layout />, 
      children: [
        { index: true, element: <Dashboard key={i18n.language} /> },
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
            { path: "edit/:id", element: <EditTask key={i18n.language} /> }
          ]
        },
        { 
          path: "tp2/members-table",
          element: <MembersTablePage />
        },
       
        { 
          path: "tp2/members-add",
          element: <AddMemberPage />
        },
        // { 
        //   path: "tp2/members-crud",
        //   element: <MembersCrudPage />
        // },
        { 
          path: "/test-map",
          element: <TestAddressMap />
        },
        { path: "*", element: <Dashboard key={i18n.language} /> } // Page par défaut
      ]
    }
  ];

  return useRoutes(routes);
}