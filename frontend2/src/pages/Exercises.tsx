
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, Bike, Timer, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ExercisesPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Suivi des Exercices</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-primary" />
                Musculation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">45 min</p>
              <p className="text-sm text-muted-foreground">280 calories brûlées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Bike className="mr-2 h-5 w-5 text-primary" />
                Cardio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">30 min</p>
              <p className="text-sm text-muted-foreground">320 calories brûlées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Timer className="mr-2 h-5 w-5 text-primary" />
                Total Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">240 min</p>
              <p className="text-sm text-muted-foreground">1 750 calories brûlées</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Objectif Hebdomadaire d'Exercice</CardTitle>
            <CardDescription>150 minutes d'activité physique par semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Progrès</span>
                <span className="text-sm text-muted-foreground">95/150 min</span>
              </div>
              <Progress value={63} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Exercices Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Course Matinale</p>
                    <p className="text-sm text-muted-foreground">Aujourd'hui, 7h30</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">30 min</p>
                  <p className="text-sm text-muted-foreground">320 cal</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Entraînement de Force</p>
                    <p className="text-sm text-muted-foreground">Hier, 18h00</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">45 min</p>
                  <p className="text-sm text-muted-foreground">280 cal</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bike className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cyclisme</p>
                    <p className="text-sm text-muted-foreground">Il y a 2 jours, 17h30</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">60 min</p>
                  <p className="text-sm text-muted-foreground">450 cal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ExercisesPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <ExercisesPageContent />
      </div>
    </HealthProvider>
  );
};

export default ExercisesPage;
