import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLogoutMutation } from "@/redux/api/userApi";
import toast from "react-hot-toast";

export function LogoutButton({collapsed}) {
  const navigate = useNavigate();
  const [logout, { isSuccess }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      if (isSuccess) {
        toast.success("You have been successfully logged out.");
      }
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      {!collapsed ? "Logout" : ""}
    </Button>
  );
}
