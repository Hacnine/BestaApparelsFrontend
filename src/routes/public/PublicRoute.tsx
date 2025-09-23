import { useUser } from "@/redux/slices/userSlice";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user } = useUser();

  // Safely check user and user.role
  if (user && user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }
  if (user && user.role === "MERCHANDISER") {
    return <Navigate to="/merchandiser/dashboard" />;
  }
  if (user && user.role === "CAD") {
    return <Navigate to="/cad/dashboard" />;
  }
  if (user && user.role === "SAMPLE_FABRIC") {
    return <Navigate to="/sample-fabric/dashboard" />;
  }
  if (user && user.role === "SAMPLE_ROOM") {
    return <Navigate to="/sample-room/dashboard" />;
  }
  if (user && user.role === "MANAGEMENT") {
    return <Navigate to="/management/dashboard" />;
  }

  return children;
};

export default PublicRoute;
