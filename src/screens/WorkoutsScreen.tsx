import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
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
  AvailableTime,
  ClassicSportType,
  EquipmentMode,
  FeaturedVideoRoutine,
  MuscleGroup,
} from '../types';
import {
  FEATURED_VIDEO_ROUTINES,
  generateSmartRoutine,
  MUSCLE_GROUP_LABELS,
  POPULAR_FITNESS_CHANNELS,
} from '../data/exercises';
import { estimateSportCalories } from '../utils/energyCalculator';

export const WorkoutsScreen: React.FC = () => {
  const { profile, todayWorkouts, addWorkoutEntry, removeWorkoutEntry } = useFitness();

  const [section, setSection] = useState<'routines' | 'videos' | 'sports'>('routines');

  // Estado del Recomendador de Rutinas
  const [timeAvailable, setTimeAvailable] = useState<AvailableTime>(30);
  const [equipment, setEquipment] = useState<EquipmentMode>('gym');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('push');
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, number>>({});

  // Control de guía técnica y demostración visual real (sin IA)
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    'chest-bench-press'
  );
  const [animateFrames, setAnimateFrames] = useState<boolean>(false);
  const [frameIndex, setFrameIndex] = useState<0 | 1>(0);

  // Temporizador de descanso en vivo
  const [restTimerSec, setRestTimerSec] = useState<number>(0);

  // Estado de Deportes Clásicos (Fútbol, Correr, Natación, Caminar)
  const [selectedSport, setSelectedSport] = useState<ClassicSportType>('soccer');
  const [sportDuration, setSportDuration] = useState('60');
  const [sportIntensity, setSportIntensity] = useState<'low' | 'moderate' | 'high'>('high');
  const [sportHeartRate, setSportHeartRate] = useState('152');
  const [soccerFormat, setSoccerFormat] = useState<'5v5' | '7v7' | '8v8' | '11v11'>('7v7');
  const [runDistanceKm, setRunDistanceKm] = useState('5.0');
  const [swimLaps, setSwimLaps] = useState('40');
  const [poolLength, setPoolLength] = useState<25 | 50>(25);

  useEffect(() => {
    if (restTimerSec <= 0) return;
    const id = setInterval(() => {
      setRestTimerSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [restTimerSec]);

  useEffect(() => {
    if (!animateFrames) return;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev === 0 ? 1 : 0));
    }, 1100);
    return () => clearInterval(id);
  }, [animateFrames]);

  const routine = generateSmartRoutine({
    timeMinutes: timeAvailable,
    muscleGroup,
    equipment,
    weightKg: profile.weightKg,
  });

  const openYouTubeVideo = (videoId: string) => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`).catch(() => {});
  };

  const openYouTubeSearch = (query: string) => {
    Linking.openURL(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    ).catch(() => {});
  };

  const openChannelUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const handleToggleSet = (exId: string, maxSets: number, restSeconds: number) => {
    setCompletedSetsMap((prev) => {
      const current = prev[exId] || 0;
      const next = current >= maxSets ? 0 : current + 1;
      if (next > current) {
        setRestTimerSec(restSeconds);
      }
      return { ...prev, [exId]: next };
    });
  };

  const handleFinishRoutine = () => {
    const totalSetsCompleted = Object.values(completedSetsMap).reduce((s, n) => s + n, 0);
    addWorkoutEntry({
      title: routine.title,
      sportType: 'weights',
      durationMinutes: timeAvailable,
      caloriesBurned: routine.estimatedCalories,
      intensity: timeAvailable >= 45 ? 'high' : 'moderate',
      muscleGroups: [MUSCLE_GROUP_LABELS[muscleGroup].label],
      equipmentUsed: equipment,
      setsCompleted: totalSetsCompleted || routine.exercises.length * 3,
      source: 'routine',
    });
    setCompletedSetsMap({});
    setRestTimerSec(0);
  };

  const handleLogVideoRoutine = (vidRoutine: FeaturedVideoRoutine) => {
    addWorkoutEntry({
      title: `🎬 ${vidRoutine.title} (${vidRoutine.channelName})`,
      sportType: 'weights',
      durationMinutes: vidRoutine.durationMinutes,
      caloriesBurned: vidRoutine.estimatedCalories,
      intensity: vidRoutine.durationMinutes >= 30 ? 'high' : 'moderate',
      equipmentUsed: vidRoutine.equipment,
      source: 'routine',
    });
  };

  const durationNum = Math.max(5, parseInt(sportDuration || '30', 10) || 30);
  const hrNum = parseInt(sportHeartRate || '0', 10) || undefined;
  const estimatedSportKcal = estimateSportCalories({
    sportType: selectedSport,
    durationMinutes: durationNum,
    weightKg: profile.weightKg,
    intensity: sportIntensity,
    avgHeartRate: hrNum,
    age: profile.age,
  });

  const handleLogClassicSport = () => {
    const sportNames: Record<ClassicSportType, string> = {
      soccer: `Partido de Fútbol (${soccerFormat})`,
      running: `Running (${runDistanceKm} km)`,
      swimming: `Natación (${swimLaps} largos × ${poolLength}m)`,
      walking: `Caminata Activa (${runDistanceKm} km)`,
      weights: 'Entrenamiento de Fuerza',
    };

    addWorkoutEntry({
      title: sportNames[selectedSport],
      sportType: selectedSport,
      durationMinutes: durationNum,
      caloriesBurned: estimatedSportKcal,
      avgHeartRate: hrNum,
      distanceKm:
        selectedSport === 'running' || selectedSport === 'walking'
          ? parseFloat(runDistanceKm) || undefined
          : selectedSport === 'swimming'
          ? Number(((parseInt(swimLaps || '0', 10) * poolLength) / 1000).toFixed(2))
          : undefined,
      poolLaps: selectedSport === 'swimming' ? parseInt(swimLaps || '0', 10) : undefined,
      poolLengthM: selectedSport === 'swimming' ? poolLength : undefined,
      soccerFormat: selectedSport === 'soccer' ? soccerFormat : undefined,
      intensity: sportIntensity,
      source: 'manual',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Entrenamientos, Videos y Deportes</Text>
      <Text style={styles.pageSubtitle}>
        Fotos reales (sin IA), videos demostrativos de YouTube, canales top y deportes clásicos
      </Text>

      {/* Selector Principal de 3 Pestañas: Rutinas | Videos/Canales YouTube | Deportes Clásicos */}
      <View style={styles.topSwitch}>
        <TouchableOpacity
          style={[styles.switchBtn, section === 'routines' && styles.switchBtnActive]}
          onPress={() => setSection('routines')}
        >
          <Ionicons
            name="barbell-outline"
            size={15}
            color={section === 'routines' ? '#020617' : '#94A3B8'}
          />
          <Text
            style={[
              styles.switchBtnText,
              section === 'routines' && styles.switchBtnTextActive,
            ]}
          >
            Rutinas IA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, section === 'videos' && styles.switchBtnActive]}
          onPress={() => setSection('videos')}
        >
          <Ionicons
            name="logo-youtube"
            size={15}
            color={section === 'videos' ? '#020617' : '#EF4444'}
          />
          <Text
            style={[
              styles.switchBtnText,
              section === 'videos' && styles.switchBtnTextActive,
            ]}
          >
            Videos y Canales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, section === 'sports' && styles.switchBtnActive]}
          onPress={() => setSection('sports')}
        >
          <Ionicons
            name="football-outline"
            size={15}
            color={section === 'sports' ? '#020617' : '#94A3B8'}
          />
          <Text
            style={[
              styles.switchBtnText,
              section === 'sports' && styles.switchBtnTextActive,
            ]}
          >
            Deportes
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 1: RECOMENDADOR DE RUTINAS POR TIEMPO, EQUIPAMIENTO Y GRUPO MUSCULAR */}
      {section === 'routines' && (
        <>
          <View style={styles.card}>
            {/* 1. Tiempo Disponible */}
            <Text style={styles.filterLabel}>1. ¿Cuánto tiempo tienes hoy?</Text>
            <View style={styles.rowChips}>
              {([15, 30, 45, 60] as AvailableTime[]).map((t) => {
                const active = timeAvailable === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.choiceChip, active && styles.choiceChipActive]}
                    onPress={() => setTimeAvailable(t)}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        active && styles.choiceChipTextActive,
                      ]}
                    >
                      {t === 60 ? '60+ min' : `${t} min`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Equipamiento Disponible (Gimnasio, Casa, Calistenia) */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>
              2. Equipamiento disponible
            </Text>
            <View style={styles.rowChips}>
              {[
                { key: 'gym' as EquipmentMode, label: '🏋️ Gimnasio', sub: 'Máquinas/Barras' },
                { key: 'home' as EquipmentMode, label: '🏠 En Casa', sub: 'Mancuernas/Bandas' },
                {
                  key: 'calisthenics' as EquipmentMode,
                  label: '🤸 Calistenia',
                  sub: 'Peso Corporal',
                },
              ].map((eq) => {
                const active = equipment === eq.key;
                return (
                  <TouchableOpacity
                    key={eq.key}
                    style={[styles.eqCard, active && styles.eqCardActive]}
                    onPress={() => setEquipment(eq.key)}
                  >
                    <Text style={[styles.eqTitle, active && styles.eqTitleActive]}>
                      {eq.label}
                    </Text>
                    <Text style={styles.eqSub}>{eq.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Grupo Muscular o Split */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>
              3. Grupo Muscular o Split
            </Text>
            <View style={styles.muscleGrid}>
              {(Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[]).map((mg) => {
                const info = MUSCLE_GROUP_LABELS[mg];
                const active = muscleGroup === mg;
                return (
                  <TouchableOpacity
                    key={mg}
                    style={[styles.muscleChip, active && styles.muscleChipActive]}
                    onPress={() => setMuscleGroup(mg)}
                  >
                    <Ionicons
                      name={info.icon as any}
                      size={15}
                      color={active ? '#10B981' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.muscleChipText,
                        active && styles.muscleChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {info.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Temporizador de Descanso en Vivo */}
          {restTimerSec > 0 && (
            <View style={styles.timerBanner}>
              <Ionicons name="timer-outline" size={22} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.timerTitle}>
                  Descanso activo: {restTimerSec} segundos
                </Text>
                <Text style={styles.timerSub}>
                  Respira profundo y prepárate para la siguiente serie
                </Text>
              </View>
              <TouchableOpacity
                style={styles.skipTimerBtn}
                onPress={() => setRestTimerSec(0)}
              >
                <Text style={styles.skipTimerText}>Saltar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Rutina Generada con Fotos Reales + Videos de YouTube por Ejercicio */}
          <View style={styles.card}>
            <View style={styles.routineHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.routineTitle}>{routine.title}</Text>
                <Text style={styles.routineNote}>{routine.coachingNote}</Text>
              </View>
              <View style={styles.kcalBadge}>
                <Text style={styles.kcalBadgeVal}>~{routine.estimatedCalories}</Text>
                <Text style={styles.kcalBadgeUnit}>kcal</Text>
              </View>
            </View>

            <View style={styles.demoToolbar}>
              <Text style={styles.demoToolbarLabel}>
                📸 Fotos reales + 🎬 Video YouTube
              </Text>
              <TouchableOpacity
                style={[
                  styles.animToggleBtn,
                  animateFrames && styles.animToggleBtnActive,
                ]}
                onPress={() => setAnimateFrames((v) => !v)}
              >
                <Ionicons
                  name={animateFrames ? 'pause-circle' : 'play-circle'}
                  size={15}
                  color={animateFrames ? '#020617' : '#38BDF8'}
                />
                <Text
                  style={[
                    styles.animToggleText,
                    animateFrames && { color: '#020617' },
                  ]}
                >
                  {animateFrames ? 'Pausar Fotos' : 'Animar Fotos'}
                </Text>
              </TouchableOpacity>
            </View>

            {routine.exercises.map((ex, idx) => {
              const doneSets = completedSetsMap[ex.id] || 0;
              const isAllDone = doneSets >= ex.recommendedSets;
              const isExpanded = expandedExerciseId === ex.id;

              return (
                <View key={ex.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseTopRow}>
                    <View style={styles.exIndexBadge}>
                      <Text style={styles.exIndexText}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exMeta}>
                        {ex.recommendedSets} series × {ex.defaultReps} • Descanso {ex.restSeconds}s •{' '}
                        {ex.equipmentLabel}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.setCounterBtn, isAllDone && styles.setCounterBtnDone]}
                      onPress={() =>
                        handleToggleSet(ex.id, ex.recommendedSets, ex.restSeconds)
                      }
                    >
                      <Text
                        style={[
                          styles.setCounterText,
                          isAllDone && { color: '#020617' },
                        ]}
                      >
                        {doneSets}/{ex.recommendedSets} series
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.secondaryMusclesRow}>
                    {ex.secondaryMuscles.map((m, i) => (
                      <View key={i} style={styles.muscleTagPill}>
                        <Text style={styles.muscleTagText}>{m}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Demostración Visual Fotográfica Real */}
                  {animateFrames ? (
                    <View style={styles.singleAnimatedWrapper}>
                      <Image
                        source={{ uri: ex.demoImages[frameIndex] }}
                        style={styles.animatedDemoImg}
                        resizeMode="cover"
                      />
                      <View style={styles.frameLabelOverlay}>
                        <Text style={styles.frameLabelText}>
                          {frameIndex === 0
                            ? '1. Posición Inicial'
                            : '2. Contracción / Esfuerzo'}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.dualPhotosRow}>
                      <View style={styles.photoBox}>
                        <Image
                          source={{ uri: ex.demoImages[0] }}
                          style={styles.demoPhoto}
                          resizeMode="cover"
                        />
                        <View style={styles.photoCaption}>
                          <Text style={styles.photoCaptionText}>1. Inicio</Text>
                        </View>
                      </View>

                      <View style={styles.photoBox}>
                        <Image
                          source={{ uri: ex.demoImages[1] }}
                          style={styles.demoPhoto}
                          resizeMode="cover"
                        />
                        <View
                          style={[
                            styles.photoCaption,
                            { backgroundColor: 'rgba(16, 185, 129, 0.88)' },
                          ]}
                        >
                          <Text style={[styles.photoCaptionText, { color: '#020617' }]}>
                            2. Contracción
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <Text style={styles.exInstructions}>{ex.instructions}</Text>
                  <Text style={styles.exTip}>💡 Clave postural: {ex.proTip}</Text>

                  {/* Botones de Video Demostrativo en YouTube */}
                  <View style={styles.youtubeRow}>
                    <TouchableOpacity
                      style={styles.ytWatchBtn}
                      onPress={() => openYouTubeVideo(ex.youtubeVideoId)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="logo-youtube" size={17} color="#EF4444" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ytWatchTitle} numberOfLines={1}>
                          Ver Video: {ex.youtubeTitle}
                        </Text>
                        <Text style={styles.ytWatchChannel}>
                          Canal: {ex.youtubeChannel}
                        </Text>
                      </View>
                      <Ionicons name="open-outline" size={15} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.ytSearchEsBtn}
                      onPress={() =>
                        openYouTubeSearch(`${ex.name} tecnica correcta español`)
                      }
                    >
                      <Ionicons name="search" size={14} color="#38BDF8" />
                      <Text style={styles.ytSearchEsText}>+ES</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Botón para abrir/cerrar el Paso a Paso completo y Errores Comunes */}
                  <TouchableOpacity
                    style={styles.expandGuideBtn}
                    onPress={() =>
                      setExpandedExerciseId(isExpanded ? null : ex.id)
                    }
                  >
                    <Ionicons
                      name={
                        isExpanded
                          ? 'chevron-up-circle-outline'
                          : 'information-circle-outline'
                      }
                      size={16}
                      color="#10B981"
                    />
                    <Text style={styles.expandGuideText}>
                      {isExpanded
                        ? 'Ocultar guía técnica detallada'
                        : 'Ver técnica paso a paso y errores a evitar'}
                    </Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.guideExpandedBox}>
                      <Text style={styles.guideSubHeader}>
                        ✅ Cómo realizarlo correctamente (Paso a Paso):
                      </Text>
                      {ex.stepByStep.map((step, sIdx) => (
                        <View key={sIdx} style={styles.stepRow}>
                          <Text style={styles.stepNumber}>{sIdx + 1}.</Text>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}

                      <Text
                        style={[
                          styles.guideSubHeader,
                          { color: '#F87171', marginTop: 10 },
                        ]}
                      >
                        ⚠️ Errores comunes a evitar:
                      </Text>
                      {ex.commonMistakes.map((mistake, mIdx) => (
                        <View key={mIdx} style={styles.stepRow}>
                          <Text style={[styles.stepNumber, { color: '#F87171' }]}>
                            •
                          </Text>
                          <Text style={styles.mistakeText}>{mistake}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            <TouchableOpacity style={styles.finishWorkoutBtn} onPress={handleFinishRoutine}>
              <Ionicons name="checkmark-done-circle" size={20} color="#020617" />
              <Text style={styles.finishWorkoutText}>
                Completar Rutina y Sumar +{routine.estimatedCalories} kcal al Gasto
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* SECCIÓN 2: VIDEOS DE RUTINAS SIMPLIFICADAS Y CANALES POPULARES DE YOUTUBE */}
      {section === 'videos' && (
        <>
          <View style={styles.card}>
            <Text style={styles.filterLabel}>
              🎬 Rutinas Guiadas en Video (&quot;Sígueme / Paso a Paso&quot;)
            </Text>
            <Text style={styles.routineNote}>
              Toca cualquier miniatura para abrir la rutina en la app de YouTube de tu Pixel 9 Pro, o registra sus calorías al terminar.
            </Text>

            {FEATURED_VIDEO_ROUTINES.map((vid) => (
              <View key={vid.id} style={styles.videoRoutineCard}>
                <TouchableOpacity
                  style={styles.videoThumbContainer}
                  onPress={() => openYouTubeVideo(vid.videoId)}
                  activeOpacity={0.88}
                >
                  <Image
                    source={{
                      uri: `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`,
                    }}
                    style={styles.videoThumbImage}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlayButton}>
                    <Ionicons name="logo-youtube" size={28} color="#EF4444" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationBadgeText}>
                      {vid.durationMinutes} min • ~{vid.estimatedCalories} kcal
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.videoInfoBody}>
                  <Text style={styles.videoChannelTag}>{vid.channelName}</Text>
                  <Text style={styles.videoRoutineTitle}>{vid.title}</Text>
                  <Text style={styles.videoRoutineMeta}>{vid.level}</Text>

                  <View style={styles.videoActionsRow}>
                    <TouchableOpacity
                      style={styles.watchYoutubePrimaryBtn}
                      onPress={() => openYouTubeVideo(vid.videoId)}
                    >
                      <Ionicons name="play" size={15} color="#F8FAFC" />
                      <Text style={styles.watchYoutubePrimaryText}>
                        Ver en YouTube
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.logVideoWorkoutBtn}
                      onPress={() => handleLogVideoRoutine(vid)}
                    >
                      <Ionicons name="flame" size={15} color="#020617" />
                      <Text style={styles.logVideoWorkoutText}>
                        Sumar +{vid.estimatedCalories} kcal
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.filterLabel}>
              🏆 Canales de Fitness Recomendados
            </Text>
            <Text style={styles.routineNote}>
              Seleccionados por su calidad biomecánica, claridad al explicar la técnica y rutinas sin humo.
            </Text>

            {POPULAR_FITNESS_CHANNELS.map((ch) => (
              <TouchableOpacity
                key={ch.id}
                style={styles.channelRowCard}
                onPress={() => openChannelUrl(ch.channelUrl)}
                activeOpacity={0.85}
              >
                <View style={styles.channelAvatar}>
                  <Ionicons name="logo-youtube" size={22} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.channelTitleRow}>
                    <Text style={styles.channelName}>{ch.name}</Text>
                    <View style={styles.langPill}>
                      <Text style={styles.langPillText}>{ch.language}</Text>
                    </View>
                  </View>
                  <Text style={styles.channelSpecialty}>{ch.specialty}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color="#38BDF8" />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* SECCIÓN 3: DEPORTES CLÁSICOS (FÚTBOL, CORRER, NATACIÓN, CAMINAR) */}
      {section === 'sports' && (
        <View style={styles.card}>
          <Text style={styles.filterLabel}>Selecciona el Deporte Clásico</Text>
          <View style={styles.sportSelectorGrid}>
            {[
              { key: 'soccer' as ClassicSportType, label: 'Fútbol', icon: 'football', color: '#10B981' },
              { key: 'running' as ClassicSportType, label: 'Correr', icon: 'walk', color: '#F59E0B' },
              { key: 'swimming' as ClassicSportType, label: 'Natación', icon: 'water', color: '#38BDF8' },
              { key: 'walking' as ClassicSportType, label: 'Caminar', icon: 'footsteps', color: '#A855F7' },
            ].map((sp) => {
              const active = selectedSport === sp.key;
              return (
                <TouchableOpacity
                  key={sp.key}
                  style={[
                    styles.sportTile,
                    active && { borderColor: sp.color, backgroundColor: '#1E293B' },
                  ]}
                  onPress={() => setSelectedSport(sp.key)}
                >
                  <Ionicons name={sp.icon as any} size={24} color={sp.color} />
                  <Text style={styles.sportTileName}>{sp.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedSport === 'soccer' && (
            <View style={styles.sportFieldGroup}>
              <Text style={styles.fieldLabel}>Formato de Cancha (Fútbol)</Text>
              <View style={styles.rowChips}>
                {(['5v5', '7v7', '8v8', '11v11'] as const).map((fmt) => (
                  <TouchableOpacity
                    key={fmt}
                    style={[
                      styles.choiceChip,
                      soccerFormat === fmt && styles.choiceChipActive,
                    ]}
                    onPress={() => setSoccerFormat(fmt)}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        soccerFormat === fmt && styles.choiceChipTextActive,
                      ]}
                    >
                      Fútbol {fmt.split('v')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {(selectedSport === 'running' || selectedSport === 'walking') && (
            <View style={styles.sportFieldGroup}>
              <Text style={styles.fieldLabel}>Distancia recorrida (km)</Text>
              <TextInput
                style={styles.sportInput}
                value={runDistanceKm}
                onChangeText={setRunDistanceKm}
                keyboardType="decimal-pad"
                placeholder="Ej. 5.0"
                placeholderTextColor="#64748B"
              />
            </View>
          )}

          {selectedSport === 'swimming' && (
            <View style={styles.sportFieldGroup}>
              <Text style={styles.fieldLabel}>Largos de Pileta y Medida</Text>
              <View style={styles.rowChips}>
                <TextInput
                  style={[styles.sportInput, { flex: 1 }]}
                  value={swimLaps}
                  onChangeText={setSwimLaps}
                  keyboardType="numeric"
                  placeholder="Largos (ej. 40)"
                  placeholderTextColor="#64748B"
                />
                {([25, 50] as const).map((len) => (
                  <TouchableOpacity
                    key={len}
                    style={[
                      styles.choiceChip,
                      poolLength === len && styles.choiceChipActive,
                    ]}
                    onPress={() => setPoolLength(len)}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        poolLength === len && styles.choiceChipTextActive,
                      ]}
                    >
                      {len}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.twoInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Duración (minutos)</Text>
              <TextInput
                style={styles.sportInput}
                value={sportDuration}
                onChangeText={setSportDuration}
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>FC Media Amazfit (bpm)</Text>
              <TextInput
                style={styles.sportInput}
                value={sportHeartRate}
                onChangeText={setSportHeartRate}
                keyboardType="numeric"
                placeholder="Opcional (ej. 150)"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Intensidad de la Sesión</Text>
          <View style={styles.rowChips}>
            {[
              { key: 'low' as const, label: 'Suave / Recreativo' },
              { key: 'moderate' as const, label: 'Moderado / Sostenido' },
              { key: 'high' as const, label: 'Intenso / Competitivo' },
            ].map((intObj) => (
              <TouchableOpacity
                key={intObj.key}
                style={[
                  styles.choiceChip,
                  sportIntensity === intObj.key && styles.choiceChipActive,
                ]}
                onPress={() => setSportIntensity(intObj.key)}
              >
                <Text
                  style={[
                    styles.choiceChipText,
                    sportIntensity === intObj.key && styles.choiceChipTextActive,
                  ]}
                >
                  {intObj.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sportSummaryBox}>
            <View>
              <Text style={styles.sportSummaryLabel}>
                Gasto Energético Estimado ({profile.weightKg} kg)
              </Text>
              <Text style={styles.sportSummarySub}>
                Cálculo ACSM por METs + Ajuste de Frecuencia Cardíaca
              </Text>
            </View>
            <Text style={styles.sportSummaryKcal}>🔥 {estimatedSportKcal} kcal</Text>
          </View>

          <TouchableOpacity style={styles.finishWorkoutBtn} onPress={handleLogClassicSport}>
            <Ionicons name="add-circle" size={20} color="#020617" />
            <Text style={styles.finishWorkoutText}>
              Registrar Sesión Deportiva (+{estimatedSportKcal} kcal)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Historial de Entrenamientos de Hoy */}
      <View style={styles.card}>
        <Text style={styles.filterLabel}>Sesiones Registradas Hoy</Text>
        {todayWorkouts.length === 0 ? (
          <Text style={styles.routineNote}>
            Todavía no hay sesiones registradas en el día de hoy.
          </Text>
        ) : (
          todayWorkouts.map((w) => (
            <View key={w.id} style={styles.historyRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{w.title}</Text>
                <Text style={styles.exMeta}>
                  {w.durationMinutes} min • {w.avgHeartRate ? `${w.avgHeartRate} bpm • ` : ''}
                  {w.source === 'amazfit_health_connect' ? '⌚ Amazfit Active 2' : '📱 App'}
                </Text>
              </View>
              <Text style={styles.historyKcal}>-{w.caloriesBurned} kcal</Text>
              <TouchableOpacity onPress={() => removeWorkoutEntry(w.id)}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
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
  topSwitch: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  switchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 5,
  },
  switchBtnActive: {
    backgroundColor: '#10B981',
  },
  switchBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  switchBtnTextActive: {
    color: '#020617',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  filterLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  rowChips: {
    flexDirection: 'row',
    gap: 8,
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  choiceChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  choiceChipTextActive: {
    color: '#020617',
    fontWeight: '800',
  },
  eqCard: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  eqCardActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  eqTitle: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  eqTitleActive: {
    color: '#38BDF8',
  },
  eqSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 6,
  },
  muscleChipActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  muscleChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  muscleChipTextActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 14,
    gap: 10,
  },
  timerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  timerSub: {
    color: '#A7F3D0',
    fontSize: 11,
  },
  skipTimerBtn: {
    backgroundColor: '#020617',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skipTimerText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  routineTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  routineNote: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  kcalBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  kcalBadgeVal: {
    color: '#FB923C',
    fontSize: 15,
    fontWeight: '800',
  },
  kcalBadgeUnit: {
    color: '#FDBA74',
    fontSize: 10,
  },
  demoToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#020617',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  demoToolbarLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  animToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  animToggleBtnActive: {
    backgroundColor: '#38BDF8',
  },
  animToggleText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseCard: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  exerciseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exIndexText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  exName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  exMeta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  setCounterBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  setCounterBtnDone: {
    backgroundColor: '#10B981',
  },
  setCounterText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryMusclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  muscleTagPill: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  muscleTagText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  dualPhotosRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  photoBox: {
    flex: 1,
    height: 128,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  demoPhoto: {
    width: '100%',
    height: '100%',
  },
  photoCaption: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(2, 6, 23, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  photoCaptionText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
  },
  singleAnimatedWrapper: {
    height: 175,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF866',
  },
  animatedDemoImg: {
    width: '100%',
    height: '100%',
  },
  frameLabelOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  frameLabelText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  exInstructions: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
  exTip: {
    color: '#38BDF8',
    fontSize: 11,
    marginTop: 5,
    fontWeight: '600',
  },
  youtubeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  ytWatchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#EF444455',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  ytWatchTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  ytWatchChannel: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  ytSearchEsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 3,
  },
  ytSearchEsText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  expandGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  expandGuideText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  guideExpandedBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 11,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  guideSubHeader: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 5,
  },
  stepNumber: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
    width: 14,
  },
  stepText: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  mistakeText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  videoRoutineCard: {
    backgroundColor: '#020617',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 12,
  },
  videoThumbContainer: {
    height: 155,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbImage: {
    width: '100%',
    height: '100%',
  },
  playOverlayButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationBadgeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  videoInfoBody: {
    padding: 12,
  },
  videoChannelTag: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  videoRoutineTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  videoRoutineMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  videoActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  watchYoutubePrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  watchYoutubePrimaryText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  logVideoWorkoutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 5,
  },
  logVideoWorkoutText: {
    color: '#020617',
    fontSize: 12,
    fontWeight: '800',
  },
  channelRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 10,
    gap: 10,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  langPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  langPillText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  channelSpecialty: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  finishWorkoutBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  finishWorkoutText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '800',
  },
  sportSelectorGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  sportTile: {
    flex: 1,
    backgroundColor: '#020617',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    gap: 6,
  },
  sportTileName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  sportFieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  sportInput: {
    backgroundColor: '#020617',
    color: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  twoInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sportSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sportSummaryLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  sportSummarySub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  sportSummaryKcal: {
    color: '#FB923C',
    fontSize: 18,
    fontWeight: '900',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 10,
  },
  historyKcal: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 6,
  },
});
