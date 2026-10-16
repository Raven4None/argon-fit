import React, { useState } from 'react';
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FitnessProvider } from './src/context/FitnessContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NutritionScreen } from './src/screens/NutritionScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { AnalyticsProfileScreen } from './src/screens/AnalyticsProfileScreen';

type TabKey = 'dashboard' | 'nutrition' | 'workouts' | 'analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const tabs: { key: TabKey; label: string; icon: any; activeIcon: any }[] = [
    {
      key: 'dashboard',
      label: 'Balance Hoy',
      icon: 'speedometer-outline',
      activeIcon: 'speedometer',
    },
    {
      key: 'nutrition',
      label: 'Nutrición IA',
      icon: 'restaurant-outline',
      activeIcon: 'restaurant',
    },
    {
      key: 'workouts',
      label: 'Entrenar',
      icon: 'barbell-outline',
      activeIcon: 'barbell',
    },
    {
      key: 'analytics',
      label: 'Semanal/Mes',
      icon: 'stats-chart-outline',
      activeIcon: 'stats-chart',
    },
  ];

  return (
    <SafeAreaProvider>
      <FitnessProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <StatusBar style="light" />

          <View style={styles.mainContent}>
            {activeTab === 'dashboard' && (
              <DashboardScreen onNavigate={(t) => setActiveTab(t)} />
            )}
            {activeTab === 'nutrition' && <NutritionScreen />}
            {activeTab === 'workouts' && <WorkoutsScreen />}
            {activeTab === 'analytics' && <AnalyticsProfileScreen />}
          </View>

          {/* Barra de Navegación Inferior Optimizada para Pixel 9 Pro */}
          <View style={styles.bottomBar}>
            {tabs.map((tab) => {
              const isFocused = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconPill,
                      isFocused && styles.iconPillActive,
                    ]}
                  >
                    <Ionicons
                      name={isFocused ? tab.activeIcon : tab.icon}
                      size={20}
                      color={isFocused ? '#10B981' : '#64748B'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </FitnessProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  mainContent: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  iconPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#10B981',
    fontWeight: '800',
  },
});
