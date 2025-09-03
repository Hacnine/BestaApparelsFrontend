import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-dashboard flex">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}