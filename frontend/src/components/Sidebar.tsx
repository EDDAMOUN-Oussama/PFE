
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart, Utensils, Dumbbell, Target, Calendar, User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Weight Tracker', path: '/weight' },
    { icon: Utensils, label: 'Nutrition', path: '/nutrition' },
    { icon: Dumbbell, label: 'Exercises', path: '/exercises' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: ShieldCheck, label: 'Admin', path: '/admin' },
  ];

  const handleLogout = () => {
    // In a real application, this would clear authentication tokens, etc.
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Activity className="mr-2 h-6 w-6 text-sidebar-primary" />
          HealthyTrack
        </h1>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors ${
                  location.pathname === item.path ? 'bg-sidebar-accent' : ''
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  location.pathname === item.path ? 'text-sidebar-primary' : 'text-sidebar-foreground group-hover:text-sidebar-primary'
                }`} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-xl font-bold">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-sidebar-foreground/70">john@example.com</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center px-4 py-3 text-sm rounded-md text-destructive hover:bg-destructive/10 group transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
