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
import BuyerManagement from "@/components/admin/BuyerManagement";
import CadDesignDashboard from "@/components/cadDesign/CadDesignDashboard";
import SampleDevelopement from "@/components/SampleDevelopment/SampleDevelopment";
import FabricBooking from "@/components/fabricBooking/FabricBooking";
import { MerchandiserDashboard } from "@/components/merchandiser/MerchandiserDashboard";
import SampleTna from "@/components/merchandiser/SampleTna";
import Reports from "@/components/merchandiser/Reports";
import ManagementDashboard from "@/components/merchandiser/ManagementDashboard";

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
        <Route path="management-dashboard" element={<ManagementDashboard />} />
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="user" element={<UserManagement />} />

        <Route path="tna" element={<SampleTna />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="merchandiser" element={<AdminLayout sidebarFor={"cad"} />}>
        <Route path="cad-designs" element={<CadDesignDashboard />} />
        <Route path="fabric-booking" element={<FabricBooking />} />
        <Route path="sample-development" element={<SampleDevelopement />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route
        path="management"
        element={<AdminLayout sidebarFor={"management"} />}
      >
        <Route path="dashboard" element={<ManagementDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);
