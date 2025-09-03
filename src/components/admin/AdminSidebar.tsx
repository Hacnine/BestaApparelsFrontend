import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Activity, 
  FileText, 
  ClipboardList,
  Shield,
  Bell,
  Building2,
  ChevronLeft,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useState } from "react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users
  },
  {
    title: "TNA Progress",
    href: "/progress",
    icon: TrendingUp
  },
  {
    title: "Audit Logs",
    href: "/audit",
    icon: Activity
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText
  },
  {
    title: "System Settings",
    href: "/settings",
    icon: Settings
  }
];

const settingsItems = [
  {
    title: "Company Info",
    href: "/settings/company",
    icon: Building2
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell
  },
  {
    title: "Approval Flow",
    href: "/settings/approval",
    icon: ClipboardList
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: Shield
  }
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <div className={cn(
      "relative bg-sidebar text-sidebar-foreground border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-hover">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Sample TNA</h2>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-hover"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-sidebar-hover hover:text-white",
                  isActive 
                    ? "bg-sidebar-active text-white shadow-lg" 
                    : "text-sidebar-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Settings Section */}
        {!collapsed && (
          <div className="mt-8">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Settings
              </h3>
            </div>
            <nav className="space-y-1">
              {settingsItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-sidebar-hover hover:text-white",
                      isActive 
                        ? "bg-sidebar-active text-white shadow-lg" 
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-hover">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">admin@company.com</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
}