export type GoalType = 'deficit' | 'maintenance' | 'surplus';
export type SexType = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

export type EquipmentMode = 'gym' | 'home' | 'calisthenics';
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders_arms'
  | 'core'
  | 'push'
  | 'pull'
  | 'full_body';

export type AvailableTime = 15 | 30 | 45 | 60;

export type ClassicSportType = 'running' | 'swimming' | 'walking' | 'soccer' | 'weights';

export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  sex: SexType;
  activityLevel: ActivityLevel;
  goal: GoalType;
  targetDeficitOrSurplus: number; // e.g., -400 kcal for deficit, +300 for surplus
  stepGoal: number;
  waterGoalMl: number;
  geminiApiKey?: string;
  amazfitConnected: boolean;
  lastHealthConnectSync?: string;
}

export interface FoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  name: string;
  portionDesc: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealCategory: MealCategory;
  source: 'ai_text' | 'ai_photo' | 'barcode' | 'quick' | 'manual';
  barcode?: string;
}

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders_arms' | 'core';
  secondaryMuscles: string[];
  equipment: EquipmentMode[];
  equipmentLabel: string;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  caloriesPerSet: number;
  instructions: string;
  proTip: string;
  demoImages: [string, string]; // [Posición inicial, Posición final/contracción] (Fotografías reales de free-exercise-db)
  stepByStep: string[];
  commonMistakes: string[];
  youtubeVideoId: string;
  youtubeChannel: string;
  youtubeTitle: string;
}

export interface FitnessChannelInfo {
  id: string;
  name: string;
  specialty: string;
  language: 'ES' | 'EN';
  equipmentFocus: EquipmentMode[];
  channelUrl: string;
}

export interface FeaturedVideoRoutine {
  id: string;
  title: string;
  channelName: string;
  videoId: string;
  durationMinutes: AvailableTime;
  equipment: EquipmentMode;
  muscleGroup: MuscleGroup;
  estimatedCalories: number;
  level: string;
}

export interface WorkoutLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  title: string;
  sportType: ClassicSportType;
  durationMinutes: number;
  caloriesBurned: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  distanceKm?: number;
  poolLaps?: number;
  poolLengthM?: 25 | 50;
  soccerFormat?: '5v5' | '7v7' | '8v8' | '11v11';
  intensity: 'low' | 'moderate' | 'high';
  muscleGroups?: string[];
  equipmentUsed?: EquipmentMode;
  setsCompleted?: number;
  source: 'manual' | 'routine' | 'amazfit_health_connect';
  externalId?: string; // For deduplication with Health Connect / Zepp
}

export interface DailyHealthMetrics {
  date: string; // YYYY-MM-DD
  steps: number;
  stepCalories: number;
  restingHeartRate?: number;
  avgHeartRate?: number;
  sleepHours?: number;
  waterMl: number;
  weightKg?: number;
}
