import { title } from 'process';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// --- INTERFACES ---
interface Goal {
  id: string; title: string;  type: string;  target: number;  currentValue: number;  progress: number;  deadline?: string;
}
interface ExerciseEntry {
  id: string; name: string; type: string; duration: number; caloriesBurned: number; date: string;
}
interface FoodEntry {
  id: string; name: string; maleType: string; calories: number; protein?: number; carbs?: number; fats?: number; date: string;
}
interface WeightEntry { id: string; weight: number; date: string; }
interface DailyStats {
  caloriesConsumed: number; caloriesBurned: number; netCalories: number;
  exerciseMinutes: number; currentWeight: number;
}
interface User {
  id: string; name: string; email: string; currentWeight: number; goalWeight: number;
  height: number; birthdate: string; gender: string; activityLevel: string;
  goalCalories?: number; memberSince?: string;   role: 'user' | 'admin' | 'specialist';
  specialist_request_status?: 'pending' | 'approved' | 'rejected';
}
interface HealthContextType {
  goals: Goal[];
  exerciseEntries: ExerciseEntry[];
  foodEntries: FoodEntry[];
  weightEntries: WeightEntry[];
  dailyStats: DailyStats;
  user: User | null;
  isLoading: boolean;
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  refetchUser: () => Promise<void>;
  addWeightEntry: (weightEntry: { weight: number; date: string }) => Promise<void>;
  addFoodEntry: (foodEntry: { name: string; maleType: string; calories: number; protein?: number; carbs?: number; fats?: number; date: string }) => Promise<void>;
  addExerciseEntry: (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string }) => Promise<void>;
  updateDailyStats: (stats: DailyStats) => Promise<void>;
  fetchDailyStats: () => Promise<void>;
}

// --- CONTEXT ---
const HealthContext = createContext<HealthContextType | undefined>(undefined);

