import {
  ClassicSportType,
  DailyHealthMetrics,
  FoodEntry,
  UserProfile,
  WorkoutLogEntry,
} from '../types';

/**
 * Calcula la Tasa Metabólica Basal (TMB / BMR) usando la ecuación de Mifflin-St Jeor
 */
export function calculateBMR(profile: UserProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  const bmr = profile.sex === 'male' ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * Calcula calorías quemadas por pasos (NEAT) evitando doble conteo con BMR
 */
export function calculateStepCalories(steps: number, weightKg: number): number {
  // ~0.04 kcal por paso para una persona de 75kg, escalado linealmente por peso
  const factor = (weightKg / 75) * 0.042;
  return Math.round(steps * factor);
}

/**
 * Calcula el Gasto Energético Total Diario (TDEE) dinámico en tiempo real:
 * TMB + Gasto por Pasos (NEAT) + Entrenamientos del día
 */
export function calculateDynamicTDEE(
  profile: UserProfile,
  steps: number,
  workouts: WorkoutLogEntry[]
): {
  bmr: number;
  neatStepsCalories: number;
  workoutCalories: number;
  totalBurned: number;
  dailyTargetCalories: number;
} {
  const bmr = calculateBMR(profile);
  // Base sedentaria mínima de digestión/postura (15% del BMR)
  const baseThermicAndPostural = Math.round(bmr * 0.15);
  const neatStepsCalories = calculateStepCalories(steps, profile.weightKg);
  const workoutCalories = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

  const totalBurned = bmr + baseThermicAndPostural + neatStepsCalories + workoutCalories;

  let adjustment = profile.targetDeficitOrSurplus;
  if (profile.goal === 'deficit' && adjustment > 0) adjustment = -adjustment;
  if (profile.goal === 'maintenance') adjustment = 0;
  if (profile.goal === 'surplus' && adjustment < 0) adjustment = Math.abs(adjustment);

  const dailyTargetCalories = Math.max(1200, totalBurned + adjustment);

  return {
    bmr,
    neatStepsCalories: neatStepsCalories + baseThermicAndPostural,
    workoutCalories,
    totalBurned,
    dailyTargetCalories,
  };
}

/**
 * Calcula los objetivos diarios de macronutrientes según peso y meta calórica
 */
export function calculateMacroTargets(profile: UserProfile, targetCalories: number) {
  // Proteína alta para preservar/ganar masa muscular (2.0g por kg en déficit, 1.8g en mantenimiento/volumen)
  const proteinPerKg = profile.goal === 'deficit' ? 2.1 : 1.9;
  const proteinG = Math.round(profile.weightKg * proteinPerKg);
  const proteinCalories = proteinG * 4;

  // Grasas saludables: ~0.9g por kg
  const fatG = Math.round(profile.weightKg * 0.9);
  const fatCalories = fatG * 9;

  // El resto en carbohidratos para energía en entrenamientos/fútbol/running
  const remainingCalories = Math.max(200, targetCalories - proteinCalories - fatCalories);
  const carbsG = Math.round(remainingCalories / 4);

  return {
    proteinG,
    carbsG,
    fatG,
  };
}

/**
 * Calcula las calorías quemadas en deportes clásicos usando tablas METs oficiales (Compendium of Physical Activities)
 * ajustadas por peso, intensidad y frecuencia cardíaca opcional del Amazfit Active 2
 */
export function estimateSportCalories(params: {
  sportType: ClassicSportType;
  durationMinutes: number;
  weightKg: number;
  intensity: 'low' | 'moderate' | 'high';
  avgHeartRate?: number;
  age?: number;
}): number {
  const { sportType, durationMinutes, weightKg, intensity, avgHeartRate, age = 30 } = params;

  const metTable: Record<ClassicSportType, Record<'low' | 'moderate' | 'high', number>> = {
    running: { low: 8.0, moderate: 10.5, high: 13.5 }, // 8 km/h a 14+ km/h
    swimming: { low: 6.0, moderate: 8.3, high: 10.8 }, // Pecho recreativo a Crol intenso
    walking: { low: 3.0, moderate: 4.3, high: 5.5 }, // Paseo a caminata rápida / pendiente
    soccer: { low: 7.0, moderate: 9.0, high: 11.0 }, // Picado tranquilo a partido competitivo
    weights: { low: 3.8, moderate: 5.5, high: 7.2 }, // Musculación / Calistenia / Circuito
  };

  let met = metTable[sportType][intensity];

  // Si tenemos frecuencia cardíaca del Amazfit Active 2, refinamos el multiplicador
  if (avgHeartRate && avgHeartRate > 90) {
    const maxHr = 208 - 0.7 * age;
    const hrRatio = Math.min(1.0, Math.max(0.45, avgHeartRate / maxHr));
    const hrMultiplier = 0.75 + hrRatio * 0.45;
    met = met * hrMultiplier;
  }

  // Fórmula estándar ACSM: kcal = MET * 3.5 * pesoKg / 200 * minutos
  const kcal = ((met * 3.5 * weightKg) / 200) * durationMinutes;
  return Math.round(kcal);
}

/**
 * Formatea una fecha a YYYY-MM-DD local
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Genera el resumen semanal (últimos 7 días) y mensual (últimos 30 días)
 */
export function buildPeriodAnalytics(
  daysCount: 7 | 30,
  profile: UserProfile,
  foods: FoodEntry[],
  workouts: WorkoutLogEntry[],
  dailyMetrics: Record<string, DailyHealthMetrics>
) {
  const days: {
    date: string;
    shortLabel: string;
    consumed: number;
    burned: number;
    netBalance: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    steps: number;
    workoutMinutes: number;
  }[] = [];

  const today = new Date();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);
    const shortLabel =
      daysCount === 7 ? dayNames[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`;

    const dayFoods = foods.filter((f) => f.date === dateStr);
    const dayWorkouts = workouts.filter((w) => w.date === dateStr);
    const metrics = dailyMetrics[dateStr] || {
      date: dateStr,
      steps: 0,
      stepCalories: 0,
      waterMl: 0,
    };

    const consumed = dayFoods.reduce((sum, f) => sum + f.calories, 0);
    const proteinG = dayFoods.reduce((sum, f) => sum + f.proteinG, 0);
    const carbsG = dayFoods.reduce((sum, f) => sum + f.carbsG, 0);
    const fatG = dayFoods.reduce((sum, f) => sum + f.fatG, 0);

    const tdee = calculateDynamicTDEE(profile, metrics.steps, dayWorkouts);
    const burned = tdee.totalBurned;
    const netBalance = consumed - burned;
    const workoutMinutes = dayWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0);

    days.push({
      date: dateStr,
      shortLabel,
      consumed,
      burned,
      netBalance,
      proteinG,
      carbsG,
      fatG,
      steps: metrics.steps,
      workoutMinutes,
    });
  }

  // Filtramos días que tuvieron algún registro o pasos para promedios reales
  const loggedDays = days.filter((d) => d.consumed > 0 || d.steps > 0 || d.workoutMinutes > 0);
  const divisor = Math.max(1, loggedDays.length);

  const totalConsumed = loggedDays.reduce((s, d) => s + d.consumed, 0);
  const totalBurned = loggedDays.reduce((s, d) => s + d.burned, 0);
  const totalNet = totalConsumed - totalBurned;

  // 7700 kcal equivalen aproximadamente a 1 kg de tejido adiposo/corporal
  const estimatedWeightDeltaKg = Number((totalNet / 7700).toFixed(2));

  return {
    days,
    loggedDaysCount: loggedDays.length,
    avgConsumed: Math.round(totalConsumed / divisor),
    avgBurned: Math.round(totalBurned / divisor),
    totalNetBalance: totalNet,
    estimatedWeightDeltaKg,
    totalSteps: days.reduce((s, d) => s + d.steps, 0),
    totalWorkoutMinutes: days.reduce((s, d) => s + d.workoutMinutes, 0),
  };
}
