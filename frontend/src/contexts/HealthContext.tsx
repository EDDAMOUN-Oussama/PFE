import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// --- INTERFACES ---
interface Goal {
  id: string; type: string; target: number; currentValue: number; progress: number; deadline?: string;
}
interface ExerciseEntry {
  id: string; name: string; type: string; duration: number; caloriesBurned: number; date: string;
}
interface FoodEntry {
  id: string; name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string;
}
interface WeightEntry { id: string; weight: number; date: string; }
interface DailyStats {
  caloriesConsumed: number; caloriesBurned: number; netCalories: number;
  exerciseMinutes: number; waterIntake: number;
}
interface User {
  id: string; name: string; email: string; currentWeight: number; goalWeight: number;
  height: number; birthdate: string; gender: string; activityLevel: string;
  goalCalories?: number; memberSince?: string;
}
interface HealthContextType {
  goals: Goal[];
  exerciseEntries: ExerciseEntry[];
  foodEntries: FoodEntry[];
  weightEntries: WeightEntry[];
  dailyStats: DailyStats;
  user: User | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  addWeightEntry: (weightEntry: { weight: number; date: string }) => Promise<void>;
  addFoodEntry: (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => Promise<void>;
  addExerciseEntry: (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string }) => Promise<void>;
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
    waterIntake: 0,
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateDailyStats = (
    foods: FoodEntry[],
    exercises: ExerciseEntry[]
  ): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    const todayFoods = foods.filter(f => f.date.startsWith(today));
    const todayExercises = exercises.filter(e => e.date.startsWith(today));

    const caloriesConsumed = todayFoods.reduce((sum, f) => sum + f.calories, 0);
    const caloriesBurned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
    const netCalories = caloriesConsumed - caloriesBurned;
    const exerciseMinutes = todayExercises.reduce((sum, e) => sum + e.duration, 0);
    
    return {
      caloriesConsumed,
      caloriesBurned,
      netCalories,
      exerciseMinutes,
      waterIntake: 3, 
    };
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

