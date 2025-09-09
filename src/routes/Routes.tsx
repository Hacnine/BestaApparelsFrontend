import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import { LoginPage } from "@/components/auth/LoginPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { TNAProgress } from "@/components/admin/TNAProgress";
import { AuditLogs } from "@/components/admin/AuditLogs";
import NotFound from "@/pages/NotFound";
import EmployeeManagement from "@/components/admin/EmployeeManagement";

// Create router with nested routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public route */}
      <Route path={APP_ROUTES.login} element={<LoginPage />} />
      {/* Admin layout + nested routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="user" element={<UserManagement />} />

        <Route path="tna" element={<TNAProgress />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);
