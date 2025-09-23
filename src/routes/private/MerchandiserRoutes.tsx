import ErrorFallback from "@/components/common/ErrorFallback";
import Loading from "@/components/common/Loading";
import { useUser } from "@/redux/slices/userSlice";
import { Navigate, Outlet } from "react-router-dom";

const MerchandiserRoutes = () => {
  const { user, loading } = useUser();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  const allowedRoles = ["MERCHANDISER"];
  if (!allowedRoles.includes(user.role)) {
    return <ErrorFallback />;
  }

  return <Outlet />;
};

export default MerchandiserRoutes;