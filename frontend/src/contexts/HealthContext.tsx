
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for health data
interface Goal {
  id: string;
  title: string;
  type: string;
  target: number;
  currentValue: number;
  progress: number;
  deadline?: string;
}

interface ExerciseEntry {
  id: string;
  name: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

interface FoodEntry {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date: string;
}

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

interface DailyStats {
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  exerciseMinutes: number;
  waterIntake: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  currentWeight: number;
  goalWeight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goalCalories?: number;
}

interface HealthContextType {
  goals: Goal[];
  exerciseEntries: ExerciseEntry[];
  foodEntries: FoodEntry[];
  weightEntries: WeightEntry[];
  dailyStats: DailyStats;
  user: User;
  addWeightEntry: (weightEntry: { weight: number; date: string }) => void;
  addFoodEntry: (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => void;
  addExerciseEntry: (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string; }) => void;
  addGoal: (goal: { title: string; type: string; target: number; currentValue: number; progress: number; deadline?: string }) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Mock data
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Perdre du poids',
    type: 'weight',
    target: 70,
    currentValue: 75,
    progress: 60,
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
  },
  {
    id: '2',
    title: 'Calories quotidiennes',
    type: 'calories',
    target: 2000,
    currentValue: 1800,
    progress: 80,
  },
  {
    id: '3',
    title: 'Exercice hebdomadaire',
    type: 'exercise',
    target: 300,
    currentValue: 200,
    progress: 50,
  },
];

const mockExerciseEntries: ExerciseEntry[] = [
  {
    id: '1',
    name: 'Course Matinale',
    type: 'cardio',
    duration: 30,
    caloriesBurned: 320,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Musculation',
    type: 'strength',
    duration: 45,
    caloriesBurned: 280,
    date: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Yoga du Soir',
    type: 'flexibility',
    duration: 25,
    caloriesBurned: 120,
    date: new Date().toISOString(),
  },
];

const mockFoodEntries: FoodEntry[] = [
  {
    id: '1',
    name: 'Flocons d\'Avoine aux Baies',
    mealType: 'breakfast',
    calories: 350,
    protein: 12,
    carbs: 54,
    fat: 8,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Salade de Poulet Grillé',
    mealType: 'lunch',
    calories: 420,
    protein: 35,
    carbs: 15,
    fat: 22,
    date: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Shake Protéiné',
    mealType: 'snack',
    calories: 180,
    protein: 25,
    carbs: 8,
    fat: 3,
    date: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Saumon aux Légumes',
    mealType: 'dinner',
    calories: 480,
    protein: 38,
    carbs: 20,
    fat: 28,
    date: new Date().toISOString(),
  },
];

const mockWeightEntries: WeightEntry[] = [
  {
    id: '1',
    weight: 75,
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  },
  {
    id: '2',
    weight: 74.5,
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: '3',
    weight: 74.2,
    date: new Date().toISOString(),
  },
];

const mockDailyStats: DailyStats = {
  caloriesConsumed: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0),
  caloriesBurned: mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
  netCalories: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0) - mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
  exerciseMinutes: mockExerciseEntries.reduce((sum, entry) => sum + entry.duration, 0),
  waterIntake: 3,
};

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  currentWeight: 75,
  goalWeight: 70,
  height: 180,
  age: 30,
  gender: 'male',
  activityLevel: 'moderate',
  goalCalories: 2200,
};

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>(mockExerciseEntries);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(mockFoodEntries);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(mockWeightEntries);
  const [dailyStats, setDailyStats] = useState<DailyStats>(mockDailyStats);
  const [user] = useState<User>(mockUser);

  const addWeightEntry = (weightEntry: { weight: number; date: string }) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: weightEntry.weight,
      date: weightEntry.date,
    };
    setWeightEntries(prev => [...prev, newEntry]);
    console.log(`Weight added: ${weightEntry.weight} kg on ${weightEntry.date}`);
  };

  const addFoodEntry = (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: foodEntry.name,
      mealType: foodEntry.mealType,
      calories: foodEntry.calories,
      protein: foodEntry.protein,
      carbs: foodEntry.carbs,
      fat: foodEntry.fat,
      date: foodEntry.date,
    };
    setFoodEntries(prev => [...prev, newEntry]);
    
    // Update daily stats
    setDailyStats(prev => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + foodEntry.calories,
      netCalories: prev.netCalories + foodEntry.calories,
    }));
    
    console.log(`Food added: ${foodEntry.name} - ${foodEntry.calories} kcal`);
  };

  const addExerciseEntry = (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string; }) => {
    const newEntry: ExerciseEntry = {
      id: Date.now().toString(),
      ...exerciseEntry,
    };
    setExerciseEntries(prev => [newEntry, ...prev]);

    // Update daily stats
    setDailyStats(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + exerciseEntry.caloriesBurned,
      exerciseMinutes: prev.exerciseMinutes + exerciseEntry.duration,
      netCalories: prev.netCalories - exerciseEntry.caloriesBurned,
    }));
    
    console.log(`Exercise added: ${exerciseEntry.name} - ${exerciseEntry.duration} min`);
  };

  const addGoal = (goal: { title: string; type: string; target: number; currentValue: number; progress: number; deadline?: string }) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goal.title,
      type: goal.type,
      target: goal.target,
      currentValue: goal.currentValue,
      progress: goal.progress,
      deadline: goal.deadline,
    };
    setGoals(prev => [...prev, newGoal]);
    console.log(`Goal added: ${goal.title} - ${goal.type}`);
  };

  return (
    <HealthContext.Provider value={{ 
      goals, 
      exerciseEntries, 
      foodEntries, 
      weightEntries, 
      dailyStats, 
      user, 
      addWeightEntry,
      addFoodEntry,
      addExerciseEntry,
      addGoal
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
