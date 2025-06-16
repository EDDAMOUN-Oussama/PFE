import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHealth } from '@/contexts/HealthContext';
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, Bike, Timer, Activity, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import AddExerciseForm from '@/components/exercises/AddExerciseForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ExercisesPageContent = () => {
  const { exerciseEntries } = useHealth();
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (location.state?.openForm) {
      setShowAddForm(true);
      // Clear the state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'cardio':
        return <Bike className="h-5 w-5 mr-3 text-muted-foreground" />;
      case 'strength':
        return <Dumbbell className="h-5 w-5 mr-3 text-muted-foreground" />;
      case 'flexibility':
      case 'sports':
      case 'other':
      default:
        return <Activity className="h-5 w-5 mr-3 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "eeee, HH:mm", { locale: fr });
  };

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Suivi des Exercices</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> 
            {showAddForm ? "Masquer le formulaire" : "Ajouter un exercice"}
          </Button>
        </div>
        
        {showAddForm && <AddExerciseForm onFinished={() => setShowAddForm(false)} />}
        
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
            {exerciseEntries.length > 0 ? (
              <div className="space-y-4">
                {exerciseEntries.slice(0, 5).map((exercise, index) => (
                  <div key={exercise.id} className={`flex items-center justify-between ${index < exerciseEntries.slice(0, 5).length - 1 ? 'border-b pb-4' : ''}`}>
                    <div className="flex items-center">
                      {getIconForType(exercise.type)}
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {formatDate(exercise.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{exercise.duration} min</p>
                      <p className="text-sm text-muted-foreground">{exercise.caloriesBurned} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Dumbbell className="h-10 w-10 mx-auto mb-2" />
                <p>Aucun exercice enregistré pour aujourd'hui.</p>
              </div>
            )}
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
