import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../context/FitnessContext';
import { MealCategory } from '../types';
import {
  analyzeFoodByPhoto,
  analyzeFoodByText,
  LOCAL_FOOD_DATABASE,
  lookupBarcodeOpenFoodFacts,
  ParsedFoodItem,
  searchOpenFoodFacts,
} from '../services/nutritionService';

export const NutritionScreen: React.FC = () => {
  const { profile, todayFoods, addFoodEntries, removeFoodEntry } = useFitness();

  const [mode, setMode] = useState<'ai' | 'scanner' | 'search'>('ai');
  const [mealCategory, setMealCategory] = useState<MealCategory>('lunch');

  // Estado para modo IA (Texto libre o Foto)
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState<ParsedFoodItem[]>([]);

  // Estado para Escáner OpenFoodFacts
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannerStatus, setScannerStatus] = useState<string | null>(null);

  // Estado para Buscador OpenFoodFacts + Favoritos
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ParsedFoodItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleAnalyzeText = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const items = await analyzeFoodByText(aiInput, profile.geminiApiKey);
      setPreviewItems(items);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePickPhoto = async () => {
    setAiLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.6,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const items = await analyzeFoodByPhoto(
          asset.base64 || undefined,
          aiInput,
          profile.geminiApiKey
        );
        setPreviewItems(items);
      }
    } catch {
      const fallback = await analyzeFoodByPhoto(undefined, aiInput, profile.geminiApiKey);
      setPreviewItems(fallback);
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmPreview = () => {
    if (previewItems.length === 0) return;
    addFoodEntries(previewItems, mealCategory, 'ai_text');
    setPreviewItems([]);
    setAiInput('');
  };

  const handleBarcodeLookup = async (code: string) => {
    setCameraActive(false);
    setAiLoading(true);
    setScannerStatus(`Buscando código ${code} en OpenFoodFacts...`);
    try {
      const item = await lookupBarcodeOpenFoodFacts(code);
      if (item) {
        setPreviewItems([item]);
        setScannerStatus(`Producto encontrado: ${item.name}`);
      } else {
        setScannerStatus(
          `No se encontró el código ${code} en OpenFoodFacts. Puedes buscarlo por nombre.`
        );
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSearchFood = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const items = await searchOpenFoodFacts(searchQuery);
      setSearchResults(items);
    } finally {
      setSearchLoading(false);
    }
  };

  const mealLabels: { key: MealCategory; label: string; icon: any }[] = [
    { key: 'breakfast', label: 'Desayuno', icon: 'cafe-outline' },
    { key: 'lunch', label: 'Almuerzo', icon: 'sunny-outline' },
    { key: 'snack', label: 'Merienda', icon: 'nutrition-outline' },
    { key: 'dinner', label: 'Cena', icon: 'moon-outline' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Nutrición e IA</Text>
      <Text style={styles.pageSubtitle}>
        Registra por texto libre/foto con IA o escanea códigos de barras con OpenFoodFacts
      </Text>

      {/* Selector de Momento del Día */}
      <View style={styles.mealCategoryRow}>
        {mealLabels.map((m) => {
          const active = mealCategory === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.mealChip, active && styles.mealChipActive]}
              onPress={() => setMealCategory(m.key)}
            >
              <Ionicons
                name={m.icon}
                size={14}
                color={active ? '#020617' : '#94A3B8'}
              />
              <Text style={[styles.mealChipText, active && styles.mealChipTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selector de Modo: 1. IA Texto/Foto | 2. Escáner Código de Barras | 3. Buscador OpenFoodFacts */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'ai' && styles.modeTabActive]}
          onPress={() => setMode('ai')}
        >
          <Ionicons
            name="sparkles-outline"
            size={16}
            color={mode === 'ai' ? '#10B981' : '#94A3B8'}
          />
          <Text style={[styles.modeTabText, mode === 'ai' && styles.modeTabTextActive]}>
            IA Texto / Foto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'scanner' && styles.modeTabActive]}
          onPress={() => setMode('scanner')}
        >
          <Ionicons
            name="barcode-outline"
            size={16}
            color={mode === 'scanner' ? '#10B981' : '#94A3B8'}
          />
          <Text style={[styles.modeTabText, mode === 'scanner' && styles.modeTabTextActive]}>
            Escáner Barras
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'search' && styles.modeTabActive]}
          onPress={() => setMode('search')}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={mode === 'search' ? '#10B981' : '#94A3B8'}
          />
          <Text style={[styles.modeTabText, mode === 'search' && styles.modeTabTextActive]}>
            OpenFoodFacts
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODO 1: IA POR TEXTO O FOTO */}
      {mode === 'ai' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Describe tu comida o sube una foto</Text>
          <Text style={styles.cardHint}>
            Ejemplo: &quot;2 empanadas de carne y una manzana&quot; o &quot;200g de pollo con arroz y 2 huevos&quot;
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="Escribe lo que comiste..."
            placeholderTextColor="#64748B"
            multiline
            value={aiInput}
            onChangeText={setAiInput}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleAnalyzeText}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <ActivityIndicator color="#020617" size="small" />
              ) : (
                <>
                  <Ionicons name="flash" size={16} color="#020617" />
                  <Text style={styles.primaryBtnText}>Calcular Calorías y Macros</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handlePickPhoto}
              disabled={aiLoading}
            >
              <Ionicons name="camera" size={18} color="#38BDF8" />
              <Text style={styles.secondaryBtnText}>Foto IA</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODO 2: ESCÁNER DE CÓDIGO DE BARRAS (OPENFOODFACTS) */}
      {mode === 'scanner' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escáner de Código de Barras (OpenFoodFacts)</Text>
          <Text style={styles.cardHint}>
            Apunta la cámara de tu Pixel 9 Pro al código EAN/UPC del envase o ingrésalo abajo.
          </Text>

          {cameraActive ? (
            <View style={styles.cameraWrapper}>
              <CameraView
                style={styles.cameraView}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
                }}
                onBarcodeScanned={(res) => {
                  if (res?.data) {
                    handleBarcodeLookup(res.data);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.closeCameraBtn}
                onPress={() => setCameraActive(false)}
              >
                <Text style={styles.closeCameraText}>Cerrar Cámara</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.primaryBtn, { marginBottom: 12 }]}
              onPress={async () => {
                if (!permission?.granted) {
                  await requestPermission();
                }
                setCameraActive(true);
              }}
            >
              <Ionicons name="scan-outline" size={18} color="#020617" />
              <Text style={styles.primaryBtnText}>Abrir Cámara Escáner</Text>
            </TouchableOpacity>
          )}

          <View style={styles.barcodeManualRow}>
            <TextInput
              style={[styles.inputField, { flex: 1 }]}
              placeholder="Código EAN (ej. 7790895000997 o 3017620422003)"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={manualBarcode}
              onChangeText={setManualBarcode}
            />
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => handleBarcodeLookup(manualBarcode)}
            >
              <Text style={styles.secondaryBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          {scannerStatus && <Text style={styles.statusText}>{scannerStatus}</Text>}
        </View>
      )}

      {/* MODO 3: BUSCADOR OPENFOODFACTS + ALIMENTOS RÁPIDOS */}
      {mode === 'search' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Buscador OpenFoodFacts + Base Local</Text>
          <View style={styles.barcodeManualRow}>
            <TextInput
              style={[styles.inputField, { flex: 1 }]}
              placeholder="Buscar alimento o marca (ej. yogur griego, atún, avena)..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchFood}
            />
            <TouchableOpacity style={styles.primaryBtnSmall} onPress={handleSearchFood}>
              {searchLoading ? (
                <ActivityIndicator color="#020617" size="small" />
              ) : (
                <Ionicons name="search" size={18} color="#020617" />
              )}
            </TouchableOpacity>
          </View>

          {searchResults.map((item, idx) => (
            <View key={idx} style={styles.resultRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultSub}>
                  {item.portionDesc} • P: {item.proteinG}g | C: {item.carbsG}g | G: {item.fatG}g
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addChipBtn}
                onPress={() => addFoodEntries([item], mealCategory, 'barcode')}
              >
                <Text style={styles.addChipBtnText}>+{item.calories} kcal</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* PREVIEW DE ITEMS ANALIZADOS POR IA O ESCÁNER */}
      {previewItems.length > 0 && (
        <View style={styles.previewCard}>
          <Text style={styles.previewHeader}>
            Desglose Detectado ({previewItems.reduce((s, i) => s + i.calories, 0)} kcal totales)
          </Text>
          {previewItems.map((item, idx) => (
            <View key={idx} style={styles.previewItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultSub}>
                  {item.portionDesc} • Proteína {item.proteinG}g • Carbos {item.carbsG}g • Grasas{' '}
                  {item.fatG}g
                </Text>
              </View>
              <Text style={styles.previewKcal}>{item.calories} kcal</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmPreview}>
            <Ionicons name="checkmark-circle" size={18} color="#020617" />
            <Text style={styles.primaryBtnText}>Agregar a mi Registro de Hoy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COMIDAS RÁPIDAS DE 1 TOQUE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registro Rápido de 1 Toque</Text>
        <View style={styles.quickGrid}>
          {LOCAL_FOOD_DATABASE.slice(0, 8).map((food, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickFoodBtn}
              onPress={() =>
                addFoodEntries(
                  [
                    {
                      name: food.name,
                      portionDesc: food.unitLabel,
                      calories: food.caloriesPerUnit,
                      proteinG: Math.round(food.proteinPerUnit),
                      carbsG: Math.round(food.carbsPerUnit),
                      fatG: Math.round(food.fatPerUnit),
                    },
                  ],
                  mealCategory,
                  'quick'
                )
              }
            >
              <Text style={styles.quickFoodName} numberOfLines={1}>
                {food.name}
              </Text>
              <Text style={styles.quickFoodMeta}>
                {food.caloriesPerUnit} kcal • {Math.round(food.proteinPerUnit)}g P
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* HISTORIAL DE COMIDAS DE HOY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Historial de Hoy ({todayFoods.reduce((s, f) => s + f.calories, 0)} kcal)
        </Text>
        {todayFoods.map((f) => (
          <View key={f.id} style={styles.resultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{f.name}</Text>
              <Text style={styles.resultSub}>
                {f.timestamp} • {f.portionDesc} • P: {f.proteinG}g | C: {f.carbsG}g | G: {f.fatG}g
              </Text>
            </View>
            <Text style={[styles.previewKcal, { marginRight: 10 }]}>{f.calories} kcal</Text>
            <TouchableOpacity onPress={() => removeFoodEntry(f.id)}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
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
  mealCategoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  mealChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  mealChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  mealChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  mealChipTextActive: {
    color: '#020617',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 5,
  },
  modeTabActive: {
    backgroundColor: '#1E293B',
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardHint: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#020617',
    color: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    minHeight: 74,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  primaryBtnSmall: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  secondaryBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  cameraWrapper: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cameraView: {
    flex: 1,
  },
  closeCameraBtn: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeCameraText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  barcodeManualRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputField: {
    backgroundColor: '#020617',
    color: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 13,
  },
  statusText: {
    color: '#38BDF8',
    fontSize: 12,
    marginTop: 10,
  },
  previewCard: {
    backgroundColor: '#064E3B40',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 14,
  },
  previewHeader: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  previewItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  previewKcal: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  quickFoodBtn: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
  },
  quickFoodName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  quickFoodMeta: {
    color: '#38BDF8',
    fontSize: 11,
    marginTop: 2,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  resultName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  resultSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  addChipBtn: {
    backgroundColor: '#10B98122',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addChipBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
});
