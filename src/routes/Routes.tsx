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
import MerchandiserDashboard from "@/components/merchandiser/MerchandiserDashboard";
import BuyerManagement from "@/components/admin/BuyerManagement";
import CadDesignDashboard from "@/components/cadDesign/CadDesignDashboard";
import SampleDevelopement from "@/components/SampleDevelopement/SampleDevelopement";

// Create router with nested routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public route */}
      <Route path={APP_ROUTES.login} element={<LoginPage />} />
      {/* Admin layout + nested routes */}
      <Route path="admin" element={<AdminLayout sidebarFor={"admin"} />}>
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="user" element={<UserManagement />} />
        <Route path="buyer" element={<BuyerManagement />} />
        <Route path="tna" element={<TNAProgress />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Merchandiser layout + nested routes */}
      <Route
        path="merchandiser"
        element={<AdminLayout sidebarFor={"merchandiser"} />}
      >
        <Route path="dashboard" element={<MerchandiserDashboard />} />
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="user" element={<UserManagement />} />

        <Route path="tna" element={<TNAProgress />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="merchandiser"
        element={<AdminLayout sidebarFor={"cad"} />}
      >
        <Route path="cad-designs" element={<CadDesignDashboard />} />
        <Route path="sample-development" element={<SampleDevelopement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);
