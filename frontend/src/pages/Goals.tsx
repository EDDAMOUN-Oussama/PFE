
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Scale, Activity, Utensils, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GoalsPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Objectifs</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-primary" />
                  Objectif de Poids
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Cible : 75 kg d'ici le 31 décembre 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Actuel : 82 kg</span>
                  <span className="text-sm font-medium">Cible : 75 kg</span>
                </div>
                <Progress value={40} className="h-2" />
                <p className="text-sm text-muted-foreground">7 kg restants • 40% terminé</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Objectif d'Exercice
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Cible : 150 minutes par semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Actuel : 95 min</span>
                  <span className="text-sm font-medium">Cible : 150 min</span>
                </div>
                <Progress value={63} className="h-2" />
                <p className="text-sm text-muted-foreground">55 min restantes • 63% terminé</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-primary" />
                  Objectif de Calories
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Cible : 2 200 calories par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Moyenne : 1 850 cal</span>
                  <span className="text-sm font-medium">Cible : 2 200 cal</span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-sm text-muted-foreground">350 cal sous la cible • 84% de l'objectif</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Créer un Nouvel Objectif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Définir des objectifs clairs et mesurables vous aide à rester motivé dans votre parcours de santé.
              </p>
              <div className="border rounded-md p-4 text-center">
                <p>Cliquez ici pour créer un nouvel objectif de santé ou de fitness</p>
              </div>
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
