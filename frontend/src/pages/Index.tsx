
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import WeightChart from '@/components/dashboard/WeightChart';
import CalorieTracker from '@/components/dashboard/CalorieTracker';
import ExerciseLog from '@/components/dashboard/ExerciseLog';
import GoalProgress from '@/components/dashboard/GoalProgress';

const Index = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          <div className="container p-6">
            <DashboardHeader />
            
            <StatCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <WeightChart />
              <GoalProgress />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalorieTracker />
              <ExerciseLog />
            </div>
          </div>
        </div>
      </div>
    </HealthProvider>
  );
};

export default Index;
