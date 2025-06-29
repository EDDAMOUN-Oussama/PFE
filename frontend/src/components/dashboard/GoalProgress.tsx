import { useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Target, TrendingUp, Check } from 'lucide-react';

const GoalProgress = () => {
  const { goals } = useHealth();
  const { t } = useI18n();

  // Map of goal types to their display info
  const goalTypeInfo: Record<string, { label: string; color: string; icon: JSX.Element }> = {
    weight: { 
      label: t('dashboard.weightGoalTitle'), 
      color: 'bg-blue-500', 
      icon: <TrendingUp className="h-4 w-4" />
    },
    calories: { 
      label: t('dashboard.dailyCalories'), 
      color: 'bg-green-500', 
      icon: <Check className="h-4 w-4" />
    },
    exercise: { 
      label: t('dashboard.weeklyExercise'), 
      color: 'bg-orange-500', 
      icon: <Target className="h-4 w-4" />
    },
  };

  // Format the value based on goal type
  const formatValue = (type: string, value: number) => {
    switch (type) {
      case 'weight':
        return `${value} kg`;
      case 'calories':
        return `${value} kcal`;
      case 'exercise':
        return `${value} min`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="health-card">
      <div className="health-card-header">
        <h3 className="health-card-title">{t('dashboard.goalsProgress')}</h3>
        <Target className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const info = goalTypeInfo[goal.type];
          if (!info) {
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center mr-2">
                      ?
                    </div>
                    <span className="font-medium">{t('dashboard.unknownGoalType')}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatValue(goal.type, goal.currentValue)} / {formatValue(goal.type, goal.target)}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 rounded-full" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            );
          }

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full ${info.color} text-white flex items-center justify-center mr-2`}>
                    {info.icon}
                  </div>
                  <span className="font-medium">{info.label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatValue(goal.type, goal.currentValue)} / {formatValue(goal.type, goal.target)}
                </div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${info.color} rounded-full`} 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              {goal.deadline && (
                <div className="text-xs text-right text-muted-foreground">
                  {t('dashboard.targetDate')}: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalProgress;
