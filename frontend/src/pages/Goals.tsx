import { useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
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
    <div className="app-content">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Objectifs</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const remaining = goal.target - goal.currentValue;
            let progress: number;
            if (goal.type !== 'weight') {
              progress = Math.min((goal.currentValue / goal.target) * 100, 100);
            } else {
              if (goal.currentValue === goal.target) {
                progress = 100;
              } else {
                progress = 50;
              }
            }
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
                    {goal.deadline && ` d'ici le ${new Date(goal.deadline).toISOString().split('T')[0]}`}
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

        <GoalsPageContent />
      </div>
    </HealthProvider>
  );
};

export default GoalsPage;
