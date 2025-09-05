import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLogoutMutation } from "@/redux/api/userApi";

export function LogoutButton() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("tna_user");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}