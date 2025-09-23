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
import PublicRoute from "./public/PublicRoute";
import { useUser } from "@/redux/slices/userSlice";
import { Navigate } from "react-router-dom";
import AdminRoutes from "./private/AdminRoutes";
import MerchandiserRoutes from "./private/MerchandiserRoutes";
import ManagementRoutes from "./private/ManagementRoutes";

// Root route protection: redirect to /login if not authenticated
const RootRoute = () => {
  const { user } = useUser();
  if (!user || !user?.role) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }
  // Optionally, redirect to dashboard based on role if needed
  return <Navigate to="/admin/dashboard" replace />;
};

// Create router with nested routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public route */}
      <Route
        path={APP_ROUTES.login}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      {/* Root route: always redirect to login if not authenticated */}
      <Route path="/" element={<RootRoute />} />
      {/* Admin layout + nested routes protected by AdminRoutes */}
      <Route element={<AdminRoutes />}>
        <Route path="admin" element={<AdminLayout sidebarFor={"admin"} />}>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="employee" element={<EmployeeManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="buyer" element={<BuyerManagement />} />
          <Route path="tna" element={<TNAProgress />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Merchandiser layout + nested routes */}
      <Route element={<MerchandiserRoutes />}>
        <Route
          path="merchandiser"
          element={<AdminLayout sidebarFor={"merchandiser"} />}
        >
          <Route path="dashboard" element={<MerchandiserDashboard />} />
          <Route
            path="management-dashboard"
            element={<ManagementDashboard />}
          />
          <Route path="employee" element={<EmployeeManagement />} />
          <Route path="user" element={<UserManagement />} />

          <Route path="tna" element={<SampleTna />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="merchandiser" element={<AdminLayout sidebarFor={"cad"} />}>
        <Route path="cad-designs" element={<CadDesignDashboard />} />
        <Route path="fabric-booking" element={<FabricBooking />} />
        <Route path="sample-development" element={<SampleDevelopement />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route element={<ManagementRoutes />}>
        <Route
          path="management"
          element={<AdminLayout sidebarFor={"management"} />}
        >
          <Route path="dashboard" element={<ManagementDashboard />} />
        </Route>
      </Route>

      
      <Route element={<ManagementRoutes />}>
        <Route path="employee" element={<EmployeeManagement />} />
        <Route path="user" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);
