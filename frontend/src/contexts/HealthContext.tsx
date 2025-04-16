
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WeightEntry, FoodEntry, ExerciseEntry, Goal, DailyStats } from '@/types/health';
import { subDays, format } from 'date-fns';

// Sample data for demonstration
const DEMO_USER: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  goalWeight: 75,
  currentWeight: 82,
  height: 180,
  age: 32,
  gender: 'male',
  goalCalories: 2200,
  activityLevel: 'moderate',
};

const generateSampleWeightData = (): WeightEntry[] => {
  const entries: WeightEntry[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    // Random weight between 80-84, with a slight downward trend
    const trendFactor = i / 30; // 1 to 0 as we get closer to today
    const randomVariation = Math.random() * 1.5 - 0.75; // -0.75 to 0.75
    const weight = 84 - (4 * (1 - trendFactor)) + randomVariation;
    
    entries.push({
      id: `weight-${i}`,
      date: format(date, 'yyyy-MM-dd'),
      weight: Number(weight.toFixed(1))
    });
  }
  return entries;
};

const generateSampleFoodData = (): FoodEntry[] => {
  return [
    { id: 'food-1', name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 60, fat: 6, date: format(new Date(), 'yyyy-MM-dd'), mealType: 'breakfast' },
    { id: 'food-2', name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 15, fat: 22, date: format(new Date(), 'yyyy-MM-dd'), mealType: 'lunch' },
    { id: 'food-3', name: 'Protein Shake', calories: 180, protein: 25, carbs: 10, fat: 3, date: format(new Date(), 'yyyy-MM-dd'), mealType: 'snack' },
    { id: 'food-4', name: 'Salmon with Vegetables', calories: 550, protein: 40, carbs: 25, fat: 30, date: format(new Date(), 'yyyy-MM-dd'), mealType: 'dinner' },
  ];
};

const generateSampleExerciseData = (): ExerciseEntry[] => {
  return [
    { id: 'exercise-1', name: 'Morning Run', duration: 30, caloriesBurned: 320, date: format(new Date(), 'yyyy-MM-dd'), type: 'cardio' },
    { id: 'exercise-2', name: 'Weight Training', duration: 45, caloriesBurned: 280, date: format(new Date(), 'yyyy-MM-dd'), type: 'strength' },
    { id: 'exercise-3', name: 'Evening Yoga', duration: 20, caloriesBurned: 120, date: format(new Date(), 'yyyy-MM-dd'), type: 'flexibility' },
  ];
};

const generateSampleGoals = (): Goal[] => {
  return [
    { id: 'goal-1', type: 'weight', target: 75, currentValue: 82, deadline: '2023-12-31', progress: 40 },
    { id: 'goal-2', type: 'calories', target: 2200, currentValue: 1850, progress: 84 },
    { id: 'goal-3', type: 'exercise', target: 150, currentValue: 95, deadline: '2023-11-30', progress: 63 },
  ];
};

const generateDailyStats = (): DailyStats => {
  const foodEntries = generateSampleFoodData();
  const exerciseEntries = generateSampleExerciseData();
  
  const caloriesConsumed = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const caloriesBurned = exerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
  const exerciseMinutes = exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    caloriesConsumed,
    caloriesBurned,
    netCalories: caloriesConsumed - caloriesBurned,
    weight: 82,
    exerciseMinutes,
  };
};

interface HealthContextType {
  user: User;
  weightEntries: WeightEntry[];
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  goals: Goal[];
  dailyStats: DailyStats;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  addExerciseEntry: (entry: Omit<ExerciseEntry, 'id'>) => void;
  updateUser: (userData: Partial<User>) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEMO_USER);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(generateSampleWeightData());
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(generateSampleFoodData());
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>(generateSampleExerciseData());
  const [goals, setGoals] = useState<Goal[]>(generateSampleGoals());
  const [dailyStats, setDailyStats] = useState<DailyStats>(generateDailyStats());

  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry = { ...entry, id: `weight-${Date.now()}` };
    setWeightEntries([...weightEntries, newEntry]);
    
    // Update current weight in user profile
    setUser({ ...user, currentWeight: entry.weight });
    
    // Update goal progress
    updateGoalProgress('weight', entry.weight);
  };

  const addFoodEntry = (entry: Omit<FoodEntry, 'id'>) => {
    const newEntry = { ...entry, id: `food-${Date.now()}` };
    setFoodEntries([...foodEntries, newEntry]);
    
    // Update daily stats
    const newCaloriesConsumed = dailyStats.caloriesConsumed + entry.calories;
    setDailyStats({
      ...dailyStats,
      caloriesConsumed: newCaloriesConsumed,
      netCalories: newCaloriesConsumed - dailyStats.caloriesBurned
    });
    
    // Update goal progress
    updateGoalProgress('calories', newCaloriesConsumed);
  };

  const addExerciseEntry = (entry: Omit<ExerciseEntry, 'id'>) => {
    const newEntry = { ...entry, id: `exercise-${Date.now()}` };
    setExerciseEntries([...exerciseEntries, newEntry]);
    
    // Update daily stats
    const newCaloriesBurned = dailyStats.caloriesBurned + entry.caloriesBurned;
    const newExerciseMinutes = dailyStats.exerciseMinutes + entry.duration;
    
    setDailyStats({
      ...dailyStats,
      caloriesBurned: newCaloriesBurned,
      netCalories: dailyStats.caloriesConsumed - newCaloriesBurned,
      exerciseMinutes: newExerciseMinutes
    });
    
    // Update goal progress
    updateGoalProgress('exercise', newExerciseMinutes);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser({ ...user, ...userData });
  };

  const updateGoalProgress = (type: 'weight' | 'calories' | 'exercise', currentValue: number) => {
    setGoals(goals.map(goal => {
      if (goal.type === type) {
        const newProgress = calculateProgress(type, currentValue, goal.target);
        return { ...goal, currentValue, progress: newProgress };
      }
      return goal;
    }));
  };

  const calculateProgress = (type: 'weight' | 'calories' | 'exercise', current: number, target: number): number => {
    if (type === 'weight') {
      // For weight loss goals, we need to invert the calculation
      const startWeight = DEMO_USER.currentWeight || 0;
      const totalToLose = startWeight - target;
      const lost = startWeight - current;
      return totalToLose > 0 ? Math.min(100, (lost / totalToLose) * 100) : 100;
    }
    // For other goals (calories, exercise)
    return Math.min(100, (current / target) * 100);
  };

  return (
    <HealthContext.Provider
      value={{
        user,
        weightEntries,
        foodEntries,
        exerciseEntries,
        goals,
        dailyStats,
        addWeightEntry,
        addFoodEntry,
        addExerciseEntry,
        updateUser
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
