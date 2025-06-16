import React, { createContext, useContext, useState, useEffect } from 'react';

// --- INTERFACES ---
interface Goal { id: string; type: string; target: number; currentValue: number; progress: number; deadline?: string; }
interface ExerciseEntry { id: string; name: string; type: string; duration: number; caloriesBurned: number; date: string; }
interface FoodEntry { id: string; name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string; }
interface WeightEntry { id: string; weight: number; date: string; }
interface DailyStats { caloriesConsumed: number; caloriesBurned: number; netCalories: number; exerciseMinutes: number; waterIntake: number; }
interface User { id: string; name: string; email: string; currentWeight: number; goalWeight: number; height: number; age: number; gender: string; activityLevel: string; goalCalories?: number; memberSince?: string; }


// --- TYPE DU CONTEXTE (COMPLET) ---
interface HealthContextType {
  goals: Goal[];
  exerciseEntries: ExerciseEntry[];
  foodEntries: FoodEntry[];
  weightEntries: WeightEntry[];
  dailyStats: DailyStats;
  user: User | null;
  isLoading: boolean;
  addWeightEntry: (weightEntry: { weight: number; date: string }) => void;
  addFoodEntry: (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => void;
  addExerciseEntry: (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string; }) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// --- DONNÉES DE TEST ---
const mockGoals: Goal[] = [ { id: '1', type: 'weight', target: 70, currentValue: 75, progress: 60, deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), }, { id: '2', type: 'calories', target: 2000, currentValue: 1800, progress: 80, }, { id: '3', type: 'exercise', target: 300, currentValue: 200, progress: 50, }, ];
const mockExerciseEntries: ExerciseEntry[] = [ { id: '1', name: 'Course Matinale', type: 'cardio', duration: 30, caloriesBurned: 320, date: new Date().toISOString(), }, { id: '2', name: 'Musculation', type: 'strength', duration: 45, caloriesBurned: 280, date: new Date().toISOString(), }, ];
const mockFoodEntries: FoodEntry[] = [ { id: '1', name: 'Flocons d\'Avoine', mealType: 'breakfast', calories: 350, protein: 12, carbs: 54, fat: 8, date: new Date().toISOString() }, { id: '2', name: 'Salade de Poulet', mealType: 'lunch', calories: 420, protein: 35, carbs: 15, fat: 22, date: new Date().toISOString() }, ];
const mockWeightEntries: WeightEntry[] = [ { id: '1', weight: 75, date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString() }, { id: '2', weight: 74.5, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() }, ];
const mockDailyStats: DailyStats = { caloriesConsumed: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0), caloriesBurned: mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0), netCalories: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0) - mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0), exerciseMinutes: mockExerciseEntries.reduce((sum, entry) => sum + entry.duration, 0), waterIntake: 3, };

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>(mockExerciseEntries);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(mockFoodEntries);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(mockWeightEntries);
  const [dailyStats, setDailyStats] = useState<DailyStats>(mockDailyStats);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      fetch(`http://localhost/pfe/backend/controllers/getUser.php?id=${storedUserId}`)
        .then(response => {
          if (!response.ok) { throw new Error(`Erreur réseau : ${response.status} ${response.statusText}`); }
          return response.json();
        })
        .then(data => {
          if (data.success && data.user) { setUser(data.user); }
          else { console.error("Le serveur n'a pas pu récupérer l'utilisateur:", data.message); setUser(null); }
        })
        .catch(error => { console.error("Erreur de fetch dans HealthContext:", error); setUser(null); })
        .finally(() => { setIsLoading(false); });
    } else {
      console.log("Aucun user_id trouvé dans le localStorage, l'utilisateur doit se connecter.");
      setIsLoading(false);
    }
  }, []);

  const addWeightEntry = (weightEntry: { weight: number; date: string }) => {
    const newEntry: WeightEntry = { id: Date.now().toString(), ...weightEntry };
    setWeightEntries(prev => [...prev, newEntry]);
  };

  const addFoodEntry = (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => {
    const newEntry: FoodEntry = { id: Date.now().toString(), ...foodEntry, };
    setFoodEntries(prev => [...prev, newEntry]);
    setDailyStats(prev => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + foodEntry.calories,
      netCalories: prev.netCalories + foodEntry.calories,
    }));
  };

  const addExerciseEntry = (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string; }) => {
    const newEntry: ExerciseEntry = { id: Date.now().toString(), ...exerciseEntry, };
    setExerciseEntries(prev => [newEntry, ...prev]);
    setDailyStats(prev => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + exerciseEntry.caloriesBurned,
      exerciseMinutes: prev.exerciseMinutes + exerciseEntry.duration,
      netCalories: prev.netCalories - exerciseEntry.caloriesBurned,
    }));
  };

  return (
    <HealthContext.Provider value={{
      goals,
      exerciseEntries,
      foodEntries,
      weightEntries,
      dailyStats,
      user,
      isLoading,
      addWeightEntry,
      addFoodEntry,
      addExerciseEntry
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth doit être utilisé à l\'intérieur d\'un HealthProvider');
  }
  return context;
};