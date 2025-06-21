
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart, Utensils, Dumbbell, Target, Calendar, User, Settings, LogOut, ShieldCheck, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useHealth } from '@/contexts/HealthContext';
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useHealth();

  // La liste complète du boutons de navigation
  const menuItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Activity, label: t('nav.weight'), path: '/weight' },
    { icon: Utensils, label: t('nav.nutrition'), path: '/nutrition' },
    { icon: Dumbbell, label: t('nav.exercises'), path: '/exercises' },
    { icon: Target, label: t('nav.goals'), path: '/goals' },
    { icon: BarChart, label: t('nav.reports'), path: '/reports' },
    { icon: Calendar, label: t('nav.appointments'), path: '/appointments' },
    { icon: Bell, label: t('nav.notifications'), path: '/notifications' },
    { icon: User, label: t('nav.profile'), path: '/profile' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
    { icon: ShieldCheck, label: t('nav.admin'), path: '/admin' },
    { icon: ShieldCheck, label: 'Spécialiste', path: '/specialist' },
  ];

  const handleLogout = () => {
    // Vider le localStorage à la déconnexion pour plus de sécurité
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleUserInfoClick = () => {
    navigate('/profile');
  };

    // Fonction pour générer les initiales à partir du nom
    const getInitials = (name: string) => {
      if (!name) return '?';
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };
    
  return (
    <div className={`h-screen ${collapsed ? 'w-16' : 'w-64'} bg-sidebar fixed left-0 top-0 text-sidebar-foreground flex flex-col transition-width duration-300`}>
      <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!collapsed && (
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-sidebar-primary" />
            HealthyTrack
          </h1>
        )}
        {collapsed && (
          <Activity className="h-6 w-6 text-sidebar-primary" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-8 w-8 rounded-full hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 px-2 mt-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors ${
                  location.pathname === item.path ? 'bg-sidebar-accent' : ''
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${
                  location.pathname === item.path ? 'text-sidebar-primary' : 'text-sidebar-foreground group-hover:text-sidebar-primary'
                }`} />
                {!collapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={`p-4 border-t border-sidebar-border ${collapsed ? 'items-center' : ''}`}>
        {!user ? (
          <button 
            onClick={handleUserInfoClick}
            className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-xl font-bold">
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
            )}
          </button>
        ) : (
          <div className="h-10">
            {/* Espace vide pendant que l'utilisateur charge */}
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`mt-4 w-full flex ${collapsed ? 'justify-center' : ''} items-center px-3 py-3 text-sm rounded-md text-destructive hover:bg-destructive/10 group transition-colors`}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
