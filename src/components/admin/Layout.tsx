import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../common/Sidebar";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  sidebarFor: "admin" | "merchandiser" | "management" | "cad" | "sample_fabric" | "sample_room";
}

export function Layout({ sidebarFor }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Dynamically set maxWidth for main content to prevent overflow
  useEffect(() => {
    function updateMainWidth() {
      const sidebar = sidebarRef.current;
      const main = mainRef.current;
      if (sidebar && main) {
        const sidebarWidth = sidebar.offsetWidth;
        main.style.maxWidth = `calc(100vw - ${sidebarWidth}px)`;
        main.style.overflowX = "auto";
      }
    }
    updateMainWidth();
    window.addEventListener("resize", updateMainWidth);
    return () => window.removeEventListener("resize", updateMainWidth);
  }, [sidebarCollapsed]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar: fixed position, full height, scrollable */}
        <div
          ref={sidebarRef}
          className="fixed left-0 top-0 h-screen overflow-y-auto flex-shrink-0 z-40"
          style={{ width: sidebarCollapsed ? 64 : 240 }} // adjust widths as per your collapsed/expanded sidebar
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        {/* Main content: margin-left to match sidebar width */}
        <div
          ref={mainRef}
          className="flex-1 flex flex-col h-screen overflow-y-auto"
          style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        >
          {/* Top Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-4">
              

              {/* Search */}
              {/* <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, styles, buyers..."
                    className="pl-10 bg-muted/50 border-none focus:bg-background"
                  />
                </div>
              </div> */}

              {/* Header Actions */}
              {/* <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div> */}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-surface">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
