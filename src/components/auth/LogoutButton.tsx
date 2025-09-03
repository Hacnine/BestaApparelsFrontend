import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("tna_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}