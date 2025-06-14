
import { useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { user } = useHealth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const today = new Date();

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  // Format date in French
  const formatFrenchDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.hello')}, {user.name}</h1>
        <p className="text-muted-foreground">
          {formatFrenchDate(today)}
        </p>
      </div>
      
      <div className="flex items-center">
        <button 
          className="relative p-2 rounded-full hover:bg-accent"
          onClick={handleNotificationsClick}
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
