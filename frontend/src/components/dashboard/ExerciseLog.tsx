
import { useHealth } from '@/contexts/HealthContext';
import { Dumbbell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExerciseLog = () => {
  const { exerciseEntries } = useHealth();

  // Map of exercise types to their icon colors
  const typeColors: Record<string, string> = {
    cardio: 'text-red-500',
    strength: 'text-blue-500',
    flexibility: 'text-purple-500',
    sports: 'text-green-500',
    other: 'text-gray-500',
  };

  return (
    <div className="health-card">
      <div className="health-card-header">
        <h3 className="health-card-title">Today's Exercise</h3>
        <Button size="sm" variant="outline" className="h-8">
          <Plus className="h-4 w-4 mr-1" /> Log Exercise
        </Button>
      </div>
      
      <div className="mt-4 space-y-4">
        {exerciseEntries.length > 0 ? (
          exerciseEntries.map((exercise) => (
            <div key={exercise.id} className="flex items-center p-3 border border-border rounded-md">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors[exercise.type]} bg-accent`}>
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-muted-foreground capitalize">{exercise.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{exercise.caloriesBurned} kcal</p>
                <p className="text-sm text-muted-foreground">{exercise.duration} min</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No exercises logged today</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> Add Your First Exercise
            </Button>
          </div>
        )}
      </div>
      
      {exerciseEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Duration</span>
            <span className="font-medium">
              {exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0)} min
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Calories Burned</span>
            <span className="font-medium">
              {exerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0)} kcal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLog;
