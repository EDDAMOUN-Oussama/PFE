
import { useHealth } from '@/contexts/HealthContext';
import { TrendingDown, TrendingUp, Utensils, Dumbbell, Scale } from 'lucide-react';

const StatCards = () => {
  const { dailyStats, user } = useHealth();
  
  const calculateCaloriesRemaining = () => {
    const goalCalories = user.goalCalories || 2000;
    const remaining = goalCalories - dailyStats.netCalories;
    return remaining;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">Weight</h3>
          <Scale className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{user.currentWeight}</span>
          <span className="ml-1 text-muted-foreground">kg</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          {user.currentWeight && user.goalWeight && user.currentWeight > user.goalWeight ? (
            <>
              <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">{(user.currentWeight - user.goalWeight).toFixed(1)} kg to goal</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-1 text-primary" />
              <span className="text-primary">Maintaining</span>
            </>
          )}
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">Calories Consumed</h3>
          <Utensils className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{dailyStats.caloriesConsumed}</span>
          <span className="ml-1 text-muted-foreground">kcal</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <TrendingDown className="h-4 w-4 mr-1 text-blue-500" />
          <span className="text-blue-500">{calculateCaloriesRemaining()} kcal remaining</span>
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">Calories Burned</h3>
          <Dumbbell className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{dailyStats.caloriesBurned}</span>
          <span className="ml-1 text-muted-foreground">kcal</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 mr-1 text-orange-500" />
          <span className="text-orange-500">{dailyStats.exerciseMinutes} minutes active</span>
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">Net Calories</h3>
          <Utensils className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{dailyStats.netCalories}</span>
          <span className="ml-1 text-muted-foreground">kcal</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          {dailyStats.netCalories < (user.goalCalories || 2000) ? (
            <>
              <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">Calorie deficit</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-500">Calorie surplus</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCards;
