import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUsers = [
  { email: "admin@tna.com", password: "admin123", role: "Admin", name: "John Admin" },
  { email: "management@tna.com", password: "mgmt123", role: "Management", name: "Sarah Manager" },
  { email: "merchandiser@tna.com", password: "merch123", role: "Merchandiser", name: "Mike Merchandiser" },
  { email: "cad@tna.com", password: "cad123", role: "CAD", name: "Lisa CAD" },
  { email: "fabric@tna.com", password: "fabric123", role: "Sample Fabric", name: "Tom Fabric" },
  { email: "sample@tna.com", password: "sample123", role: "Sample Room", name: "Anna Sample" },
];

const roleRoutes = {
  "Admin": "/",
  "Management": "/management-dashboard",
  "Merchandiser": "/merchandiser-dashboard", 
  "CAD": "/cad-dashboard",
  "Sample Fabric": "/sample-fabric-dashboard",
  "Sample Room": "/sample-room-dashboard",
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user data in localStorage (mock JWT)
      localStorage.setItem("tna_user", JSON.stringify({
        token: "mock_jwt_token_" + Date.now(),
        user: user
      }));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });

      // Redirect based on role
      navigate(roleRoutes[user.role as keyof typeof roleRoutes] || "/");
    } else {
      setError("Invalid email or password");
    }
    
    setIsLoading(false);
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
          <CardDescription>
            Sign in to your garment TNA management account
          </CardDescription>
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

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Admin: admin@tna.com / admin123</div>
              <div>Management: management@tna.com / mgmt123</div>
              <div>Merchandiser: merchandiser@tna.com / merch123</div>
              <div>CAD: cad@tna.com / cad123</div>
              <div>Sample Fabric: fabric@tna.com / fabric123</div>
              <div>Sample Room: sample@tna.com / sample123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}