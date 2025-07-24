import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import {Header} from "./Header";
import { useTheme } from "../component/ThemeContext";

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <div className={`flex h-screen ${isDark ? 'dark' : ''}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto pt-16 bg-background text-foreground">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}