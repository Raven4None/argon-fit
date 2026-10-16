import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyHealthMetrics,
  FoodEntry,
  MealCategory,
  UserProfile,
  WorkoutLogEntry,
} from '../types';
import {
  calculateStepCalories,
  getLocalDateString,
} from '../utils/energyCalculator';
import { ParsedFoodItem } from '../services/nutritionService';
import { syncWithAmazfitHealthConnect } from '../services/healthConnectService';

const STORAGE_KEY = '@argonfit_state_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Raven',
  age: 29,
  weightKg: 78,
  heightCm: 178,
  sex: 'male',
  activityLevel: 'moderate',
  goal: 'deficit',
  targetDeficitOrSurplus: -400,
  stepGoal: 10000,
  waterGoalMl: 2500,
  geminiApiKey: '',
  amazfitConnected: true,
  lastHealthConnectSync: 'Hoy, 09:30',
};

function buildInitialSeedData() {
  const today = new Date();
  const foods: FoodEntry[] = [];
  const workouts: WorkoutLogEntry[] = [];
  const dailyMetrics: Record<string, DailyHealthMetrics> = {};

  // Poblar últimos 6 días para que el recuento semanal y mensual tenga datos ricos desde el primer uso
  const sampleDays = [
    { offset: 6, steps: 8420, kcalIn: 2150, p: 155, c: 210, f: 68, sport: 'running' as const, sportTitle: 'Running Aeróbico 5K', sportMin: 28, sportKcal: 350 },
    { offset: 5, steps: 6900, kcalIn: 2080, p: 162, c: 195, f: 64, sport: 'weights' as const, sportTitle: 'Rutina Empuje (Pecho/Hombros)', sportMin: 45, sportKcal: 290 },
    { offset: 4, steps: 11850, kcalIn: 2450, p: 168, c: 260, f: 75, sport: 'soccer' as const, sportTitle: 'Fútbol 7 con amigos (Amazfit)', sportMin: 60, sportKcal: 640 },
    { offset: 3, steps: 7300, kcalIn: 1980, p: 158, c: 180, f: 62, sport: 'swimming' as const, sportTitle: 'Natación Crol 1200m', sportMin: 40, sportKcal: 395 },
    { offset: 2, steps: 9100, kcalIn: 2120, p: 164, c: 205, f: 66, sport: 'weights' as const, sportTitle: 'Rutina Tracción (Espalda/Bíceps)', sportMin: 45, sportKcal: 305 },
    { offset: 1, steps: 10240, kcalIn: 2050, p: 160, c: 192, f: 65, sport: 'walking' as const, sportTitle: 'Caminata Rápida Recuperación', sportMin: 40, sportKcal: 210 },
  ];

  for (const s of sampleDays) {
    const d = new Date(today);
    d.setDate(today.getDate() - s.offset);
    const dateStr = getLocalDateString(d);

    dailyMetrics[dateStr] = {
      date: dateStr,
      steps: s.steps,
      stepCalories: calculateStepCalories(s.steps, 78),
      restingHeartRate: 57,
      avgHeartRate: 74,
      sleepHours: 7.5,
      waterMl: 2250,
    };

    foods.push({
      id: `seed-food-${s.offset}`,
      date: dateStr,
      timestamp: '13:30',
      name: 'Registro Nutricional del Día',
      portionDesc: 'Desayuno, Almuerzo y Cena',
      calories: s.kcalIn,
      proteinG: s.p,
      carbsG: s.c,
      fatG: s.f,
      mealCategory: 'lunch',
      source: 'quick',
    });

    workouts.push({
      id: `seed-workout-${s.offset}`,
      date: dateStr,
      timestamp: '19:00',
      title: s.sportTitle,
      sportType: s.sport,
      durationMinutes: s.sportMin,
      caloriesBurned: s.sportKcal,
      avgHeartRate: s.sport === 'soccer' ? 156 : 138,
      intensity: s.sport === 'soccer' ? 'high' : 'moderate',
      source: 'amazfit_health_connect',
    });
  }

  // Datos iniciales para HOY
  const todayStr = getLocalDateString(today);
  dailyMetrics[todayStr] = {
    date: todayStr,
    steps: 6420,
    stepCalories: calculateStepCalories(6420, 78),
    restingHeartRate: 56,
    avgHeartRate: 71,
    sleepHours: 7.8,
    waterMl: 1500,
  };

  foods.push(
    {
      id: 'today-breakfast',
      date: todayStr,
      timestamp: '08:45',
      name: '3 Huevos revueltos + 2 Tostadas integrales + Café con leche',
      portionDesc: 'Desayuno proteico',
      calories: 500,
      proteinG: 33,
      carbsG: 41,
      fatG: 21,
      mealCategory: 'breakfast',
      source: 'ai_text',
    },
    {
      id: 'today-lunch',
      date: todayStr,
      timestamp: '13:20',
      name: 'Pechuga de pollo a la plancha (200g) con arroz y media palta',
      portionDesc: 'Plato principal',
      calories: 653,
      proteinG: 67,
      carbsG: 49,
      fatG: 19,
      mealCategory: 'lunch',
      source: 'ai_text',
    }
  );

  return { foods, workouts, dailyMetrics };
}

