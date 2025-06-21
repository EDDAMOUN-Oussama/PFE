import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';

// Importez tous les composants de votre tableau de bord
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import WeightChart from '@/components/dashboard/WeightChart';
import CalorieTracker from '@/components/dashboard/CalorieTracker';
import ExerciseLog from '@/components/dashboard/ExerciseLog';
import GoalProgress from '@/components/dashboard/GoalProgress';

// Importez une icône pour le chargement
import { Loader2 } from 'lucide-react';

/**
 * Ce composant interne gère la logique d'affichage.
 */
const DashboardContent = () => {
  const { user, isLoading } = useHealth();

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex w-full h-full items-center justify-center py-20">
        <p className="text-red-500">Erreur : Les données du tableau de bord n'ont pas pu être chargées.</p>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <DashboardHeader />
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <WeightChart />
        <GoalProgress />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalorieTracker />
        <ExerciseLog />
      </div>
    </div>
  );
};


/**
 * C'est votre composant de page principal, maintenant simplifié.
 */
const Index = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64">
          <DashboardContent />
        </main>
      </div>
    </HealthProvider>
  );
};

export default Index;














// import { HealthProvider } from '@/contexts/HealthContext';
// import Sidebar from '@/components/Sidebar';
// import DashboardHeader from '@/components/dashboard/DashboardHeader';
// import StatCards from '@/components/dashboard/StatCards';
// import WeightChart from '@/components/dashboard/WeightChart';
// import CalorieTracker from '@/components/dashboard/CalorieTracker';
// import ExerciseLog from '@/components/dashboard/ExerciseLog';
// import GoalProgress from '@/components/dashboard/GoalProgress';

// const Index = () => {
//   return (
//     <HealthProvider>
//       <div className="flex min-h-screen bg-background">
//         <Sidebar />
        
//         <div className="flex-1 ml-64">
//           <div className="container p-6">
//             <DashboardHeader />
            
//             <StatCards />
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//               <WeightChart />
//               <GoalProgress />
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <CalorieTracker />
//               <ExerciseLog />
//             </div>
//           </div>
//         </div>
//       </div>
//     </HealthProvider>
//   );
// };

// export default Index;
