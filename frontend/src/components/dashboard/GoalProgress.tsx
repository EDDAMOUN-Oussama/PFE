import { useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Target, TrendingUp, Check } from 'lucide-react';

const GoalProgress = () => {
  const { goals } = useHealth();
  const { t } = useI18n();

  // --- GARDE DE SÉCURITÉ ---
  // On s'assure que les données existent avant d'essayer de les afficher.
  if (!goals || goals.length === 0) {
    return (
      <div className="health-card">
        <div className="health-card-header">
          <h3 className="health-card-title">{t('dashboard.goalsProgress')}</h3>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          {t('dashboard.noGoals')}
        </div>
      </div>
    );
  }
  // -------------------------

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

  const formatValue = (type: string, value: number) => {
    // Ajout d'une sécurité pour les valeurs undefined ou null
    const safeValue = value ?? 0;
    switch (type) {
      case 'weight': return `${safeValue} kg`;
      case 'calories': return `${safeValue} kcal`;
      case 'exercise': return `${safeValue} min`;
      default: return safeValue.toString();
    }
  };

  return (
    <div className="health-card">
      <div className="health-card-header">
        <h3 className="health-card-title">Objectifs et Progrès</h3>
        <Target className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4 p-4"> {/* J'ai ajouté un padding ici pour la cohérence */}
        {goals.map((goal) => {
          const info = goalTypeInfo[goal.type];
          if (!info) {
            // Ce bloc gère les types d'objectifs inconnus, c'est une très bonne pratique !
            return null; // On peut choisir de ne rien afficher pour un objectif inconnu
          }

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full ${info.color} text-white flex items-center justify-center mr-2 flex-shrink-0`}>
                    {info.icon}
                  </div>
                  <span className="font-medium text-sm">{info.label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatValue(goal.type, goal.currentValue)} / {formatValue(goal.type, goal.target)}
                </div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${info.color} rounded-full transition-all duration-500`} 
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