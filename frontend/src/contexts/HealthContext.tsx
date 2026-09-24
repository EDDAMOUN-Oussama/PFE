import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { dailyTotals, localDate } from '@/lib/health';
import type { User, Goal, FoodEntry, ExerciseEntry, WeightEntry } from '@/types/health';
interface HealthState { user: User | null; goals: Goal[]; foodEntries: FoodEntry[]; exerciseEntries: ExerciseEntry[]; weightEntries: WeightEntry[]; }
const empty: HealthState = { user: null, goals: [], foodEntries: [], exerciseEntries: [], weightEntries: [] };
function useHealthState() {
  const [state, setState] = useState<HealthState>(empty);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true); setError(null);
    try {
      const session = await api<{ user: User | null }>('session.php');
      if (request !== generation.current) return;
      if (!session.user) {
        localStorage.removeItem('user_id'); localStorage.removeItem('user');
        setState(empty); return;
      }
      const id = String(session.user.id);
      const [profile, foods, exercises, weights, goals] = await Promise.all([
        api<{ user: User }>(`getUser.php?id=${id}`),
        api<{ entries: FoodEntry[] }>(`getFoodEntries.php?user_id=${id}`),
        api<{ entries: ExerciseEntry[] }>(`getExerciseEntries.php?user_id=${id}`),
        api<{ entries: WeightEntry[] }>(`getWeightEntries.php?user_id=${id}`),
        api<{ goals: Goal[] }>(`getGoals.php?user_id=${id}`),
      ]);
      if (request !== generation.current) return;
      const user = { ...profile.user, id, currentWeight: Number(profile.user.currentWeight), goalWeight: Number(profile.user.goalWeight), height: Number(profile.user.height), goalCalories: Number(profile.user.goalCalories) };
      localStorage.setItem('user_id', id);
      setState({ user, foodEntries: foods.entries.map(f => ({ ...f, id: String(f.id), calories: Number(f.calories), protein: Number(f.protein), carbs: Number(f.carbs), fats: Number(f.fats) })),
        exerciseEntries: exercises.entries.map(e => ({ ...e, id: String(e.id), duration: Number(e.duration), caloriesBurned: Number(e.caloriesBurned) })),
        weightEntries: weights.entries.map(w => ({ ...w, id: String(w.id), weight: Number(w.weight) })),
        goals: goals.goals.map(g => ({ ...g, id: String(g.id), currentValue: Number(g.currentValue), target: Number(g.target), progress: Number(g.progress) })) });
    } catch (e) { if (request === generation.current) { setError(e instanceof Error ? e.message : 'Chargement impossible.'); setState(empty); } }
    finally { if (request === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const requestGeneration = generation;
    void refresh();
    const unauthorized = () => { generation.current++; setState(empty); setLoading(false); };
    const authenticated = () => { void refresh(); };
    window.addEventListener('healthytrack:unauthorized', unauthorized);
    window.addEventListener('healthytrack:authenticated', authenticated);
    return () => { requestGeneration.current++; window.removeEventListener('healthytrack:unauthorized', unauthorized); window.removeEventListener('healthytrack:authenticated', authenticated); };
  }, [refresh]);
  const mutate = useCallback(async (endpoint: string, value: object) => {
    if (!state.user) throw new Error('Veuillez vous connecter.');
    await api(endpoint, { ...value, userId: state.user.id });
    await refresh();
  }, [state.user, refresh]);
  const dailyStats = useMemo(() => dailyTotals(state.foodEntries,state.exerciseEntries,state.weightEntries,state.user?.currentWeight),[state]);
  return { ...state, dailyStats, isLoading, error, refetchUser: refresh, loadGoals: refresh, fetchDailyStats: refresh,
    addGoal: (g: Omit<Goal,'id'>) => mutate('addGoal.php',g), updateGoal: (g: Goal) => mutate('updateGoal.php',g), deleteGoal: (goalId: string) => mutate('deleteGoal.php',{ goalId }),
    addFoodEntry: (f: Omit<FoodEntry,'id'>) => mutate('addFoodEntry.php',f), addExerciseEntry: (e: Omit<ExerciseEntry,'id'>) => mutate('addExerciseEntry.php',e), addWeightEntry: (w: Omit<WeightEntry,'id'>) => mutate('addWeightEntry.php',w),
    updateDailyStats: () => mutate('updateDailyStats.php',{ date: localDate() }),
  };
}
const HealthContext = createContext<ReturnType<typeof useHealthState> | undefined>(undefined);
function HealthRoot({ children }: { children: ReactNode }) {
  const value = useHealthState();
  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}
export function HealthProvider({ children }: { children: ReactNode }) {
  const parent = useContext(HealthContext);
  return parent ? <>{children}</> : <HealthRoot>{children}</HealthRoot>;
}
export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('HealthProvider manquant.');
  return context;
}
