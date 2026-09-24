import type { DailyStats, ExerciseEntry, FoodEntry, WeightEntry } from '@/types/health';
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function dailyTotals(foods: FoodEntry[], exercises: ExerciseEntry[], weights: WeightEntry[], fallbackWeight = 0, today = localDate()): DailyStats {
  const caloriesConsumed = foods.filter(f => f.date.slice(0,10) === today).reduce((s,f) => s + Number(f.calories),0);
  const currentExercises = exercises.filter(e => e.date.slice(0,10) === today);
  const caloriesBurned = currentExercises.reduce((s,e) => s + Number(e.caloriesBurned),0);
  const currentWeight = [...weights].filter(w => w.date.slice(0,10) <= today).sort((a,b) => b.date.localeCompare(a.date) || Number(b.id)-Number(a.id))[0]?.weight ?? fallbackWeight;
  return { caloriesConsumed, caloriesBurned, netCalories: caloriesConsumed-caloriesBurned, exerciseMinutes: currentExercises.reduce((s,e) => s+Number(e.duration),0), currentWeight: Number(currentWeight) };
}
