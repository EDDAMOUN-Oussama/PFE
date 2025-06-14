
import { useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { TrendingDown, TrendingUp, Utensils, Dumbbell, Scale } from 'lucide-react';

const StatCards = () => {
  const { dailyStats, user } = useHealth();
  const { t } = useI18n();
  
  const calculateCaloriesRemaining = () => {
    const goalCalories = user.goalCalories || 2000;
    const remaining = goalCalories - dailyStats.netCalories;
    return remaining;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">{t('dashboard.weight')}</h3>
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
              <span className="text-green-500">{(user.currentWeight - user.goalWeight).toFixed(1)} kg {t('dashboard.toGoal')}</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-1 text-primary" />
              <span className="text-primary">{t('dashboard.maintaining')}</span>
            </>
          )}
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">{t('dashboard.caloriesConsumedTitle')}</h3>
          <Utensils className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{dailyStats.caloriesConsumed}</span>
          <span className="ml-1 text-muted-foreground">kcal</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <TrendingDown className="h-4 w-4 mr-1 text-blue-500" />
          <span className="text-blue-500">{calculateCaloriesRemaining()} kcal {t('dashboard.remaining')}</span>
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">{t('dashboard.caloriesBurnedTitle')}</h3>
          <Dumbbell className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline">
          <span className="health-stat">{dailyStats.caloriesBurned}</span>
          <span className="ml-1 text-muted-foreground">kcal</span>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 mr-1 text-orange-500" />
          <span className="text-orange-500">{dailyStats.exerciseMinutes} {t('dashboard.minutesActive')}</span>
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">{t('dashboard.netCalories')}</h3>
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
              <span className="text-green-500">{t('dashboard.calorieDeficit')}</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-500">{t('dashboard.calorieSurplus')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCards;