  const loadFoodEntries = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost/pfe/backend/controllers/getFoodEntries.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setFoodEntries(data.entries);
        setDailyStats(prev => calculateDailyStats(data.entries, exerciseEntries));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des aliments:", error);
    }
  };

  const fetchWeightEntries = async (userId: string) => {
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/getWeightEntries.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (result.success) {
        const entries: WeightEntry[] = result.entries.map((entry: any) => ({
          id: entry.id.toString(),
          weight: entry.weight,
          date: new Date(entry.date).toISOString(),
        }));
        setWeightEntries(entries);
      }
    } catch (error) {
      console.error('Erreur de fetch dans fetchWeightEntries:', error);
    }
  };

  const loadExerciseEntries = async (userId: string) => {
    try {
      const entries = await fetchExerciseEntries(Number(userId));
      setExerciseEntries(entries);
      setDailyStats(prev => calculateDailyStats(foodEntries, entries));
    } catch (err) {
      console.error("Erreur lors du chargement des exercices", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
  
    loadUser();
  
    Promise.all([
      fetch(`http://localhost/pfe/backend/controllers/getFoodEntries.php?user_id=${userId}`).then(res => res.json()),
      fetch(`http://localhost/pfe/backend/controllers/getExerciseEntries.php?user_id=${userId}`).then(res => res.json()),
    ])
      .then(([foodData, exerciseData]) => {
        if (foodData.success) setFoodEntries(foodData.entries);
        if (Array.isArray(exerciseData)) setExerciseEntries(exerciseData);
  
        const today = new Date().toISOString().split("T")[0];
        const todayFoods = foodData.success ? foodData.entries.filter((f: any) => f.date.startsWith(today)) : [];
        const todayExercises = Array.isArray(exerciseData) ? exerciseData.filter((e: any) => e.date.startsWith(today)) : [];
  
        const caloriesConsumed = todayFoods.reduce((sum: number, f: any) => sum + f.calories, 0);
        const caloriesBurned = todayExercises.reduce((sum: number, e: any) => sum + e.caloriesBurned, 0);
        const exerciseMinutes = todayExercises.reduce((sum: number, e: any) => sum + e.duration, 0);
  
        setDailyStats({
          caloriesConsumed,
          caloriesBurned,
          netCalories: caloriesConsumed - caloriesBurned,
          exerciseMinutes,
          waterIntake: 3,
        });
      })
      .catch(err => console.error("Erreur chargement données:", err));
  
    fetchWeightEntries(userId);
  }, []);
  

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
        toast.success(`Poids ajouté: ${weightEntry.weight} kg le ${weightEntry.date}`);
        setWeightEntries(prev => [...prev, { id: Date.now().toString(), ...weightEntry }]);
        await loadUser();
      }
      else {
        toast.error("Erreur lors de l'ajout de l'entrée de poids: " + result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion lors de l'ajout de l'entrée de poids.");
      console.error("Erreur dans addWeightEntry:", error);
    }
  };

  const addFoodEntry = async (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => {
    try {
      const userId = user?.id;
      const response = await fetch('http://localhost/pfe/backend/controllers/addFoodEntry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...foodEntry }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`Aliment ajouté: ${foodEntry.name} (${foodEntry.calories} cal)`);
        await loadFoodEntries(userId!);
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
        toast.success(`Exercice ajouté: ${exerciseEntry.name} (${exerciseEntry.caloriesBurned} cal)`);
        await loadExerciseEntries(userId!);
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
      exerciseEntries,
      foodEntries,
      weightEntries,
      dailyStats,
      user,
      isLoading,
      refetchUser: loadUser,
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










// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from "sonner";
// // --- INTERFACES ---
// interface Goal { id: string; type: string; target: number; currentValue: number; progress: number; deadline?: string; }
// interface ExerciseEntry { id: string; name: string; type: string; duration: number; caloriesBurned: number; date: string; }
// interface FoodEntry { id: string; name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string; }
// interface WeightEntry { id: string; weight: number; date: string; }
// interface DailyStats { caloriesConsumed: number; caloriesBurned: number; netCalories: number; exerciseMinutes: number; waterIntake: number; }

// // --- INTERFACE USER CORRIGÉE ---
// interface User { 
//   id: string; 
//   name: string; 
//   email: string; 
//   currentWeight: number; 
//   goalWeight: number; 
//   height: number; 
//   birthdate: string; // On remplace 'age' par 'birthdate' de type string
//   gender: string; 
//   activityLevel: string; 
//   goalCalories?: number; 
//   memberSince?: string; 
// }

// // --- TYPE DU CONTEXTE ---
// interface HealthContextType {
//   goals: Goal[];
//   exerciseEntries: ExerciseEntry[];
//   foodEntries: FoodEntry[];
//   weightEntries: WeightEntry[];
//   dailyStats: DailyStats;
//   user: User | null;
//   isLoading: boolean;
//   refetchUser: () => Promise<void>;
//   addWeightEntry: (weightEntry: { weight: number; date: string }) => void;
//   addFoodEntry: (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => void;
//   addExerciseEntry: (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number; date: string }) => void;
// }


// export async function fetchExerciseEntries(userId: number): Promise<ExerciseEntry[]> {
//   const res = await fetch(`http://localhost/pfe/backend/controllers/getExerciseEntries.php?user_id=${userId}`);
//   if (!res.ok) throw new Error("Erreur lors du chargement des exercices.");
//   return await res.json();
// }


// const HealthContext = createContext<HealthContextType | undefined>(undefined);

// // --- Données de test (pour les autres sections) ---
// const mockGoals: Goal[] = [ { id: '1', type: 'weight', target: 70, currentValue: 75, progress: 60, deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), }, { id: '2', type: 'calories', target: 2000, currentValue: 1800, progress: 80, }, { id: '3', type: 'exercise', target: 300, currentValue: 200, progress: 50, }, ];


// const mockExerciseEntries: ExerciseEntry[] = [ { id: '1', name: 'Course Matinale', type: 'cardio', duration: 30, caloriesBurned: 320, date: new Date().toISOString(), }, { id: '2', name: 'Musculation', type: 'strength', duration: 45, caloriesBurned: 280, date: new Date().toISOString(), }, ];


// const mockFoodEntries: FoodEntry[] = [ { id: '1', name: 'Flocons d\'Avoine', mealType: 'breakfast', calories: 350, protein: 12, carbs: 54, fat: 8, date: new Date().toISOString() }, { id: '2', name: 'Salade de Poulet', mealType: 'lunch', calories: 420, protein: 35, carbs: 15, fat: 22, date: new Date().toISOString() }, ];

// const mockWeightEntries: WeightEntry[] = [ { id: '1', weight: 75, date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString() }, { id: '2', weight: 74.5, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() }, ];

// const mockDailyStats: DailyStats = {
//   caloriesConsumed: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0),
//   caloriesBurned: mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
//   netCalories: mockFoodEntries.reduce((sum, entry) => sum + entry.calories, 0) - mockExerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
//   exerciseMinutes: mockExerciseEntries.reduce((sum, entry) => sum + entry.duration, 0),
//   waterIntake: 3,
// };



// export function HealthProvider({ children }: { children: React.ReactNode }) {
//   const [goals, setGoals] = useState<Goal[]>(mockGoals);
//   const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>(mockExerciseEntries);
//   const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
//   const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
//   const [dailyStats, setDailyStats] = useState<DailyStats>(mockDailyStats);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const loadUser = async () => {
//     const storedUserId = localStorage.getItem('user_id');
//     if (!storedUserId) {
//       console.log("Aucun user_id trouvé.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost/pfe/backend/controllers/getUser.php?id=${storedUserId}`);
//       if (!response.ok) throw new Error("Erreur réseau");
//       const data = await response.json();
//       if (data.success && data.user) {
//         setUser(data.user);
//         await fetchWeightEntries(data.user.id);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Erreur de fetch dans loadUser:", error);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadFoodEntries = async () => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) return;
  
//     try {
//       const response = await fetch(`http://localhost/pfe/backend/controllers/getFoodEntries.php?user_id=${userId}`);
//       const data = await response.json();
//       if (data.success) {
//         setFoodEntries(data.entries);
//         console.log('Entrées alimentaires chargées avec succès:', data.entries);
//       } else {
//         console.error('Erreur lors du chargement des entrées alimentaires:', data.message);
//       }
//     } catch (error) {
//       console.error('Erreur réseau lors du chargement des entrées alimentaires:', error);
//     }
//   };
  

//   const fetchWeightEntries = async (userId: string) => {
//     try {
//       const response = await fetch('http://localhost/pfe/backend/controllers/getWeightEntries.php', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         const entries: WeightEntry[] = result.entries.map((entry: any) => ({
//           id: entry.id.toString(),
//           weight: entry.weight,
//           date: new Date(entry.date).toISOString(),
//         }));
//         setWeightEntries(entries);
//       } else {
//         console.error('Erreur lors du chargement des poids:', result.message);
//       }
//     } catch (error) {
//       console.error('Erreur de fetch dans fetchWeightEntries:', error);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//     loadFoodEntries();
//     const userId = localStorage.getItem('user_id');
//     if (userId) {
//       fetchExerciseEntries(Number(userId)).then(setExerciseEntries);
//     }

//   }, []);

//   const addWeightEntry = async (weightEntry: { weight: number; date: string }) => { 
//     try {
//       const userId = user?.id;
//       const response = await fetch('http://localhost/pfe/backend/controllers/addWeightEntry.php', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, ...weightEntry }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         const newEntry: WeightEntry = { id: Date.now().toString(), ...weightEntry };
//         setWeightEntries(prev => [...prev, newEntry]);
//         await loadUser();
//         console.log(`Weight added: ${weightEntry.weight} kg on ${weightEntry.date}`);
//       }
//       else {
//         console.error("Erreur lors de l'ajout de l'entrée de poids:", result.message);
//       }
//     } catch (error) {
//       console.error("Erreur de fetch dans addWeightEntry:", error);
//     }
//   };


// const addFoodEntry = async (foodEntry: { name: string; mealType: string; calories: number; protein?: number; carbs?: number; fat?: number; date: string }) => {
//   try {
//     console.log("Ajout de l'entrée alimentaire:", foodEntry);
//     const userId = localStorage.getItem('user_id');
//     const response = await fetch('http://localhost/pfe/backend/controllers/addFoodEntry.php', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, ...foodEntry }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       await loadFoodEntries();
//     } else {
//       console.error("Erreur lors de l'ajout d'un aliment:", result.message);
//     }
//   } catch (error) {
//     console.error("Erreur réseau dans addFoodEntry:", error);
//   }
// };



// const addExerciseEntry = async (exerciseEntry: { name: string; type: string; duration: number; caloriesBurned: number }) => {
//   try {
//     const userId = localStorage.getItem('user_id');
//     const response = await fetch('http://localhost/pfe/backend/controllers/addExerciseEntry.php', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, ...exerciseEntry, date: new Date().toISOString() }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       const newEntry: ExerciseEntry = { id: Date.now().toString(), ...exerciseEntry, date: new Date().toISOString() };
//       setExerciseEntries(prev => [...prev, newEntry]);
//       toast.success("Exercice ajouté avec succès !");
//     } else {
//       toast.error("Erreur lors de l'ajout de l'exercice : " + result.message);
//       console.error("Erreur lors de l'ajout d'un exercice:", result.message);
//     }
//   } catch (error) {
//     toast.error("Erreur réseau lors de l'ajout de l'exercice.");
//     console.error("Erreur réseau dans addExerciseEntry:", error);
//   }
// };

//   return (
//     <HealthContext.Provider value={{
//       goals,
//       exerciseEntries,
//       foodEntries,
//       weightEntries,
//       dailyStats,
//       user,
//       isLoading,
//       refetchUser: loadUser,
//       addWeightEntry,
//       addFoodEntry,
//       addExerciseEntry
//     }}>
//       {children}
//     </HealthContext.Provider>
//   );
// }

// export const useHealth = () => {
//   const context = useContext(HealthContext);
//   if (context === undefined) {
//     throw new Error('useHealth doit être utilisé à l\'intérieur d\'un HealthProvider');
//   }
//   return context;
// };
