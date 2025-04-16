
import { useHealth } from '@/contexts/HealthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalorieTracker = () => {
  const { foodEntries, dailyStats, user } = useHealth();
  
  const goalCalories = user.goalCalories || 2000;
  const remainingCalories = Math.max(0, goalCalories - dailyStats.caloriesConsumed);
  
  // Data for pie chart
  const data = [
    { name: 'Consumed', value: dailyStats.caloriesConsumed, color: '#0ea5e9' },
    { name: 'Remaining', value: remainingCalories, color: '#e4e4e7' },
  ];
  
  // Calculate macros
  const getTotalMacros = () => {
    return foodEntries.reduce(
      (acc, entry) => ({
        protein: acc.protein + (entry.protein || 0),
        carbs: acc.carbs + (entry.carbs || 0),
        fat: acc.fat + (entry.fat || 0)
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  };
  
  const macros = getTotalMacros();

  return (
    <div className="health-card">
      <div className="health-card-header">
        <h3 className="health-card-title">Today's Nutrition</h3>
        <Button size="sm" variant="outline" className="h-8">
          <Plus className="h-4 w-4 mr-1" /> Add Food
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} kcal`, null]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Consumed</span>
              <span className="text-sm font-medium">{dailyStats.caloriesConsumed} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Goal</span>
              <span className="text-sm font-medium">{goalCalories} kcal</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Protein</span>
                <span>{Math.round(macros.protein)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, (macros.protein / (goalCalories * 0.25 / 4)) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Carbs</span>
                <span>{Math.round(macros.carbs)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${Math.min(100, (macros.carbs / (goalCalories * 0.5 / 4)) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Fat</span>
                <span>{Math.round(macros.fat)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${Math.min(100, (macros.fat / (goalCalories * 0.25 / 9)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Today's Meals</h4>
        <div className="space-y-2">
          {foodEntries.length > 0 ? (
            foodEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{entry.mealType}</p>
                </div>
                <p className="font-medium">{entry.calories} kcal</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No meals recorded today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
