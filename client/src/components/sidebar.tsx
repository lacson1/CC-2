import { Link, useLocation } from "wouter";
import { Heart, BarChart3, Users, Stethoscope, FlaskRound, Pill, User, LogOut, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole, RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";

const getNavigationForRole = (role: string) => {
  const allNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["admin", "doctor", "nurse", "pharmacist", "physiotherapist"] },
    { name: "Patients", href: "/patients", icon: Users, roles: ["admin", "doctor", "nurse"] },
    { name: "Visits", href: "/visits", icon: Stethoscope, roles: ["admin", "doctor", "nurse"] },
    { name: "Lab Results", href: "/lab-results", icon: FlaskRound, roles: ["admin", "doctor", "nurse"] },
    { name: "Pharmacy", href: "/pharmacy", icon: Pill, roles: ["admin", "pharmacist"] },
    { name: "Referrals", href: "/referrals", icon: UserCheck, roles: ["admin", "doctor", "nurse", "pharmacist", "physiotherapist"] },
  ];
  
  return allNavigation.filter(item => item.roles.includes(role));
};

export default function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { user } = useRole();

  const navigation = getNavigationForRole(user?.role || '');

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">HealthCore</h1>
            <p className="text-sm text-slate-500">Clinic Management</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