interface FitnessContextValue {
  profile: UserProfile;
  foods: FoodEntry[];
  workouts: WorkoutLogEntry[];
  dailyMetrics: Record<string, DailyHealthMetrics>;
  todayDate: string;
  todayFoods: FoodEntry[];
  todayWorkouts: WorkoutLogEntry[];
  todayMetrics: DailyHealthMetrics;
  updateProfile: (partial: Partial<UserProfile>) => void;
  addFoodEntries: (items: ParsedFoodItem[], category: MealCategory, source: FoodEntry['source']) => void;
  removeFoodEntry: (id: string) => void;
  addWorkoutEntry: (entry: Omit<WorkoutLogEntry, 'id' | 'date' | 'timestamp'>) => void;
  removeWorkoutEntry: (id: string) => void;
  addWater: (mlDelta: number) => void;
  updateStepsManually: (steps: number) => void;
  triggerAmazfitSync: (preset?: 'daily_steps' | 'soccer_match' | 'morning_run' | 'swim_session') => Promise<string>;
}

const FitnessContext = createContext<FitnessContextValue | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const seed = buildInitialSeedData();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [foods, setFoods] = useState<FoodEntry[]>(seed.foods);
  const [workouts, setWorkouts] = useState<WorkoutLogEntry[]>(seed.workouts);
  const [dailyMetrics, setDailyMetrics] = useState<Record<string, DailyHealthMetrics>>(
    seed.dailyMetrics
  );
  const [hydrated, setHydrated] = useState(false);

  const todayDate = getLocalDateString();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profile) setProfile(parsed.profile);
          if (Array.isArray(parsed.foods)) setFoods(parsed.foods);
          if (Array.isArray(parsed.workouts)) setWorkouts(parsed.workouts);
          if (parsed.dailyMetrics) setDailyMetrics(parsed.dailyMetrics);
        }
      } catch {
        // Usar seed por defecto
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, foods, workouts, dailyMetrics })
    ).catch(() => {});
  }, [profile, foods, workouts, dailyMetrics, hydrated]);

  const todayFoods = foods.filter((f) => f.date === todayDate);
  const todayWorkouts = workouts.filter((w) => w.date === todayDate);
  const todayMetrics: DailyHealthMetrics = dailyMetrics[todayDate] || {
    date: todayDate,
    steps: 0,
    stepCalories: 0,
    waterMl: 0,
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const addFoodEntries = (
    items: ParsedFoodItem[],
    category: MealCategory,
    source: FoodEntry['source']
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntries: FoodEntry[] = items.map((item, idx) => ({
      id: `food-${Date.now()}-${idx}`,
      date: todayDate,
      timestamp: nowTime,
      name: item.name,
      portionDesc: item.portionDesc,
      calories: item.calories,
      proteinG: item.proteinG,
      carbsG: item.carbsG,
      fatG: item.fatG,
      mealCategory: category,
      source,
      barcode: item.barcode,
    }));
    setFoods((prev) => [...newEntries, ...prev]);
  };

  const removeFoodEntry = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const addWorkoutEntry = (entry: Omit<WorkoutLogEntry, 'id' | 'date' | 'timestamp'>) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newWorkout: WorkoutLogEntry = {
      ...entry,
      id: `workout-${Date.now()}`,
      date: todayDate,
      timestamp: nowTime,
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const removeWorkoutEntry = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const addWater = (mlDelta: number) => {
    setDailyMetrics((prev) => {
      const current = prev[todayDate] || {
        date: todayDate,
        steps: 0,
        stepCalories: 0,
        waterMl: 0,
      };
      return {
        ...prev,
        [todayDate]: {
          ...current,
          waterMl: Math.max(0, current.waterMl + mlDelta),
        },
      };
    });
  };

  const updateStepsManually = (steps: number) => {
    setDailyMetrics((prev) => {
      const current = prev[todayDate] || {
        date: todayDate,
        steps: 0,
        stepCalories: 0,
        waterMl: 0,
      };
      return {
        ...prev,
        [todayDate]: {
          ...current,
          steps: Math.max(0, steps),
          stepCalories: calculateStepCalories(Math.max(0, steps), profile.weightKg),
        },
      };
    });
  };

  const triggerAmazfitSync = async (
    preset: 'daily_steps' | 'soccer_match' | 'morning_run' | 'swim_session' = 'daily_steps'
  ): Promise<string> => {
    const payload = await syncWithAmazfitHealthConnect({
      weightKg: profile.weightKg,
      currentSteps: todayMetrics.steps,
      simulatedPreset: preset,
    });

    setDailyMetrics((prev) => {
      const current = prev[todayDate] || {
        date: todayDate,
        steps: 0,
        stepCalories: 0,
        waterMl: 0,
      };
      return {
        ...prev,
        [todayDate]: {
          ...current,
          steps: payload.stepsToday,
          stepCalories: payload.stepCalories,
          restingHeartRate: payload.restingHeartRate,
          avgHeartRate: payload.avgHeartRate,
          sleepHours: payload.sleepHours,
        },
      };
    });

    if (payload.importedWorkouts.length > 0) {
      setWorkouts((prev) => {
        const existingExternalIds = new Set(prev.map((w) => w.externalId).filter(Boolean));
        const deduplicated = payload.importedWorkouts.filter(
          (w) => !w.externalId || !existingExternalIds.has(w.externalId)
        );
        return [...deduplicated, ...prev];
      });
    }

    setProfile((prev) => ({
      ...prev,
      amazfitConnected: true,
      lastHealthConnectSync: `Hoy, ${payload.syncedAt}`,
    }));

    return payload.importedWorkouts.length > 0
      ? `Sincronizado con Amazfit Active 2: ${payload.stepsToday.toLocaleString()} pasos y sesión "${payload.importedWorkouts[0].title}" importada.`
      : `Sincronizado con Amazfit Active 2 vía Health Connect: ${payload.stepsToday.toLocaleString()} pasos (${payload.stepCalories} kcal).`;
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        foods,
        workouts,
        dailyMetrics,
        todayDate,
        todayFoods,
        todayWorkouts,
        todayMetrics,
        updateProfile,
        addFoodEntries,
        removeFoodEntry,
        addWorkoutEntry,
        removeWorkoutEntry,
        addWater,
        updateStepsManually,
        triggerAmazfitSync,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export function useFitness() {
  const ctx = useContext(FitnessContext);
  if (!ctx) {
    throw new Error('useFitness debe usarse dentro de un FitnessProvider');
  }
  return ctx;
}
