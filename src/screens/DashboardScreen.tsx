import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../context/FitnessContext';
import {
  calculateDynamicTDEE,
  calculateMacroTargets,
} from '../utils/energyCalculator';

interface Props {
  onNavigate: (tab: 'dashboard' | 'nutrition' | 'workouts' | 'analytics') => void;
}

export const DashboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const {
    profile,
    todayFoods,
    todayWorkouts,
    todayMetrics,
    addWater,
    triggerAmazfitSync,
  } = useFitness();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showWatchMenu, setShowWatchMenu] = useState(false);

  const consumedCalories = todayFoods.reduce((sum, f) => sum + f.calories, 0);
  const consumedProtein = todayFoods.reduce((sum, f) => sum + f.proteinG, 0);
  const consumedCarbs = todayFoods.reduce((sum, f) => sum + f.carbsG, 0);
  const consumedFat = todayFoods.reduce((sum, f) => sum + f.fatG, 0);

  const tdee = calculateDynamicTDEE(profile, todayMetrics.steps, todayWorkouts);
  const macroTargets = calculateMacroTargets(profile, tdee.dailyTargetCalories);

  const remainingCalories = tdee.dailyTargetCalories - consumedCalories;
  const netEnergyBalance = consumedCalories - tdee.totalBurned;

  // Configuración del anillo SVG
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1.15, Math.max(0, consumedCalories / tdee.dailyTargetCalories));
  const strokeDashoffset = circumference - Math.min(1, progress) * circumference;

  const handleAmazfitSync = async (
    preset: 'daily_steps' | 'soccer_match' | 'morning_run' | 'swim_session'
  ) => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const msg = await triggerAmazfitSync(preset);
      setSyncMessage(msg);
      setShowWatchMenu(false);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header + Amazfit Active 2 Status */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hola, {profile.name} 👋</Text>
          <Text style={styles.subtitle}>
            Pixel 9 Pro • Meta: {profile.goal === 'deficit' ? 'Déficit Calórico' : profile.goal === 'surplus' ? 'Volumen Muscular' : 'Mantenimiento'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.watchBadge}
          onPress={() => setShowWatchMenu((v) => !v)}
          activeOpacity={0.8}
        >
          <View style={styles.watchDot} />
          <Ionicons name="watch-outline" size={16} color="#10B981" />
          <Text style={styles.watchBadgeText}>Amazfit Active 2</Text>
          <Ionicons
            name={showWatchMenu ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>

      {/* Panel Desplegable de Sincronización con Amazfit Active 2 / Health Connect */}
      {showWatchMenu && (
        <View style={styles.watchPanel}>
          <View style={styles.watchPanelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.watchPanelTitle}>
                Sincronización Zepp ↔ Android Health Connect
              </Text>
              <Text style={styles.watchPanelSub}>
                Último sync: {profile.lastHealthConnectSync || 'Hoy'} • FC Reposo: {todayMetrics.restingHeartRate || 56} bpm
              </Text>
            </View>
            {syncing && <ActivityIndicator color="#10B981" size="small" />}
          </View>

          <View style={styles.syncButtonsGrid}>
            <TouchableOpacity
              style={styles.syncActionBtn}
              onPress={() => handleAmazfitSync('daily_steps')}
              disabled={syncing}
            >
              <Ionicons name="footsteps-outline" size={16} color="#38BDF8" />
              <Text style={styles.syncActionText}>Sync Pasos y FC</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.syncActionBtn}
              onPress={() => handleAmazfitSync('soccer_match')}
              disabled={syncing}
            >
              <Ionicons name="football-outline" size={16} color="#10B981" />
              <Text style={styles.syncActionText}>Importar Fútbol</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.syncActionBtn}
              onPress={() => handleAmazfitSync('morning_run')}
              disabled={syncing}
            >
              <Ionicons name="walk-outline" size={16} color="#F59E0B" />
              <Text style={styles.syncActionText}>Importar Running</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.syncActionBtn}
              onPress={() => handleAmazfitSync('swim_session')}
              disabled={syncing}
            >
              <Ionicons name="water-outline" size={16} color="#818CF8" />
              <Text style={styles.syncActionText}>Importar Natación</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {syncMessage && (
        <View style={styles.syncBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.syncBannerText}>{syncMessage}</Text>
        </View>
      )}

      {/* Main Energy Card (Consumed vs TDEE vs Net) */}
      <View style={styles.heroCard}>
        <View style={styles.ringRow}>
          {/* Left Metrics */}
          <View style={styles.sideMetrics}>
            <View style={styles.metricBlock}>
              <View style={styles.metricHeader}>
                <Ionicons name="restaurant-outline" size={14} color="#38BDF8" />
                <Text style={styles.metricLabel}>CONSUMIDAS</Text>
              </View>
              <Text style={styles.metricValue}>{consumedCalories}</Text>
              <Text style={styles.metricUnit}>kcal hoy</Text>
            </View>

            <View style={styles.metricBlock}>
              <View style={styles.metricHeader}>
                <Ionicons name="flame-outline" size={14} color="#F97316" />
                <Text style={styles.metricLabel}>GASTO TOTAL</Text>
              </View>
              <Text style={[styles.metricValue, { color: '#FB923C' }]}>
                {tdee.totalBurned}
              </Text>
              <Text style={styles.metricUnit}>
                TMB {tdee.bmr} + Act {tdee.neatStepsCalories + tdee.workoutCalories}
              </Text>
            </View>
          </View>

          {/* Center SVG Ring */}
          <View style={styles.ringContainer}>
            <Svg width={size} height={size}>
              <Circle
                stroke="#1E293B"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke={remainingCalories >= 0 ? '#10B981' : '#EF4444'}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.ringCenterText}>
              <Text style={styles.ringRemainingNumber}>
                {Math.abs(remainingCalories)}
              </Text>
              <Text style={styles.ringRemainingLabel}>
                {remainingCalories >= 0 ? 'kcal disponibles' : 'kcal sobre meta'}
              </Text>
              <View
                style={[
                  styles.netPill,
                  {
                    backgroundColor:
                      netEnergyBalance <= 0
                        ? 'rgba(16, 185, 129, 0.16)'
                        : 'rgba(245, 158, 11, 0.16)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.netPillText,
                    { color: netEnergyBalance <= 0 ? '#34D399' : '#FBBF24' },
                  ]}
                >
                  Neto: {netEnergyBalance > 0 ? `+${netEnergyBalance}` : netEnergyBalance} kcal
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Breakdown of Energy Expenditure */}
        <View style={styles.expenditureStrip}>
          <View style={styles.expItem}>
            <Text style={styles.expTitle}>Metabolismo Basal</Text>
            <Text style={styles.expVal}>{tdee.bmr} kcal</Text>
          </View>
          <View style={styles.expDivider} />
          <View style={styles.expItem}>
            <Text style={styles.expTitle}>NEAT + Pasos</Text>
            <Text style={styles.expVal}>{tdee.neatStepsCalories} kcal</Text>
          </View>
          <View style={styles.expDivider} />
          <View style={styles.expItem}>
            <Text style={styles.expTitle}>Deporte / Rutinas</Text>
            <Text style={[styles.expVal, { color: '#10B981' }]}>
              +{tdee.workoutCalories} kcal
            </Text>
          </View>
        </View>

        {/* Macros Bars */}
        <View style={styles.macrosRow}>
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroName}>Proteína</Text>
              <Text style={styles.macroVal}>
                {consumedProtein}/{macroTargets.proteinG}g
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (consumedProtein / macroTargets.proteinG) * 100)}%`,
                    backgroundColor: '#38BDF8',
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroName}>Carbos</Text>
              <Text style={styles.macroVal}>
                {consumedCarbs}/{macroTargets.carbsG}g
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (consumedCarbs / macroTargets.carbsG) * 100)}%`,
                    backgroundColor: '#10B981',
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroName}>Grasas</Text>
              <Text style={styles.macroVal}>
                {consumedFat}/{macroTargets.fatG}g
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (consumedFat / macroTargets.fatG) * 100)}%`,
                    backgroundColor: '#F59E0B',
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Quick Action Cards: Steps (Amazfit) + Hydration */}
      <View style={styles.twoColGrid}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => handleAmazfitSync('daily_steps')}
          activeOpacity={0.85}
        >
          <View style={styles.statCardHeader}>
            <Ionicons name="footsteps" size={20} color="#10B981" />
            <Text style={styles.statCardTag}>Amazfit Active 2</Text>
          </View>
          <Text style={styles.statBigValue}>
            {todayMetrics.steps.toLocaleString()}
          </Text>
          <Text style={styles.statSubtext}>
            Meta: {profile.stepGoal.toLocaleString()} pasos • {todayMetrics.stepCalories} kcal
          </Text>
          <View style={[styles.progressTrack, { marginTop: 8 }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, (todayMetrics.steps / profile.stepGoal) * 100)}%`,
                  backgroundColor: '#10B981',
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Ionicons name="water" size={20} color="#38BDF8" />
            <Text style={[styles.statCardTag, { color: '#38BDF8' }]}>Hidratación</Text>
          </View>
          <Text style={styles.statBigValue}>{todayMetrics.waterMl} ml</Text>
          <Text style={styles.statSubtext}>
            Meta: {profile.waterGoalMl} ml ({Math.round(todayMetrics.waterMl / 250)} vasos)
          </Text>
          <View style={styles.waterBtnRow}>
            <TouchableOpacity
              style={styles.waterBtnSecondary}
              onPress={() => addWater(-250)}
            >
              <Text style={styles.waterBtnText}>-250</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.waterBtnPrimary}
              onPress={() => addWater(250)}
            >
              <Text style={styles.waterBtnPrimaryText}>+250 ml</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Shortcut CTA Buttons */}
      <View style={styles.ctaRow}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: '#10B981' }]}
          onPress={() => onNavigate('nutrition')}
        >
          <Ionicons name="camera-outline" size={20} color="#020617" />
          <Text style={styles.ctaButtonDarkText}>Registrar Comida IA / Escáner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }]}
          onPress={() => onNavigate('workouts')}
        >
          <Ionicons name="barbell-outline" size={20} color="#38BDF8" />
          <Text style={styles.ctaButtonLightText}>Rutinas y Deportes</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Activity & Nutrition Summary */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actividad Deportiva de Hoy</Text>
          <TouchableOpacity onPress={() => onNavigate('workouts')}>
            <Text style={styles.sectionLink}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {todayWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>
            Aún no registraste entrenamientos hoy. Usa el recomendador por tiempo disponible o sincroniza tu Amazfit Active 2.
          </Text>
        ) : (
          todayWorkouts.map((w) => (
            <View key={w.id} style={styles.logItem}>
              <View style={styles.logIconBox}>
                <Ionicons
                  name={
                    w.sportType === 'soccer'
                      ? 'football'
                      : w.sportType === 'running'
                      ? 'walk'
                      : w.sportType === 'swimming'
                      ? 'water'
                      : 'barbell'
                  }
                  size={18}
                  color="#10B981"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.logItemTitle}>{w.title}</Text>
                <Text style={styles.logItemSub}>
                  {w.durationMinutes} min • {w.avgHeartRate ? `${w.avgHeartRate} bpm prom • ` : ''}
                  {w.source === 'amazfit_health_connect' ? '⌚ Amazfit Active 2' : '📱 App'}
                </Text>
              </View>
              <Text style={styles.logItemKcal}>-{w.caloriesBurned} kcal</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Comidas Registradas Hoy</Text>
          <TouchableOpacity onPress={() => onNavigate('nutrition')}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {todayFoods.slice(0, 4).map((f) => (
          <View key={f.id} style={styles.logItem}>
            <View style={[styles.logIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
              <Ionicons name="nutrition" size={18} color="#38BDF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.logItemTitle} numberOfLines={1}>
                {f.name}
              </Text>
              <Text style={styles.logItemSub}>
                {f.portionDesc} • P: {f.proteinG}g | C: {f.carbsG}g | G: {f.fatG}g
              </Text>
            </View>
            <Text style={[styles.logItemKcal, { color: '#38BDF8' }]}>+{f.calories} kcal</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greeting: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  watchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  watchDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  watchBadgeText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  watchPanel: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10B98144',
    marginBottom: 14,
  },
  watchPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  watchPanelTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  watchPanelSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  syncButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  syncActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  syncActionText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: '#10B981',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  syncBannerText: {
    color: '#D1FAE5',
    fontSize: 12,
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideMetrics: {
    flex: 1,
    gap: 16,
    paddingRight: 8,
  },
  metricBlock: {
    backgroundColor: '#1E293B80',
    padding: 11,
    borderRadius: 14,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  metricUnit: {
    color: '#64748B',
    fontSize: 11,
  },
  ringContainer: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringRemainingNumber: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '900',
  },
  ringRemainingLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  netPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  netPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  expenditureStrip: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expItem: {
    alignItems: 'center',
    flex: 1,
  },
  expTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  expVal: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  expDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E293B',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  macroCol: {
    flex: 1,
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  macroName: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  macroVal: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  twoColGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statCardTag: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  statBigValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  statSubtext: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  waterBtnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  waterBtnSecondary: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  waterBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  waterBtnPrimary: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    alignItems: 'center',
  },
  waterBtnPrimaryText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 8,
  },
  ctaButtonDarkText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '800',
  },
  ctaButtonLightText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 10,
  },
  logIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logItemTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  logItemSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  logItemKcal: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
  },
});
