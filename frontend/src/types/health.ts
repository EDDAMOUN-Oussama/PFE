export interface User {
  id: string; name: string; email: string; birthdate: string; gender: string;
  currentWeight: number; goalWeight: number; height: number; goalCalories: number; activityLevel: string;
  role: 'user' | 'admin' | 'specialist'; memberSince?: string;
  specialist_request_status?: 'pending' | 'approved' | 'rejected';
}
export interface Goal { id: string; title: string; type: string; target: number; startValue?: number; currentValue: number; progress: number; deadline?: string; }
export interface ExerciseEntry { id: string; name: string; type: string; duration: number; caloriesBurned: number; date: string; }
export interface FoodEntry { id: string; name: string; maleType: string; calories: number; protein?: number; carbs?: number; fats?: number; date: string; }
export interface WeightEntry { id: string; weight: number; date: string; }
export interface DailyStats { caloriesConsumed: number; caloriesBurned: number; netCalories: number; exerciseMinutes: number; currentWeight: number; }
