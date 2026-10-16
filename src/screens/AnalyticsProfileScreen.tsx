import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../context/FitnessContext';
import {
  buildPeriodAnalytics,
  calculateBMR,
} from '../utils/energyCalculator';
import { GoalType } from '../types';

export const AnalyticsProfileScreen: React.FC = () => {
  const { profile, foods, workouts, dailyMetrics, updateProfile } = useFitness();

  const [period, setPeriod] = useState<7 | 30>(7);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Campos editables del perfil
  const [weightInput, setWeightInput] = useState(String(profile.weightKg));
  const [heightInput, setHeightInput] = useState(String(profile.heightCm));
  const [ageInput, setAgeInput] = useState(String(profile.age));
  const [stepGoalInput, setStepGoalInput] = useState(String(profile.stepGoal));
  const [apiKeyInput, setApiKeyInput] = useState(profile.geminiApiKey || '');

  const analytics = buildPeriodAnalytics(period, profile, foods, workouts, dailyMetrics);
  const bmr = calculateBMR(profile);

  // Distribución de entrenamientos por tipo de deporte en el período
  const sportBreakdown = workouts.reduce(
    (acc, w) => {
      acc[w.sportType] = (acc[w.sportType] || 0) + w.durationMinutes;
      return acc;
    },
    {} as Record<string, number>
  );

  const maxBarValue = Math.max(
    2800,
    ...analytics.days.map((d) => Math.max(d.consumed, d.burned))
  );

  const handleSaveProfile = () => {
    updateProfile({
      weightKg: parseFloat(weightInput) || profile.weightKg,
      heightCm: parseFloat(heightInput) || profile.heightCm,
      age: parseInt(ageInput, 10) || profile.age,
      stepGoal: parseInt(stepGoalInput, 10) || profile.stepGoal,
      geminiApiKey: apiKeyInput.trim(),
    });
    setShowProfileEdit(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Recuento Semanal y Mensual</Text>
      <Text style={styles.pageSubtitle}>
        Balance energético acumulado, proyección corporal y configuración de tu Pixel 9 Pro
      </Text>

      {/* Selector 7 Días (Semanal) vs 30 Días (Mensual) */}
      <View style={styles.periodToggle}>
        <TouchableOpacity
          style={[styles.periodBtn, period === 7 && styles.periodBtnActive]}
          onPress={() => setPeriod(7)}
        >
          <Text style={[styles.periodBtnText, period === 7 && styles.periodBtnTextActive]}>
            Recuento Semanal (7 Días)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.periodBtn, period === 30 && styles.periodBtnActive]}
          onPress={() => setPeriod(30)}
        >
          <Text style={[styles.periodBtnText, period === 30 && styles.periodBtnTextActive]}>
            Recuento Mensual (30 Días)
          </Text>
        </TouchableOpacity>
      </View>

      {/* KPIs del Período */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>PROMEDIO CONSUMIDO</Text>
          <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
            {analytics.avgConsumed} kcal
          </Text>
          <Text style={styles.kpiSub}>por día activo</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>PROMEDIO GASTO (TDEE)</Text>
          <Text style={[styles.kpiValue, { color: '#FB923C' }]}>
            {analytics.avgBurned} kcal
          </Text>
          <Text style={styles.kpiSub}>TMB + Amazfit + Deporte</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>BALANCE NETO ACUMULADO</Text>
          <Text
            style={[
              styles.kpiValue,
              { color: analytics.totalNetBalance <= 0 ? '#10B981' : '#F59E0B' },
            ]}
          >
            {analytics.totalNetBalance > 0
              ? `+${analytics.totalNetBalance}`
              : analytics.totalNetBalance}{' '}
            kcal
          </Text>
          <Text style={styles.kpiSub}>en {analytics.loggedDaysCount} días registrados</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>PROYECCIÓN DE PESO</Text>
          <Text
            style={[
              styles.kpiValue,
              { color: analytics.estimatedWeightDeltaKg <= 0 ? '#10B981' : '#F59E0B' },
            ]}
          >
            {analytics.estimatedWeightDeltaKg > 0
              ? `+${analytics.estimatedWeightDeltaKg}`
              : analytics.estimatedWeightDeltaKg}{' '}
            kg
          </Text>
          <Text style={styles.kpiSub}>según balance (7700 kcal/kg)</Text>
        </View>
      </View>

      {/* Gráfico de Barras Comparativo: Consumidas vs Quemadas */}
      <View style={styles.card}>
        <View style={styles.chartHeader}>
          <Text style={styles.cardTitle}>
            Evolución Diaria ({period === 7 ? 'Últimos 7 días' : 'Últimos 7 días del mes'})
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
              <Text style={styles.legendText}>Ingesta</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FB923C' }]} />
              <Text style={styles.legendText}>Gasto</Text>
            </View>
          </View>
        </View>

        <View style={styles.barsContainer}>
          {analytics.days.slice(-7).map((d) => {
            const inHeight = Math.max(8, Math.round((d.consumed / maxBarValue) * 120));
            const outHeight = Math.max(8, Math.round((d.burned / maxBarValue) * 120));
            return (
              <View key={d.date} style={styles.barGroup}>
                <View style={styles.barPair}>
                  <View
                    style={[
                      styles.barFill,
                      { height: inHeight, backgroundColor: '#38BDF8' },
                    ]}
                  />
                  <View
                    style={[
                      styles.barFill,
                      { height: outHeight, backgroundColor: '#FB923C' },
                    ]}
                  />
                </View>
                <Text style={styles.barDayLabel}>{d.shortLabel}</Text>
                <Text
                  style={[
                    styles.barNetLabel,
                    { color: d.netBalance <= 0 ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  {d.netBalance > 0 ? `+${d.netBalance}` : d.netBalance}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Desglose de Deportes y Volumen */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribución Deportiva y Pasos</Text>
        <Text style={styles.cardSub}>
          Total en el período: {analytics.totalSteps.toLocaleString()} pasos •{' '}
          {analytics.totalWorkoutMinutes} min de entrenamiento
        </Text>

        <View style={styles.sportStatsList}>
          {[
            { key: 'soccer', label: '⚽ Fútbol', color: '#10B981' },
            { key: 'weights', label: '🏋️ Fuerza / Calistenia', color: '#38BDF8' },
            { key: 'running', label: '🏃 Running', color: '#F59E0B' },
            { key: 'swimming', label: '🏊 Natación', color: '#818CF8' },
            { key: 'walking', label: '🚶 Caminata Activa', color: '#A855F7' },
          ].map((item) => {
            const mins = sportBreakdown[item.key] || 0;
            return (
              <View key={item.key} style={styles.sportStatRow}>
                <Text style={styles.sportStatName}>{item.label}</Text>
                <Text style={[styles.sportStatVal, { color: item.color }]}>
                  {mins} min
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Tarjeta de Perfil Energético + Amazfit Active 2 + API Key */}
      <View style={styles.card}>
        <View style={styles.profileHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Tu Perfil Fisiológico y Dispositivos</Text>
            <Text style={styles.cardSub}>
              {profile.weightKg} kg • {profile.heightCm} cm • {profile.age} años • TMB Base: {bmr} kcal
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setShowProfileEdit((v) => !v)}
          >
            <Ionicons name="settings-outline" size={16} color="#38BDF8" />
            <Text style={styles.editBtnText}>
              {showProfileEdit ? 'Cerrar' : 'Ajustar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector rápido de Objetivo */}
        <Text style={styles.fieldLabel}>Objetivo Nutricional Actual</Text>
        <View style={styles.goalRow}>
          {[
            { key: 'deficit' as GoalType, label: 'Déficit (-400 kcal)', desc: 'Definición' },
            { key: 'maintenance' as GoalType, label: 'Mantenimiento', desc: 'Recomp' },
            { key: 'surplus' as GoalType, label: 'Superávit (+300)', desc: 'Masa Muscular' },
          ].map((g) => {
            const active = profile.goal === g.key;
            return (
              <TouchableOpacity
                key={g.key}
                style={[styles.goalChip, active && styles.goalChipActive]}
                onPress={() =>
                  updateProfile({
                    goal: g.key,
                    targetDeficitOrSurplus:
                      g.key === 'deficit' ? -400 : g.key === 'surplus' ? 300 : 0,
                  })
                }
              >
                <Text style={[styles.goalChipTitle, active && { color: '#020617' }]}>
                  {g.label}
                </Text>
                <Text style={[styles.goalChipSub, active && { color: '#064E3B' }]}>
                  {g.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showProfileEdit && (
          <View style={styles.editForm}>
            <View style={styles.inputGrid}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={heightInput}
                  onChangeText={setHeightInput}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Edad</Text>
                <TextInput
                  style={styles.input}
                  value={ageInput}
                  onChangeText={setAgeInput}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Meta de Pasos Diarios (Amazfit Active 2)</Text>
            <TextInput
              style={styles.input}
              value={stepGoalInput}
              onChangeText={setStepGoalInput}
              keyboardType="numeric"
            />

            <Text style={styles.fieldLabel}>
              Gemini API Key (Opcional para Visión IA en fotos de platos)
            </Text>
            <TextInput
              style={styles.input}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="AIzaSy... (Si queda vacío usa el motor NLP local offline)"
              placeholderTextColor="#64748B"
              secureTextEntry
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>Guardar Parámetros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Guía rápida de vinculación con Amazfit Active 2 en Pixel 9 Pro */}
        <View style={styles.amazfitGuideBox}>
          <View style={styles.amazfitGuideHeader}>
            <Ionicons name="watch" size={18} color="#10B981" />
            <Text style={styles.amazfitGuideTitle}>
              Conexión Amazfit Active 2 en tu Pixel 9 Pro
            </Text>
          </View>
          <Text style={styles.amazfitGuideStep}>
            1. En la app **Zepp**, ve a *Perfil → Configuración de terceros → Health Connect* y actívalo.
          </Text>
          <Text style={styles.amazfitGuideStep}>
            2. En tu **Pixel 9 Pro**, Android Health Connect unifica automáticamente tus pasos, frecuencia cardíaca y partidos de fútbol/running/natación con ArgonFit.
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  pageTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodBtnActive: {
    backgroundColor: '#10B981',
  },
  periodBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  periodBtnTextActive: {
    color: '#020617',
    fontWeight: '800',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  kpiLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  kpiSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  cardSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 165,
    paddingTop: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 120,
  },
  barFill: {
    width: 10,
    borderRadius: 4,
  },
  barDayLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  barNetLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  sportStatsList: {
    marginTop: 12,
    gap: 8,
  },
  sportStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  sportStatName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  sportStatVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  editBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  goalChip: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  goalChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  goalChipTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  goalChipSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  editForm: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: '#020617',
    color: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 13,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: '#38BDF8',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '800',
  },
  amazfitGuideBox: {
    marginTop: 16,
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B98144',
  },
  amazfitGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  amazfitGuideTitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  amazfitGuideStep: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
});
