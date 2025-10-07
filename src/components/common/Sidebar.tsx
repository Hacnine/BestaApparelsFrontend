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
  TrendingUp,
  IdCardIcon,
  Package,
  ShoppingCart,
  BarChart3,
  Barcode,
  Airplay,
  GitCommitHorizontal,
  Rows4,
  Webhook,
  SquareDashedKanban,
  Receipt,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { APP_ROUTES } from "@/routes/APP_ROUTES";
import { useUser } from "@/redux/slices/userSlice";

const navigationItemsMap: Record<string, any[]> = {
  ADMIN: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.admin_dashboard}`,
      icon: LayoutDashboard,
    },
    {
      title: "Employee Management",
      href: `${APP_ROUTES.admin_employee}`,
      icon: IdCardIcon,
    },
    {
      title: "User Management",
      href: `${APP_ROUTES.admin_user}`,
      icon: Users,
    },
    {
      title: "Buyer Management",
      href: `${APP_ROUTES.admin_buyer}`,
      icon: Barcode,
    },
    // {
    //   title: "TNA Progress",
    //   href: `${APP_ROUTES.admin_tna}`,
    //   icon: TrendingUp,
    // },
    // {
    //   title: "Audit Logs",
    //   href: `${APP_ROUTES.admin_audit}`,
    //   icon: Activity,
    // },
    {
      title: "Reports",
      href: `${APP_ROUTES.admin_reports}`,
      icon: FileText,
    },
  ],
  MERCHANDISER: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.merchandiser_dashboard}`,
      icon: LayoutDashboard,
    },
    {
      title: "Sample TNA",
      href: `${APP_ROUTES.sample_tna}`,
      icon: Rows4,
    },
    {
      title: "CAD",
      href: `${APP_ROUTES.cad}`,
      icon: Airplay,
    },
    {
      title: "Sample Fabric",
      href: `${APP_ROUTES.sample_fabric}`,
      icon: GitCommitHorizontal,
    },
    {
      title: "Sample Room",
      href: `${APP_ROUTES.sample_room}`,
      icon: Webhook,
    },
    {
      title: "Reports",
      href: `${APP_ROUTES.reports}`,
      icon: ClipboardList,
    },
    { title: "Cost Sheet", href: `${APP_ROUTES.cost_sheet}`, icon: Receipt },
  ],
  MANAGEMENT: [
    {
      title: "Dashboard",
      href: `${APP_ROUTES.management_dashboard}`,
      icon: Receipt,
    },
    {
      title: "Cost Sheet",
      href: `${APP_ROUTES.management_cost_sheet}`,
      icon: Receipt,
    },
  ],
};

const settingsItemsMap: Record<string, any[]> = {
  ADMIN: [
    {
      title: "Notifications",
      href: `${APP_ROUTES.admin_notifications}`,
      icon: Bell,
    },
  ],
  MERCHANDISER: [
    {
      title: "Notifications",
      href: `${APP_ROUTES.admin_notifications}`,
      icon: Bell,
    },
  ],
};

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { user } = useUser();

  const location = useLocation();
  const navigationItems = navigationItemsMap[user?.role] || [];
  const settingsItems = settingsItemsMap[user?.role] || [];
  return (
    <div
      className={cn(
        "relative bg-sidebar text-sidebar-foreground border-r border-border transition-all duration-300 h-screen overflow-y-auto",
        collapsed ? "w-16" : "min-w-68"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-hover">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="  flex items-center justify-center">
              <img className="size-10" src="/images/logo.webp" alt="" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-nowrap">Sample TNA</h2>
              {/* <p className="text-xs text-sidebar-foreground/70">Admin Panel</p> */}
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-hover"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
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
        {!collapsed && settingsItems.length > 0 && (
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
      <div className="p-4 border-t border-sidebar-hover ">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <LogoutButton collapsed={collapsed} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <LogoutButton collapsed={collapsed} />
          </div>
        )}
      </div>
    </div>
  );
}
