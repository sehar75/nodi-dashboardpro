import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import { backendAuthApi } from "@/services/backendApi";
import { toast } from "@/hooks/use-toast";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await backendAuthApi.login(data);
      
      // Store auth data based on the API response structure
      localStorage.setItem("authToken", response.data.tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.user.display_name || response.data.user.email}!`,
      });
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the admin panel
          </p>
        </div>
        
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Login;