export async function fetchExerciseEntries(userId: number): Promise<ExerciseEntry[]> {
  const res = await fetch(`http://localhost/pfe/backend/controllers/getExerciseEntries.php?user_id=${userId}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des exercices.");
  return await res.json();
}

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    caloriesConsumed: 0,
    caloriesBurned: 0,
    netCalories: 0,
    exerciseMinutes: 0,
    currentWeight: 0,
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateDailyStats = (
    foods: FoodEntry[],
    exercises: ExerciseEntry[],
    weight: WeightEntry[],
  ): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    const todayFoods = foods.filter(f => f.date.startsWith(today));
    const todayExercises = exercises.filter(e => e.date.startsWith(today));

    const currentWeight = weight.find(w => w.date.startsWith(today))?.weight || 0;
    const caloriesConsumed = todayFoods.reduce((sum, f) => sum + f.calories, 0);
    const caloriesBurned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
    const netCalories = caloriesConsumed - caloriesBurned;
    const exerciseMinutes = todayExercises.reduce((sum, e) => sum + e.duration, 0);
    
    return {
      caloriesConsumed,
      caloriesBurned,
      netCalories,
      exerciseMinutes,
      currentWeight,
    };
  };

  const updateDailyStats = async (stats: DailyStats) => {
    const userId = localStorage.getItem('user_id');
    if (!userId)
    {
        toast.error("Utilisateur non connecté");
        return;
    }
    const date = new Date().toISOString().split('T')[0];
    try {
      console.log("Mise à jour des statistiques journalières:", {
        userId,
        date,
        caloriesConsumed: stats.caloriesConsumed,
        caloriesBurned: stats.caloriesBurned,
        weight: stats.currentWeight,
        exerciseMinutes: stats.exerciseMinutes,
      });
      const response = await fetch(`http://localhost/pfe/backend/controllers/updateDailyStats.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            date,
            caloriesConsumed: stats.caloriesConsumed,
            caloriesBurned: stats.caloriesBurned,
            weight: stats.currentWeight,
            exerciseMinutes: stats.exerciseMinutes,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        console.log("Statistiques journalières mises à jour avec succès");
      }
      else {
        console.error("Erreur lors de la mise à jour des statistiques journalières:", result.message);
      }
    } catch (error) {
      console.error("Erreur de connexion lors de la mise à jour des statistiques journalières:",
        error);
   }
  };
  

  const loadGoals = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId)
    {
      toast.error("Utilisateur non connecté");
      return;
    }

    try {
      const response = await fetch(`http://localhost/pfe/backend/controllers/getGoals.php?user_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setGoals(data.goals.map((g: any) => ({
          title: g.title,
          id: g.id.toString(),
          type: g.type,
          target: g.target,
          currentValue: g.currentValue,
          progress: g.progress,
          deadline: g.deadline
        })));
      } else {
        toast.error("Erreur lors du chargement des objectifs");
      }
    } catch (err) {
      console.error("Erreur réseau lors du chargement des objectifs", err);
      toast.error("Erreur de connexion");
    }
  };



  const loadUser = async () => {
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost/pfe/backend/controllers/getUser.php?id=${storedUserId}`);
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        await fetchAll(data.user.id);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur de fetch dans loadUser:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAll = async (userId: string) => {
    await Promise.all([loadFoodEntries(userId), fetchWeightEntries(userId), loadExerciseEntries(userId)]);
  };


  const fetchDailyStats = async () => {
    const userId = user?.id;
    if (!userId) return;
  
    try {
      const response = await fetch(`http://localhost/pfe/backend/controllers/getDailyStats.php?user_id=${userId}`);
      const result = await response.json();
  
      if (result.success && result.data) {
        setDailyStats(result.data);
      } else {
        console.warn("Aucune statistique quotidienne trouvée.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de DailyStats:", error);
    }
  };
  

  const loadFoodEntries = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost/pfe/backend/controllers/getFoodEntries.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setFoodEntries(data.entries);
        setDailyStats(prev => calculateDailyStats(data.entries, exerciseEntries, weightEntries));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des aliments:", error);
    }
  };

  const fetchWeightEntries = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost/pfe/backend/controllers/getWeightEntries.php?user_id=${userId}`);
      const result = await response.json();
      if (result.success) {
        const entries: WeightEntry[] = result.entries.map((entry: any) => ({
          id: entry.id.toString(),
          weight: entry.weight,
          date: new Date(entry.date).toISOString(),
        }));
        setWeightEntries(entries);
      }
    }
     catch (error) {
      console.error('Erreur de fetch dans fetchWeightEntries:', error);
    }
  };

  const loadExerciseEntries = async (userId: string) => {
    try {
      const entries = await fetchExerciseEntries(Number(userId));
      setExerciseEntries(entries);
      setDailyStats(prev => calculateDailyStats(foodEntries, entries, weightEntries));
    } catch (err) {
      console.error("Erreur lors du chargement des exercices", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
  
    loadUser();
    loadGoals();
  
    Promise.all([
      fetch(`http://localhost/pfe/backend/controllers/getFoodEntries.php?user_id=${userId}`).then(res => res.json()),
      fetch(`http://localhost/pfe/backend/controllers/getExerciseEntries.php?user_id=${userId}`).then(res => res.json()),
      fetch(`http://localhost/pfe/backend/controllers/getWeightEntries.php?user_id=${userId}`).then(res => res.json())
    ])
      .then(async ([foodData, exerciseData, weightData]) => {
        if (foodData.success) setFoodEntries(foodData.entries);
        if (exerciseData.success) setExerciseEntries(exerciseData.entries);
        if (weightData.success) setWeightEntries(weightData.entries);
  
        const today = new Date().toISOString().split("T")[0];
  
        const todayFoods = foodData.entries.filter((f: any) => f.date.startsWith(today));
        const todayExercises = exerciseData.entries.filter((e: any) => e.date.startsWith(today));
        const todayWeight = weightData.entries.find((w: any) => w.date.startsWith(today))?.weight || 0;
  
        const caloriesConsumed = todayFoods.reduce((sum: number, f: any) => sum + f.calories, 0);
        const caloriesBurned = todayExercises.reduce((sum: number, e: any) => sum + e.caloriesBurned, 0);
        const exerciseMinutes = todayExercises.reduce((sum: number, e: any) => sum + e.duration, 0);
  
        const stats = {
          caloriesConsumed,
          caloriesBurned,
          netCalories: caloriesConsumed - caloriesBurned,
          exerciseMinutes,
          currentWeight: todayWeight,
        };
  
        setDailyStats(stats);
        await updateDailyStats(stats);
      })
      .catch(err => console.error("Erreur chargement données:", err));
  
    fetchWeightEntries(userId);
  }, []);
  
  

  const addGoal = async (goal: {
    title: string;
    type: string;
    target: number;
    currentValue: number;
    progress: number;
    deadline?: string;
  }) => {
    try {
      const userId = user?.id;
      if (!userId) return;
  
      const response = await fetch('http://localhost/pfe/backend/controllers/addGoal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...goal }),
      });
  
      const result = await response.json();
      if (result.success) {
        const newGoal = result.goal;
        toast.success("Objectif ajouté !");
        setGoals(prev => [...prev, newGoal]); 
      } else {
        toast.error("Erreur lors de l'ajout de l'objectif: " + result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion.");
      console.error("Erreur dans addGoal:", error);
    }
  };
  
  

  const updateGoal = async (goal: Goal) => {
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/updateGoal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Objectif mis à jour");
        await loadGoals();
      } else {
        toast.error("Erreur mise à jour: " + result.message);
      }
    } catch (err) {
      console.error("Erreur dans updateGoal:", err);
      toast.error("Erreur réseau mise à jour.");
    }
  };
  
  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/deleteGoal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Objectif supprimé");
        await loadGoals();
      } else {
        toast.error("Erreur suppression: " + result.message);
      }
    } catch (err) {
      console.error("Erreur dans deleteGoal:", err);
      toast.error("Erreur réseau suppression.");
    }
  };
  
  
  const addWeightEntry = async (weightEntry: { weight: number; date: string }) => {
    try {
      const userId = user?.id;
      const response = await fetch('http://localhost/pfe/backend/controllers/addWeightEntry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...weightEntry }),
      });
      const result = await response.json();
      if (result.success) {
        const newEntry = { id: result.id, ...weightEntry };
        toast.success(`Poids ajouté: ${weightEntry.weight} kg le ${weightEntry.date}`);
        setWeightEntries(prev => [...prev, { id: Date.now().toString(), ...weightEntry }]);
        await loadUser();
        await fetchWeightEntries(userId!);
        const stats = calculateDailyStats(foodEntries, exerciseEntries, [...weightEntries, newEntry
        ]);
        setDailyStats(stats);
        await updateDailyStats(stats);
      }
      else {
        toast.error("Erreur lors de l'ajout de l'entrée de poids: " + result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion lors de l'ajout de l'entrée de poids.");
      console.error("Erreur dans addWeightEntry:", error);
    }
  };

  const addFoodEntry = async (foodEntry: { name: string; maleType: string; calories: number; protein?: number; carbs?: number; fats?: number; date: string }) => {
    try {
      const userId = user?.id;
      const response = await fetch('http://localhost/pfe/backend/controllers/addFoodEntry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...foodEntry }),
      });
      console.log("Ajout d'un aliment:", { userId, ...foodEntry });
      const result = await response.json();
      if (result.success) {
        const updatedFoodEntries = [...foodEntries, { ...foodEntry, id: result.id }];
        toast.success(`Aliment ajouté: ${foodEntry.name} (${foodEntry.calories} cal)`);
        await loadFoodEntries(userId!);
        setFoodEntries(updatedFoodEntries);
        const stats = calculateDailyStats(updatedFoodEntries, exerciseEntries, weightEntries);
        setDailyStats(stats);
        await updateDailyStats(stats);
      }
      else {
        toast.error("Erreur lors de l'ajout d'un aliment: " + result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion lors de l'ajout d'un aliment.");
      console.error("Erreur dans addFoodEntry:", error);
    }
  };

  const addExerciseEntry = async (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string }) => {
    try {
      const userId = user?.id;
      const response = await fetch('http://localhost/pfe/backend/controllers/addExerciseEntry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...exerciseEntry }),
      });
      const result = await response.json();
      if (result.success) {
        const updatedExerciseEntries = [...exerciseEntries, { ...exerciseEntry, id: result.id }];
        setExerciseEntries(updatedExerciseEntries);
        toast.success(`Exercice ajouté: ${exerciseEntry.name} (${exerciseEntry.caloriesBurned} cal)`);
        await loadExerciseEntries(userId!);
        const stats = calculateDailyStats(foodEntries, updatedExerciseEntries, weightEntries);
        setDailyStats(stats);
        await updateDailyStats(stats);
      }
      else {
        toast.error("Erreur lors de l'ajout d'un exercice: " + result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion lors de l'ajout d'un exercice.");
      console.error("Erreur dans addExerciseEntry:", error);
    }
  };

  return (
    <HealthContext.Provider value={{
      goals,
      loadGoals,
      addGoal,
      updateGoal,
      deleteGoal,
      exerciseEntries,
      foodEntries,
      weightEntries,
      dailyStats,
      user,
      isLoading,
      refetchUser: loadUser,
      addWeightEntry,
      addFoodEntry,
      addExerciseEntry,
      updateDailyStats,
      fetchDailyStats
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
