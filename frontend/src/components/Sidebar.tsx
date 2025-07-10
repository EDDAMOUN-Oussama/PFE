import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Activity, BarChart, Utensils, Dumbbell, Target, Calendar,
  User, Settings, LogOut, ShieldCheck, ChevronLeft, ChevronRight, Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useHealth } from '@/contexts/HealthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoading } = useHealth();

  // La liste complète de TOUS les boutons de navigation possibles
  // Chaque lien a une clé `roles` qui définit qui peut le voir.
  const allMenuItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard', roles: ['user', 'admin', 'specialist'] },
    { icon: User, label: t('nav.profile'), path: '/profile', roles: ['user', 'admin', 'specialist'] },
    { icon: Activity, label: t('nav.weight'), path: '/weight', roles: ['user', 'admin', 'specialist'] },
    { icon: Utensils, label: t('nav.nutrition'), path: '/nutrition', roles: ['user', 'admin', 'specialist'] },
    { icon: Dumbbell, label: t('nav.exercises'), path: '/exercises', roles: ['user', 'admin', 'specialist'] },
    { icon: Target, label: t('nav.goals'), path: '/goals', roles: ['user', 'admin', 'specialist'] },
    { icon: BarChart, label: t('nav.reports'), path: '/reports', roles: ['user', 'admin', 'specialist'] },
    { icon: Calendar, label: t('nav.appointments'), path: '/appointments', roles: ['user', 'admin', 'specialist'] },
    { icon: Bell, label: t('nav.notifications'), path: '/notifications', roles: ['user', 'admin', 'specialist'] },
    { icon: Settings, label: t('nav.settings'), path: '/settings', roles: ['user', 'admin', 'specialist'] },
    // Liens spécifiques à un rôle
    { icon: ShieldCheck, label: 'Spécialiste', path: '/specialist', roles: ['specialist'] },
    { icon: ShieldCheck, label: t('nav.admin'), path: '/admin', roles: ['admin'] },
  ];

  const [visibleMenuItems, setVisibleMenuItems] = useState([]);

  // On filtre les liens à afficher en fonction du rôle de l'utilisateur
  useEffect(() => {
    if (user?.role) {
      const filtered = allMenuItems.filter(item => item.roles.includes(user.role));
      setVisibleMenuItems(filtered);
    } else {
      // Si l'utilisateur n'est pas encore chargé, on n'affiche que les liens de base
      const defaultItems = allMenuItems.filter(item => item.roles.includes('user') && item.path !== '/specialist' && item.path !== '/admin');
      setVisibleMenuItems(defaultItems);
    }
  }, [user, t]); // On ajoute `t` aux dépendances pour que les traductions se mettent à jour

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-sidebar fixed left-0 top-0 text-sidebar-foreground flex flex-col transition-all duration-300 z-50`}>
      {/* Header de la Sidebar */}
      <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center border-b border-sidebar-border h-20`}>
        {!collapsed && (
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-sidebar-primary" />
            HealthyTrack
          </h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 rounded-full hover:bg-sidebar-accent">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors ${location.pathname.startsWith(item.path) ? 'bg-sidebar-accent' : ''} ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'} ${location.pathname.startsWith(item.path) ? 'text-sidebar-primary' : 'text-sidebar-foreground group-hover:text-sidebar-primary'}`} />
                {!collapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer avec infos utilisateur et déconnexion */}
      <div className={`p-4 border-t border-sidebar-border`}>
        {isLoading ? (
          <div className="h-10 w-full flex items-center justify-center">{/* Placeholder de chargement */}</div>
        ) : user ? (
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center mb-4 ${collapsed ? 'justify-center' : ''} cursor-pointer`}
            title={collapsed ? "Voir le profil" : undefined}
            >
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
              </div>
            )}
          </div>
          </button>
        ) : (
          <div className="h-10">{/* Vide si pas d'utilisateur ou erreur */}</div>
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