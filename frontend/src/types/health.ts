
export interface User {
  id: string;
  name: string;
  email: string;
  goalWeight?: number;
  currentWeight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goalCalories?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date: string;
  maleType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface ExerciseEntry {
  id: string;
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
}

export interface Goal {
  id: string;
  type: 'weight' | 'calories' | 'exercise';
  target: number;
  currentValue: number;
  deadline?: string;
  progress: number; // percentage 0-100
}

export interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  weight?: number;
  exerciseMinutes: number;
}
