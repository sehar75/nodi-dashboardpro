import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, HelpCircle, Menu, X, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { backendAuthApi } from "@/services/backendApi";
import { toast } from "@/hooks/use-toast";

const navItemBaseClasses =
  "flex items-center gap-3 rounded-md px-4 py-3 text-base transition-colors hover:bg-accent hover:text-accent-foreground";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await backendAuthApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto md:bg-card/40 md:w-80
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="mb-6 px-2">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-base text-muted-foreground">Manage the platform</p>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navItemBaseClasses} ${isActive ? "bg-accent/60" : ""}`
              }
            >
              <LayoutDashboard className="h-8 w-6" />
              <span className="font-medium text-xl" >Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${navItemBaseClasses} ${isActive ? "bg-accent/60" : ""}`
              }
            >
              <Users className="h-4 w-4" />
              <span className="font-medium text-xl">Users</span>
            </NavLink>
            <NavLink
              to="/admin/questions"
              className={({ isActive }) =>
                `${navItemBaseClasses} ${isActive ? "bg-accent/60" : ""}`
              }
            >
              <HelpCircle className="h-4 w-4" />
              <span className="font-medium text-xl">Questions</span>
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="border-b border-border bg-card/30 px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Administration</h2>
              <div className="flex items-center gap-2">
                {/* Auth button */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user?.display_name || user?.email}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                )}
                {/* Mobile hamburger button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


