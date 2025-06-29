import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, Bike, StretchHorizontal, Timer, Activity, Plus, Dribbble, HeartPulse } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import AddExerciseForm from '@/components/exercises/AddExerciseForm';
import { useHealth, HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


const ExercisesPageContent = () => {
  const { exerciseEntries } = useHealth();
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
    const { goals } = useHealth();

  useEffect(() => {
    if (location.state?.openForm) {
      setShowAddForm(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getIconForType = (type: string) => {
    const baseClass = "h-5 w-5 mr-3 text-primary";
    switch (type) {
      case 'cardio':
        return <HeartPulse className={baseClass} />;
      case 'Musculation':
        return <Dumbbell className={baseClass} />;
      case 'Flexibilité':
        return <Bike className={baseClass} />;
      case 'sports':
        return <Dribbble className={baseClass} />;
      case 'Autre':
        return <Activity className={baseClass} />;
      default:
        return <Activity className={baseClass} />;
    }
  };
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "eeee, HH:mm", { locale: fr });
  };

  const getSummaryByType = (type: string) => {
    const filtered = exerciseEntries.filter((e) => e.type === type);
    const totalMinutes = filtered.reduce((sum, e) => sum + e.duration, 0);
    const totalCalories = filtered.reduce((sum, e) => sum + e.caloriesBurned, 0);
    return { totalMinutes, totalCalories };
  };

  const totalSummary = exerciseEntries.reduce(
    (acc, e) => {
      acc.minutes += e.duration;
      acc.calories += e.caloriesBurned;
      return acc;
    },
    { minutes: 0, calories: 0 }
  );


  const exerciseGoals = goals.filter(g => g.type === 'exercise');

  const totalTarget = exerciseGoals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrent = exerciseGoals.reduce((sum, g) => sum + g.currentValue, 0);
  
  const progress = totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0;
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

          {[...new Set(exerciseEntries.map(e => e.type))].map(type => {
          const { totalMinutes, totalCalories } = getSummaryByType(type);
          return { type, totalMinutes, totalCalories };
          }).sort((a, b) => b.totalCalories - a.totalCalories).slice(0, 2).map(({ type, totalMinutes, totalCalories }) => {
          const Icon = getIconForType(type);
          return (
          <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  {Icon}
                  {type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalMinutes} min</p>
                <p className="text-sm text-muted-foreground">{totalCalories} calories brûlées</p>
              </CardContent>
          </Card>
       );
  })}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Timer className="mr-2 h-5 w-5 text-primary" />
                Total Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalSummary.minutes} min</p>
              <p className="text-sm text-muted-foreground">{totalSummary.calories} calories brûlées</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Objectif Hebdomadaire d'Exercice</CardTitle>
            <CardDescription>{totalTarget} minutes d'activité physique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Progrès</span>
                <span className="text-sm text-muted-foreground">
                  {totalCurrent}/{totalTarget} min
                </span>
              </div>
              <Progress value={progress} />
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
                  <div
                    key={exercise.id}
                    className={`flex items-center justify-between ${
                      index < exerciseEntries.slice(0, 5).length - 1 ? 'border-b pb-4' : ''
                    }`}
                  >
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
