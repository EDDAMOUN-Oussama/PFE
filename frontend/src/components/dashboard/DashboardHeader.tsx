
import { useHealth } from '@/contexts/HealthContext';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';

const DashboardHeader = () => {
  const { user } = useHealth();
  const today = new Date();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Hello, {user.name}</h1>
        <p className="text-muted-foreground">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      <div className="flex items-center">
        <button className="relative p-2 rounded-full hover:bg-accent">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
