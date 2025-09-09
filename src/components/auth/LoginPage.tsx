import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Add useDispatch and useSelector
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2 } from "lucide-react";
import { useLoginMutation } from "@/redux/api/userApi";
import { setCredentials } from "@/redux/slices/userSlice"; // Import setCredentials action
import { selectIsAuthenticated } from "@/redux/slices/userSlice"; // Import selector
import { APP_ROUTES } from "@/routes/APP_ROUTES";

const roleRoutes = {
  Admin: `${APP_ROUTES.admin_dashboard}`,
  Management: `${APP_ROUTES.management_dashboard}`,
  Merchandiser: `${APP_ROUTES.merchandiser_dashboard}`,
  CAD: `${APP_ROUTES.cad_dashboard}`,
  "Sample Fabric": `${APP_ROUTES.sample_fabric_dashboard}`,
  "Sample Room": `${APP_ROUTES.sample_room_dashboard}`,
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch(); 
  const isAuthenticated = useSelector(selectIsAuthenticated);


  if (isAuthenticated) {
    navigate("/"); 
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ body: { email, password } }).unwrap();

      // Store user data in Redux store instead of localStorage
      dispatch(
        setCredentials({
          user: response.user,
          token: response.token, // Include token if needed in userSlice
        })
      );

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.email}!`,
      });

      // Redirect based on role
      navigate(roleRoutes[response.user.role as keyof typeof roleRoutes] || "/");
    } catch (err: any) {
      setError(err.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sample TNA Login</CardTitle>
          <CardDescription>Sign in to your garment TNA management account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}