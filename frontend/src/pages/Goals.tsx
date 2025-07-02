import { useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import {
  Target, Scale, Activity, Utensils, Trophy, Plus, Pencil, Trash2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import AddGoalForm from '@/components/goals/AddGoalForm';
import { toast } from 'sonner';
import { HealthProvider } from '@/contexts/HealthContext';


const GoalsPageContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const { goals, updateGoal, deleteGoal } = useHealth();

  const iconForType = (type: string) => {
    switch (type) {
      case 'weight':
        return <Scale className="mr-2 h-5 w-5 text-primary" />;
      case 'exercise':
        return <Activity className="mr-2 h-5 w-5 text-primary" />;
      case 'calories':
        return <Utensils className="mr-2 h-5 w-5 text-primary" />;
      default:
        return <Target className="mr-2 h-5 w-5 text-primary" />;
    }
  };

  const formatValue = (type: string, value: number) => {
    if (type === 'weight') return `${value} kg`;
    if (type === 'calories') return `${value} cal`;
    if (type === 'exercise') return `${value} min`;
    return value;
  };

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Objectifs</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const remaining = goal.target - goal.currentValue;
            const progress = Math.min((goal.currentValue / goal.target) * 100, 100);
            return (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center">
                      {iconForType(goal.type)}
                      {goal.title}
                    </CardTitle>
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardDescription>
                    Cible : {formatValue(goal.type, goal.target)}
                    {goal.deadline && ` d'ici le ${new Date(goal.deadline).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Actuel : {formatValue(goal.type, goal.currentValue)}</span>
                      <span className="text-sm font-medium">Cible : {formatValue(goal.type, goal.target)}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {remaining > 0
                        ? `${formatValue(goal.type, remaining)} restants • ${Math.round(progress)}% terminé`
                        : `Objectif atteint 🎉`}
                    </p>

                    <div className="flex justify-end gap-2 mt-4">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button> */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            await deleteGoal(goal.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Ajouter un nouvel objectif */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Créer un Nouvel Objectif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Définir des objectifs clairs vous aide à rester motivé.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  setIsDialogOpen(false);
                  setEditingGoal(null);
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {editingGoal ? "Modifier l'objectif" : "Créer un objectif"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingGoal ? "Modifier un objectif" : "Créer un objectif"}</DialogTitle>
                  </DialogHeader>
                  <AddGoalForm
                    // initialGoal={editingGoal}
                    onFinished={() => {
                      setIsDialogOpen(false);
                      setEditingGoal(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const GoalsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <GoalsPageContent />
      </div>
    </HealthProvider>
  );
};

export default GoalsPage;

// import { useState } from 'react';
// import { HealthProvider } from '@/contexts/HealthContext';
// import Sidebar from '@/components/Sidebar';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Target, Scale, Activity, Utensils, Trophy, Plus } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import AddGoalForm from '@/components/goals/AddGoalForm';

// const GoalsPageContent = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   return (
//     <div className="flex-1 ml-64">
//       <div className="container p-6">
//         <h1 className="text-3xl font-bold mb-6">Objectifs</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-xl font-bold flex items-center">
//                   <Scale className="mr-2 h-5 w-5 text-primary" />
//                   Objectif de Poids
//                 </CardTitle>
//                 <Trophy className="h-6 w-6 text-primary" />
//               </div>
//               <CardDescription>Cible : 75 kg d'ici le 31 décembre 2023</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium">Actuel : 82 kg</span>
//                   <span className="text-sm font-medium">Cible : 75 kg</span>
//                 </div>
//                 <Progress value={40} className="h-2" />
//                 <p className="text-sm text-muted-foreground">7 kg restants • 40% terminé</p>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-xl font-bold flex items-center">
//                   <Activity className="mr-2 h-5 w-5 text-primary" />
//                   Objectif d'Exercice
//                 </CardTitle>
//                 <Trophy className="h-6 w-6 text-primary" />
//               </div>
//               <CardDescription>Cible : 150 minutes par semaine</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium">Actuel : 95 min</span>
//                   <span className="text-sm font-medium">Cible : 150 min</span>
//                 </div>
//                 <Progress value={63} className="h-2" />
//                 <p className="text-sm text-muted-foreground">55 min restantes • 63% terminé</p>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-xl font-bold flex items-center">
//                   <Utensils className="mr-2 h-5 w-5 text-primary" />
//                   Objectif de Calories
//                 </CardTitle>
//                 <Trophy className="h-6 w-6 text-primary" />
//               </div>
//               <CardDescription>Cible : 2 200 calories par jour</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium">Moyenne : 1 850 cal</span>
//                   <span className="text-sm font-medium">Cible : 2 200 cal</span>
//                 </div>
//                 <Progress value={84} className="h-2" />
//                 <p className="text-sm text-muted-foreground">350 cal sous la cible • 84% de l'objectif</p>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-xl font-bold flex items-center">
//                 <Target className="mr-2 h-5 w-5 text-primary" />
//                 Créer un Nouvel Objectif
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground mb-4">
//                 Définir des objectifs clairs et mesurables vous aide à rester motivé dans votre parcours de santé.
//               </p>
//               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button className="w-full">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Cliquez ici pour créer un nouvel objectif de santé ou de fitness
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px]">
//                   <DialogHeader>
//                     <DialogTitle>Créer un nouvel objectif</DialogTitle>
//                   </DialogHeader>
//                   <AddGoalForm onFinished={() => setIsDialogOpen(false)} />
//                 </DialogContent>
//               </Dialog>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoalsPage = () => {
//   return (
//     <HealthProvider>
//       <div className="flex min-h-screen bg-background">
//         <Sidebar />
//         <GoalsPageContent />
//       </div>
//     </HealthProvider>
//   );
// };

// export default GoalsPage;
