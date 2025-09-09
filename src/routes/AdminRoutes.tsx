import { useUser } from "@/redux/slices/userSlice";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const {user} = useUser();
  return user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/signin" />;
};

export default AdminRoutes;