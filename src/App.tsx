import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/admin/AdminLayout";
import { DashboardOverview } from "./components/admin/DashboardOverview";
import { UserManagement } from "./components/admin/UserManagement";
import { TNAProgress } from "./components/admin/TNAProgress";
import { AuditLogs } from "./components/admin/AuditLogs";
import { LoginPage } from "./components/auth/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="progress" element={<TNAProgress />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports Coming Soon</h1></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Coming Soon</h1></div>} />
          </Route>
          <Route path="/unauthorized" element={<div className="p-6 text-center"><h1 className="text-2xl font-bold">Unauthorized Access</h1></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
