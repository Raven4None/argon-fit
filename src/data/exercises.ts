import {
  AvailableTime,
  EquipmentMode,
  ExerciseCatalogItem,
  FeaturedVideoRoutine,
  FitnessChannelInfo,
  MuscleGroup,
} from '../types';

const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

/**
 * Canales de Fitness más populares y respetados por su rigor técnico y rutinas prácticas
 */
export const POPULAR_FITNESS_CHANNELS: FitnessChannelInfo[] = [
  {
    id: 'powerexplosive',
    name: 'Powerexplosive',
    specialty: 'Biomecánica, Fuerza y Técnica en Gimnasio (Español)',
    language: 'ES',
    equipmentFocus: ['gym', 'calisthenics'],
    channelUrl: 'https://www.youtube.com/@Powerexplosive',
  },
  {
    id: 'athleanx-es',
    name: 'ATHLEAN-X Español',
    specialty: 'Prevención de lesiones, Mancuernas y Ciencia Muscular',
    language: 'ES',
    equipmentFocus: ['gym', 'home', 'calisthenics'],
    channelUrl: 'https://www.youtube.com/@ATHLEANXespanol',
  },
  {
    id: 'buff-academy',
    name: 'BUFF Academy',
    specialty: 'Calistenia, Peso Corporal y Rutinas "Hazlo Conmigo"',
    language: 'ES',
    equipmentFocus: ['calisthenics', 'home'],
    channelUrl: 'https://www.youtube.com/@BUFFAcademy',
  },
  {
    id: 'sergio-peinado',
    name: 'Entrena con Sergio Peinado',
    specialty: 'Rutinas Guiadas por Tiempo (15 y 30 min) y Quema Calórica',
    language: 'ES',
    equipmentFocus: ['home', 'calisthenics'],
    channelUrl: 'https://www.youtube.com/@EntrenaconSergioPeinado',
  },
  {
    id: 'jeff-nippard',
    name: 'Jeff Nippard & Calisthenicmovement',
    specialty: 'Hipertrofia Basada en Evidencia y Ejecución Perfecta',
    language: 'EN',
    equipmentFocus: ['gym', 'calisthenics'],
    channelUrl: 'https://www.youtube.com/@JeffNippard',
  },
];

/**
 * Rutinas simplificadas en video ("Sígueme / Paso a Paso") de canales populares
 */
export const FEATURED_VIDEO_ROUTINES: FeaturedVideoRoutine[] = [
  {
    id: 'vid-routine-15m-sergio',
    title: 'Rutina Express 15 Minutos Cuerpo Completo (Quema Calórica)',
    channelName: 'Entrena con Sergio Peinado',
    videoId: 'fEP6YAatUtM',
    durationMinutes: 15,
    equipment: 'calisthenics',
    muscleGroup: 'full_body',
    estimatedCalories: 165,
    level: 'Todos los niveles • Sin equipamiento',
  },
  {
    id: 'vid-routine-buff-full',
    title: 'Rutina Cuerpo Completo en Casa (Calistenia Hazlo Conmigo)',
    channelName: 'BUFF Academy',
    videoId: '9rTnTI2Jg78',
    durationMinutes: 30,
    equipment: 'calisthenics',
    muscleGroup: 'full_body',
    estimatedCalories: 280,
    level: 'Intermedio • Peso Corporal',
  },
  {
    id: 'vid-routine-buff-chest',
    title: 'Pecho y Brazos en Casa (Flexiones para Pectorales y Tríceps)',
    channelName: 'BUFF Academy',
    videoId: '5sDO0z49vDE',
    durationMinutes: 30,
    equipment: 'calisthenics',
    muscleGroup: 'push',
    estimatedCalories: 245,
    level: 'Todos los niveles • Peso Corporal',
  },
  {
    id: 'vid-routine-athlean-db',
    title: 'Rutina en Casa SOLO MANCUERNAS para Definición y Fuerza',
    channelName: 'ATHLEAN-X Español',
    videoId: 'h_j2o_WdrYQ',
    durationMinutes: 30,
    equipment: 'home',
    muscleGroup: 'full_body',
    estimatedCalories: 290,
    level: 'Intermedio • Par de Mancuernas',
  },
  {
    id: 'vid-routine-sergio-30m',
    title: 'Rutina Cardio, Muscular y Abdominales (30 Minutos Guiados)',
    channelName: 'Entrena con Sergio Peinado',
    videoId: 'rVf5O-incwI',
    durationMinutes: 30,
    equipment: 'home',
    muscleGroup: 'core',
    estimatedCalories: 310,
    level: 'Todos los niveles • En Casa',
  },
  {
    id: 'vid-routine-nippard-push',
    title: 'Rutina Definitiva de Empuje (Pecho, Hombros y Tríceps)',
    channelName: 'Jeff Nippard',
    videoId: 'c3pbe3qzatQ',
    durationMinutes: 45,
    equipment: 'gym',
    muscleGroup: 'push',
    estimatedCalories: 340,
    level: 'Gimnasio Completo • Hipertrofia',
  },
];

export const EXERCISE_CATALOG: ExerciseCatalogItem[] = [
  // ================= PECHO (CHEST) =================
  {
    id: 'chest-bench-press',
    name: 'Press de Banca Plano con Barra',
    muscleGroup: 'chest',
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: ['gym'],
    equipmentLabel: 'Barra y Banco',
    defaultSets: 4,
    defaultReps: '8-10',
    restSeconds: 90,
    caloriesPerSet: 14,
    instructions:
      'Retrae las escápulas, apoya firme los pies y baja la barra de forma controlada hasta la línea media del pecho.',
    proTip: 'Mantén los codos a 45°-60° del torso para proteger el manguito rotador.',
    demoImages: [
      `${IMG_BASE}/Barbell_Bench_Press_-_Medium_Grip/0.jpg`,
      `${IMG_BASE}/Barbell_Bench_Press_-_Medium_Grip/1.jpg`,
    ],
    stepByStep: [
      'Acuéstate en el banco con los ojos debajo de la barra, junta los omóplatos (retracción escapular) y apoya toda la planta de los pies en el piso.',
      'Saca la barra e inhala mientras bajas en 2 segundos hacia la línea de los pezones con los codos a ~45° del cuerpo.',
      'Empuja con potencia hacia arriba y levemente atrás (hacia tus ojos) exhalando al superar el punto medio.',
    ],
    commonMistakes: [
      'Abrir los codos a 90° en forma de "T" (sobrecarga el hombro).',
      'Rebotar la barra contra el esternón o despegar los glúteos del banco.',
    ],
    youtubeVideoId: '7aQY3u0Dk-Q',
    youtubeChannel: 'Powerexplosive',
    youtubeTitle: 'Press Banca: Técnica, Consejos y Errores',
  },
  {
    id: 'chest-incline-db',
    name: 'Press Inclinado con Mancuernas',
    muscleGroup: 'chest',
    secondaryMuscles: ['Pectoral Superior', 'Hombros'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Mancuernas',
    defaultSets: 4,
    defaultReps: '10-12',
    restSeconds: 75,
    caloriesPerSet: 12,
    instructions:
      'Con banco a 30° (o apoyo inclinado en casa), empuja las mancuernas convergiendo ligeramente arriba sin chocarlas.',
    proTip: 'No superes los 30-35° de inclinación para no transferir todo el trabajo al deltoides.',
    demoImages: [
      `${IMG_BASE}/Incline_Dumbbell_Press/0.jpg`,
      `${IMG_BASE}/Incline_Dumbbell_Press/1.jpg`,
    ],
    stepByStep: [
      'Ajusta el respaldo a 30° de inclinación y apoya las mancuernas en los muslos para impulsarte al acostarte.',
      'Baja las mancuernas de forma controlada hasta que queden a los lados de la parte alta del pecho sintiendo el estiramiento pectoral.',
      'Empuja verticalmente cerrando el arco arriba pero deteniéndote a 2-3 cm antes de que choquen.',
    ],
    commonMistakes: [
      'Poner el banco a 45° o 60°, convirtiéndolo casi en un press de hombros.',
      'Chocar las mancuernas arriba perdiendo tensión continua en el pecho.',
    ],
    youtubeVideoId: '8iPEnn-ltC8',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Dumbbell Incline Chest Press',
  },
  {
    id: 'chest-cable-fly',
    name: 'Cruces en Polea Alta / Bandas',
    muscleGroup: 'chest',
    secondaryMuscles: ['Pectoral Interno', 'Core'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Poleas o Bandas Elásticas',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    caloriesPerSet: 10,
    instructions:
      'Da un paso adelante para estabilidad y junta las manos frente al pecho manteniendo una leve flexión de codos.',
    proTip: 'Sostén 1 segundo la contracción máxima al cerrar.',
    demoImages: [
      `${IMG_BASE}/Cable_Crossover/0.jpg`,
      `${IMG_BASE}/Cable_Crossover/1.jpg`,
    ],
    stepByStep: [
      'Toma los agarres (o bandas ancladas arriba), adelanta una pierna para equilibrar el torso e inclínate unos 15°.',
      'Con los codos levemente flexionados y fijos (como abrazando un árbol), cierra los brazos en arco frente al esternón.',
      'Aprieta el pecho 1 segundo al juntar las manos y vuelve lento controlando la tensión.',
    ],
    commonMistakes: [
      'Doblar y estirar los codos convirtiendo el cruce en un press de tríceps.',
      'Llevar los codos demasiado atrás de la línea de los hombros al abrir.',
    ],
    youtubeVideoId: 'taI4XduLpTk',
    youtubeChannel: 'LIVESTRONG / Guía Técnica',
    youtubeTitle: 'Ejecución Correcta de Cruces en Polea (Cable Crossover)',
  },
  {
    id: 'chest-pushups-std',
    name: 'Flexiones de Brazos (Push-Ups)',
    muscleGroup: 'chest',
    secondaryMuscles: ['Tríceps', 'Core', 'Deltoides'],
    equipment: ['calisthenics', 'home', 'gym'],
    equipmentLabel: 'Peso Corporal',
    defaultSets: 4,
    defaultReps: '12-20',
    restSeconds: 60,
    caloriesPerSet: 11,
    instructions:
      'Cuerpo en línea recta con glúteos y abdomen activos. Baja hasta rozar el suelo con el pecho y sube con potencia.',
    proTip: 'Empuja el suelo como si quisieras juntar tus manos para activar más fibras pectorales.',
    demoImages: [`${IMG_BASE}/Pushups/0.jpg`, `${IMG_BASE}/Pushups/1.jpg`],
    stepByStep: [
      'Coloca las manos un poco más anchas que los hombros con los dedos abiertos apuntando hacia adelante.',
      'Activa abdomen y glúteos formando una tabla rígida desde los tobillos hasta la cabeza.',
      'Baja con los codos en diagonal hacia atrás (flecha, no "T") hasta que el pecho quede a 2 cm del piso y empuja completo.',
    ],
    commonMistakes: [
      'Dejar caer la cadera o arquear la zona lumbar por falta de tensión abdominal.',
      'Hacer medias repeticiones sin acercar el pecho al suelo.',
    ],
    youtubeVideoId: 'IODxDxX7oi4',
    youtubeChannel: 'Calisthenicmovement',
    youtubeTitle: 'The Perfect Push Up | Do it right!',
  },
  {
    id: 'chest-decline-pushups',
    name: 'Flexiones Declinadas (Pies Elevados)',
    muscleGroup: 'chest',
    secondaryMuscles: ['Pectoral Superior', 'Tríceps'],
    equipment: ['calisthenics', 'home'],
    equipmentLabel: 'Peso Corporal (Silla/Escalón)',
    defaultSets: 3,
    defaultReps: '10-15',
    restSeconds: 60,
    caloriesPerSet: 12,
    instructions:
      'Apoya los pies sobre una silla o banco y realiza la flexión enfocando el estímulo en el pectoral superior.',
    proTip: 'Mantén el cuello neutro mirando ligeramente hacia adelante.',
    demoImages: [
      `${IMG_BASE}/Decline_Push-Up/0.jpg`,
      `${IMG_BASE}/Decline_Push-Up/1.jpg`,
    ],
    stepByStep: [
      'Apoya las puntas de los pies sobre un banco o silla estable y las manos en el suelo a la altura de los hombros.',
      'Desciende de forma controlada manteniendo el abdomen contraído para que la espalda no se hunda.',
      'Empuja fuerte hacia arriba bloqueando de forma controlada en la parte superior.',
    ],
    commonMistakes: [
      'Mirar hacia el ombligo encorvando las cervicales.',
      'Colocar las manos demasiado adelantadas respecto a la línea de los hombros.',
    ],
    youtubeVideoId: 'SKPab2YC8BE',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Decline Push-Up',
  },
  {
    id: 'chest-dips',
    name: 'Fondos en Paralelas (Énfasis Pecho)',
    muscleGroup: 'chest',
    secondaryMuscles: ['Tríceps', 'Pectoral Inferior'],
    equipment: ['gym', 'calisthenics'],
    equipmentLabel: 'Barras Paralelas',
    defaultSets: 3,
    defaultReps: '8-12',
    restSeconds: 90,
    caloriesPerSet: 14,
    instructions:
      'Inclina el torso unos 25° hacia adelante al bajar hasta que los hombros queden a la altura de los codos.',
    proTip: 'Inclinarte hacia adelante recluta mucho más el pectoral que bajar completamente vertical.',
    demoImages: [
      `${IMG_BASE}/Dips_-_Chest_Version/0.jpg`,
      `${IMG_BASE}/Dips_-_Chest_Version/1.jpg`,
    ],
    stepByStep: [
      'Súbete a las paralelas con los brazos extendidos y los hombros lejos de las orejas (depresión escapular).',
      'Flexiona las rodillas, inclina el torso unos 25°-30° hacia adelante y baja hasta que el hombro baje al nivel del codo.',
      'Empuja las barras hacia abajo manteniendo la inclinación del torso.',
    ],
    commonMistakes: [
      'Encoger los hombros hacia las orejas al bajar.',
      'Bajar más allá de tu movilidad activa forzando la cápsula anterior del hombro.',
    ],
    youtubeVideoId: '2z8JmcrW-As',
    youtubeChannel: 'Calisthenicmovement',
    youtubeTitle: 'The Perfect Dip - Do it right!',
  },

  // ================= ESPALDA (BACK) =================
  {
    id: 'back-pullups',
    name: 'Dominadas Pronas (Pull-Ups)',
    muscleGroup: 'back',
    secondaryMuscles: ['Dorsal Ancho', 'Bíceps', 'Core'],
    equipment: ['gym', 'home', 'calisthenics'],
    equipmentLabel: 'Barra de Dominadas',
    defaultSets: 4,
    defaultReps: '6-12',
    restSeconds: 90,
    caloriesPerSet: 15,
    instructions:
      'Inicia el movimiento deprimiendo las escápulas y lleva la parte alta del pecho hacia la barra.',
    proTip: 'Piensa en bajar los codos hacia tus bolsillos traseros para aislar los dorsales.',
    demoImages: [`${IMG_BASE}/Pullups/0.jpg`, `${IMG_BASE}/Pullups/1.jpg`],
    stepByStep: [
      'Toma la barra con agarre prono (palmas hacia adelante) un poco más ancho que los hombros.',
      'Antes de doblar los codos, baja los hombros activando las escápulas y saca pecho.',
      'Tira hasta pasar la barbilla sobre la barra y desciende de forma controlada hasta extender los brazos.',
    ],
    commonMistakes: [
      'Patear o balancear las piernas sin control (kipping involuntario).',
      'No extender los brazos por completo abajo acortando el rango de movimiento.',
    ],
    youtubeVideoId: 'eGo4IYlbE5g',
    youtubeChannel: 'Calisthenicmovement / Powerexplosive',
    youtubeTitle: 'The Perfect Pull Up - Do it right!',
  },
  {
    id: 'back-lat-pulldown',
    name: 'Jalón al Pecho en Polea Alta',
    muscleGroup: 'back',
    secondaryMuscles: ['Dorsal Ancho', 'Bíceps'],
    equipment: ['gym'],
    equipmentLabel: 'Polea Alta',
    defaultSets: 4,
    defaultReps: '10-12',
    restSeconds: 75,
    caloriesPerSet: 12,
    instructions:
      'Toma la barra algo más ancho que los hombros y tracciona hacia la clavícula inclinando levemente el torso.',
    proTip: 'Evita columpiarte; controla 2 segundos la subida.',
    demoImages: [
      `${IMG_BASE}/Wide-Grip_Lat_Pulldown/0.jpg`,
      `${IMG_BASE}/Wide-Grip_Lat_Pulldown/1.jpg`,
    ],
    stepByStep: [
      'Ajusta el rodillo sobre los muslos para quedar firme y toma la barra a 1.5 veces el ancho de hombros.',
      'Inclina el torso apenas 15° hacia atrás sacando el esternón hacia el techo.',
      'Tracciona la barra hacia la parte superior del pecho llevando los codos hacia abajo y adentro.',
    ],
    commonMistakes: [
      'Tirar la barra por detrás de la nuca (lesivo para cervicales y manguito rotador).',
      'Acostarse hacia atrás convirtiendo el jalón vertical en un remo con impulso.',
    ],
    youtubeVideoId: 'CAwf7n6Luuc',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Lat Pulldown | 3 Golden Rules',
  },
  {
    id: 'back-barbell-row',
    name: 'Remo con Barra / Mancuernas a 45°',
    muscleGroup: 'back',
    secondaryMuscles: ['Romboides', 'Trapecio Medio', 'Lumbares'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Barra o Mancuernas',
    defaultSets: 4,
    defaultReps: '8-12',
    restSeconds: 90,
    caloriesPerSet: 14,
    instructions:
      'Bisagra de cadera a 45°, espalda neutra y tracciona el peso hacia el ombligo apretando la espalda media.',
    proTip: 'No subas el torso al tirar del peso.',
    demoImages: [
      `${IMG_BASE}/Bent_Over_Barbell_Row/0.jpg`,
      `${IMG_BASE}/Bent_Over_Barbell_Row/1.jpg`,
    ],
    stepByStep: [
      'Pies al ancho de caderas, rodillas semiflexionadas y lleva la cadera hacia atrás inclinando el torso a 45°.',
      'Con la espalda completamente recta, deja colgar la barra o mancuernas bajo los hombros.',
      'Tracciona el peso hacia el abdomen bajo/ombligo juntando las escápulas arriba.',
    ],
    commonMistakes: [
      'Redondear la espalda baja (pérdida de neutralidad lumbar).',
      'Tirar hacia el cuello encogiendo los trapecios en lugar de llevar los codos atrás.',
    ],
    youtubeVideoId: 'FWJR5Ve8bnQ',
    youtubeChannel: 'Max Euceda',
    youtubeTitle: 'How to do the Bent-Over Barbell Row (2 Min Tutorial)',
  },
  {
    id: 'back-australian-pullup',
    name: 'Remo Invertido (Australian Pull-Ups)',
    muscleGroup: 'back',
    secondaryMuscles: ['Espalda Media', 'Deltoides Posterior', 'Bíceps'],
    equipment: ['calisthenics', 'home', 'gym'],
    equipmentLabel: 'Barra Baja / Mesa Firme / Anillas',
    defaultSets: 4,
    defaultReps: '12-15',
    restSeconds: 60,
    caloriesPerSet: 12,
    instructions:
      'Con el cuerpo recto colgado debajo de una barra baja o soporte, tracciona el pecho hacia la barra.',
    proTip: 'Cuanto más horizontales estén tus pies, mayor será la intensidad.',
    demoImages: [
      `${IMG_BASE}/Inverted_Row/0.jpg`,
      `${IMG_BASE}/Inverted_Row/1.jpg`,
    ],
    stepByStep: [
      'Ubícate debajo de una barra a la altura de la cintura y tómala con un agarre algo más ancho que los hombros.',
      'Apoya los talones y tensa glúteos y abdomen para que el cuerpo forme una línea recta.',
      'Tracciona hasta que tu pecho toque la barra y baja controlando 2 segundos.',
    ],
    commonMistakes: [
      'Dejar caer la cadera y subir únicamente el cuello hacia la barra.',
      'Soltar la tensión de golpe en la bajada.',
    ],
    youtubeVideoId: 'hXTc1mDnZCw',
    youtubeChannel: 'BarBend',
    youtubeTitle: 'Inverted Row Guide | Form Tips & Mistakes',
  },
  {
    id: 'back-single-arm-row',
    name: 'Remo Unilateral (Serrucho)',
    muscleGroup: 'back',
    secondaryMuscles: ['Dorsal', 'Bíceps'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Mancuerna o Banda',
    defaultSets: 3,
    defaultReps: '10-12 por lado',
    restSeconds: 60,
    caloriesPerSet: 13,
    instructions:
      'Apoya una mano y tracciona la mancuerna en arco hacia tu cadera permitiendo un buen estiramiento abajo.',
    proTip: 'Lleva la mancuerna hacia la cadera, no hacia el hombro.',
    demoImages: [
      `${IMG_BASE}/One-Arm_Dumbbell_Row/0.jpg`,
      `${IMG_BASE}/One-Arm_Dumbbell_Row/1.jpg`,
    ],
    stepByStep: [
      'Apoya una mano en un banco o silla manteniendo el torso casi paralelo al suelo y la columna neutra.',
      'Deja bajar la mancuerna estirando el dorsal sin rotar excesivamente el tronco.',
      'Lleva la mancuerna en curva hacia tu bolsillo de la cadera rozando las costillas con el codo.',
    ],
    commonMistakes: [
      'Subir la mancuerna en línea recta hacia el hombro (carga el bíceps y trapecio superior).',
      'Girar todo el torso como si arrancaras una motosierra con exceso de peso.',
    ],
    youtubeVideoId: 'pYcpY20QaE8',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Dumbbell Bent-Over Row (Single-Arm)',
  },

  // ================= PIERNAS Y GLÚTEOS (LEGS) =================
  {
    id: 'legs-barbell-squat',
    name: 'Sentadilla Libre (Back Squat)',
    muscleGroup: 'legs',
    secondaryMuscles: ['Cuádriceps', 'Glúteos', 'Core'],
    equipment: ['gym'],
    equipmentLabel: 'Barra Olímpica / Rack',
    defaultSets: 4,
    defaultReps: '6-10',
    restSeconds: 120,
    caloriesPerSet: 20,
    instructions:
      'Toma aire en el abdomen (bracing), baja rompiendo el paralelo con rodillas alineadas a las puntas de los pies.',
    proTip: 'Empuja con todo el trípode del pie, sin levantar los talones.',
    demoImages: [
      `${IMG_BASE}/Barbell_Full_Squat/0.jpg`,
      `${IMG_BASE}/Barbell_Full_Squat/1.jpg`,
    ],
    stepByStep: [
      'Apoya la barra sobre los trapecios (no sobre el cuello), pies al ancho de hombros con puntas a 15°-30°.',
      'Inhala profundo inflando el abdomen a 360° (maniobra de bracing) y flexiona caderas y rodillas al mismo tiempo.',
      'Desciende hasta que la cadera baje al nivel de las rodillas y empuja el piso con fuerza manteniendo el pecho erguido.',
    ],
    commonMistakes: [
      'Valgo de rodilla (que las rodillas colapsen hacia adentro al subir).',
      'Despegar los talones del suelo por falta de movilidad de tobillo.',
    ],
    youtubeVideoId: 'ZzU6NRFfUng',
    youtubeChannel: 'Powerexplosive',
    youtubeTitle: 'Los 6 Errores al Hacer Sentadillas y Cómo Corregirlos',
  },
  {
    id: 'legs-goblet-squat',
    name: 'Sentadilla Goblet Profunda',
    muscleGroup: 'legs',
    secondaryMuscles: ['Cuádriceps', 'Glúteo Mayor', 'Core'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Mancuerna o Pesa Rusa',
    defaultSets: 4,
    defaultReps: '10-12',
    restSeconds: 90,
    caloriesPerSet: 18,
    instructions:
      'Sostén la mancuerna pegada al esternón como una copa y baja profundo manteniendo el torso vertical.',
    proTip: 'El contrapeso frontal te permite lograr una profundidad perfecta cuidando la espalda.',
    demoImages: [
      `${IMG_BASE}/Goblet_Squat/0.jpg`,
      `${IMG_BASE}/Goblet_Squat/1.jpg`,
    ],
    stepByStep: [
      'Sujeta una mancuerna verticalmente por su extremo superior pegada al pecho con los codos apuntando hacia abajo.',
      'Baja profundamente llevando las rodillas en la dirección de la punta de los pies.',
      'Haz una pausa de 1 segundo abajo sin perder tensión y sube empujando con talón y mediopié.',
    ],
    commonMistakes: [
      'Alejar la mancuerna del pecho fatigando los brazos y la espalda alta.',
      'Inclinarse hacia adelante perdiendo la verticalidad del torso.',
    ],
    youtubeVideoId: 'MeIiIdhvXT4',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Goblet Squat',
  },
  {
    id: 'legs-rdl',
    name: 'Peso Muerto Rumano (Isquiotibiales)',
    muscleGroup: 'legs',
    secondaryMuscles: ['Isquiosurales', 'Glúteos', 'Erectores Espinales'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Barra o Mancuernas',
    defaultSets: 4,
    defaultReps: '8-12',
    restSeconds: 90,
    caloriesPerSet: 17,
    instructions:
      'Lleva la cadera hacia atrás manteniendo las tibias casi verticales y las pesas pegadas a los muslos.',
    proTip: 'Detén el descenso apenas tu cadera deje de ir hacia atrás.',
    demoImages: [
      `${IMG_BASE}/Romanian_Deadlift/0.jpg`,
      `${IMG_BASE}/Romanian_Deadlift/1.jpg`,
    ],
    stepByStep: [
      'De pie con pies al ancho de cadera, destraba apenas las rodillas (15° de flexión fija).',
      'Empuja los glúteos hacia la pared de atrás mientras deslizas la barra o mancuernas rozando tus muslos y tibias.',
      'Cuando sientas el máximo estiramiento en los isquiotibiales (mitad de la tibia), extiende la cadera apretando glúteos.',
    ],
    commonMistakes: [
      'Bajar hasta el piso doblando la zona lumbar una vez que la cadera ya no va más atrás.',
      'Alejar la barra o mancuernas de las piernas.',
    ],
    youtubeVideoId: 'JCXUYuzwNrM',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Romanian Deadlift (RDL)',
  },
  {
    id: 'legs-jump-squats',
    name: 'Sentadillas con Salto Pliométrico',
    muscleGroup: 'legs',
    secondaryMuscles: ['Potencia para Fútbol/Running', 'Glúteos', 'Gemelos'],
    equipment: ['calisthenics', 'home'],
    equipmentLabel: 'Peso Corporal',
    defaultSets: 4,
    defaultReps: '15 reps',
    restSeconds: 60,
    caloriesPerSet: 18,
    instructions:
      'Baja en sentadilla controlada y despega explosivamente amortiguando suave con la punta-planta.',
    proTip: 'Excelente transferencia directa para velocidad de arranque en fútbol y running.',
    demoImages: [
      `${IMG_BASE}/Freehand_Jump_Squat/0.jpg`,
      `${IMG_BASE}/Freehand_Jump_Squat/1.jpg`,
    ],
    stepByStep: [
      'Comienza con los pies al ancho de los hombros y baja a media sentadilla cargando los brazos hacia atrás.',
      'Extiende cadera, rodillas y tobillos simultáneamente saltando lo más alto posible.',
      'Aterriza de forma silenciosa apoyando primero el metatarso y absorbiendo el impacto en la siguiente sentadilla.',
    ],
    commonMistakes: [
      'Caer con las rodillas rígidas o haciendo ruido fuerte contra el suelo.',
      'Juntar las rodillas en el momento del despegue o aterrizaje.',
    ],
    youtubeVideoId: 'A-cFYWvaHr0',
    youtubeChannel: 'Well+Good',
    youtubeTitle: 'How To Do A Squat Jump | The Right Way',
  },
  {
    id: 'legs-nordic-hamstring',
    name: 'Puente de Glúteo e Isquios (Hip Thrust / Glute Bridge)',
    muscleGroup: 'legs',
    secondaryMuscles: ['Isquiotibiales', 'Prevención de Lesiones'],
    equipment: ['calisthenics', 'home', 'gym'],
    equipmentLabel: 'Peso Corporal o Barra',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 60,
    caloriesPerSet: 13,
    instructions:
      'Eleva la cadera empujando desde los talones y aprieta glúteo e isquios arriba durante 2 segundos.',
    proTip: 'Clave para proteger isquiotibiales y potenciar el sprint si juegas fútbol o corres.',
    demoImages: [
      `${IMG_BASE}/Barbell_Glute_Bridge/0.jpg`,
      `${IMG_BASE}/Barbell_Glute_Bridge/1.jpg`,
    ],
    stepByStep: [
      'Acuéstate boca arriba con las rodillas flexionadas a 90° y los talones apoyados firmes en el suelo.',
      'Empuja con los talones elevando la pelvis hasta formar una línea recta entre rodillas, caderas y hombros.',
      'Contrae fuerte los glúteos durante 2 segundos arriba con el mentón levemente recogido y baja controlado.',
    ],
    commonMistakes: [
      'Hiperextender la espalda baja en lugar de extender la cadera con los glúteos.',
      'Empujar con la punta de los pies en vez de los talones.',
    ],
    youtubeVideoId: 'OUgsJ8-Vi0E',
    youtubeChannel: 'Airrosti Rehab',
    youtubeTitle: 'How to Perform the Perfect Glute Bridge',
  },

  // ================= HOMBROS Y BRAZOS (SHOULDERS & ARMS) =================
  {
    id: 'arms-overhead-press',
    name: 'Press Militar de Hombros',
    muscleGroup: 'shoulders_arms',
    secondaryMuscles: ['Deltoides', 'Tríceps', 'Core'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Barra o Mancuernas',
    defaultSets: 4,
    defaultReps: '8-10',
    restSeconds: 90,
    caloriesPerSet: 13,
    instructions:
      'De pie o sentado, empuja el peso verticalmente sobre la cabeza apretando glúteos y abdomen.',
    proTip: 'Evita hiperextender la zona lumbar al empujar.',
    demoImages: [
      `${IMG_BASE}/Standing_Military_Press/0.jpg`,
      `${IMG_BASE}/Standing_Military_Press/1.jpg`,
    ],
    stepByStep: [
      'Sujeta la barra o mancuernas a la altura de la clavícula con los antebrazos completamente verticales.',
      'Aprieta glúteos y abdomen para estabilizar el tronco y empuja el peso recto hacia el techo.',
      'Al pasar la frente, mete levemente la cabeza debajo de la barra para terminar alineado con las orejas.',
    ],
    commonMistakes: [
      'Arquear excesivamente la espalda baja para compensar la falta de fuerza.',
      'Dejar los codos detrás de las muñecas en la posición inicial.',
    ],
    youtubeVideoId: '2yjwXTZQDDI',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Standing Military / Overhead Press',
  },
  {
    id: 'arms-pike-pushups',
    name: 'Pike / Handstand Push-Ups (Flexiones Verticales)',
    muscleGroup: 'shoulders_arms',
    secondaryMuscles: ['Deltoides Anterior', 'Tríceps'],
    equipment: ['calisthenics', 'home'],
    equipmentLabel: 'Peso Corporal',
    defaultSets: 4,
    defaultReps: '8-12',
    restSeconds: 75,
    caloriesPerSet: 12,
    instructions:
      'En posición de V invertida (o contra pared), baja la coronilla hacia el suelo formando un triángulo con las manos.',
    proTip: 'Lleva la cabeza levemente hacia adelante de la línea de las manos para formar un trípode estable.',
    demoImages: [
      `${IMG_BASE}/Handstand_Push-Ups/0.jpg`,
      `${IMG_BASE}/Handstand_Push-Ups/1.jpg`,
    ],
    stepByStep: [
      'Eleva la cadera formando una "V" invertida (o apoya los pies en un cajón/pared según tu nivel).',
      'Flexiona los codos hacia adentro llevando la parte superior de la cabeza hacia adelante de tus manos.',
      'Empuja el piso con fuerza extendiendo los brazos hasta que las orejas queden entre los hombros.',
    ],
    commonMistakes: [
      'Bajar la cabeza justo entre las manos abriendo los codos a 90°.',
      'Perder la tensión abdominal curvando la espalda.',
    ],
    youtubeVideoId: 'fXgou2W10ok',
    youtubeChannel: 'The Bodyweight Process',
    youtubeTitle: 'How to Pike Push Up | Progressions & Form',
  },
  {
    id: 'arms-lateral-raises',
    name: 'Vuelos Laterales para Deltoides Medio',
    muscleGroup: 'shoulders_arms',
    secondaryMuscles: ['Hombro Lateral'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Mancuernas o Bandas',
    defaultSets: 4,
    defaultReps: '12-15',
    restSeconds: 60,
    caloriesPerSet: 9,
    instructions:
      'Eleva los brazos en el plano escapular (30° hacia adelante) hasta la altura de los hombros.',
    proTip: 'Piensa en lanzar las mancuernas lejos hacia los lados, no hacia el techo.',
    demoImages: [
      `${IMG_BASE}/Seated_Side_Lateral_Raise/0.jpg`,
      `${IMG_BASE}/Seated_Side_Lateral_Raise/1.jpg`,
    ],
    stepByStep: [
      'De pie o sentado, inclina el torso apenas 10° hacia adelante con codos semiflexionados.',
      'Eleva los brazos hacia los costados y 30° hacia adelante (plano escapular) hasta la línea del hombro.',
      'Baja en 2 segundos resistiendo la gravedad sin dejar caer las pesas.',
    ],
    commonMistakes: [
      'Usar impulso de cadera con mancuernas demasiado pesadas.',
      'Encoger los trapecios hacia las orejas al subir.',
    ],
    youtubeVideoId: '3VcKaXpzqRo',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Dumbbell Side Lateral Raise',
  },
  {
    id: 'arms-superset-bi-tri',
    name: 'Curl de Bíceps Alternado + Extensión de Tríceps',
    muscleGroup: 'shoulders_arms',
    secondaryMuscles: ['Bíceps Braquial', 'Tríceps Cabeza Larga'],
    equipment: ['gym', 'home'],
    equipmentLabel: 'Mancuernas / Polea / Bandas',
    defaultSets: 3,
    defaultReps: '12 + 12',
    restSeconds: 60,
    caloriesPerSet: 12,
    instructions:
      'Realiza 12 curls de bíceps con supinación sin mover los codos e inmediatamente 12 extensiones de tríceps.',
    proTip: 'Las superseries antagónicas ahorran la mitad del tiempo y duplican el bombeo.',
    demoImages: [
      `${IMG_BASE}/Dumbbell_Bicep_Curl/0.jpg`,
      `${IMG_BASE}/Dumbbell_Bicep_Curl/1.jpg`,
    ],
    stepByStep: [
      'Pega los codos a las costillas con las palmas mirando al frente (supinación completa).',
      'Flexiona el codo subiendo la mancuerna sin adelantar el hombro y aprieta el bíceps 1 segundo arriba.',
      'Baja extendiendo el brazo completo antes de pasar al ejercicio de tríceps.',
    ],
    commonMistakes: [
      'Balancear la espalda para levantar el peso.',
      'Subir los codos hacia adelante quitándole tensión al bíceps.',
    ],
    youtubeVideoId: 'ykJmrZ5v0Oo',
    youtubeChannel: 'Howcast Fitness',
    youtubeTitle: 'How to Do a Dumbbell Biceps Curl Properly',
  },
  {
    id: 'arms-diamond-pushups',
    name: 'Flexiones Cerradas / Diamante (Énfasis Tríceps)',
    muscleGroup: 'shoulders_arms',
    secondaryMuscles: ['Tríceps', 'Pectoral Interno'],
    equipment: ['calisthenics', 'home'],
    equipmentLabel: 'Peso Corporal',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 60,
    caloriesPerSet: 13,
    instructions:
      'Coloca las manos cerradas bajo el esternón y baja manteniendo los codos pegados a las costillas.',
    proTip: 'Mantén los codos rozando el torso durante todo el movimiento para aislar los tríceps.',
    demoImages: [
      `${IMG_BASE}/Push-Ups_-_Close_Triceps_Position/0.jpg`,
      `${IMG_BASE}/Push-Ups_-_Close_Triceps_Position/1.jpg`,
    ],
    stepByStep: [
      'Apoya las manos más juntas que el ancho de los hombros a la altura de la parte baja del pecho.',
      'Desciende manteniendo los codos pegados al cuerpo apuntando hacia los pies.',
      'Empuja extendiendo por completo los codos arriba para contraer al máximo los tríceps.',
    ],
    commonMistakes: [
      'Abrir los codos hacia afuera por fatiga.',
      'Colocar las manos a la altura de la cara en lugar del esternón.',
    ],
    youtubeVideoId: 'J0DnG1_S92I',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Diamond Push-Up for Triceps',
  },

  // ================= CORE Y ABDOMEN (CORE) =================
  {
    id: 'core-hanging-leg-raise',
    name: 'Elevación de Piernas Colgado',
    muscleGroup: 'core',
    secondaryMuscles: ['Recto Abdominal Inferior', 'Flexores'],
    equipment: ['gym', 'home', 'calisthenics'],
    equipmentLabel: 'Barra o Suelo',
    defaultSets: 3,
    defaultReps: '12-15',
    restSeconds: 45,
    caloriesPerSet: 10,
    instructions:
      'Enrolla la pelvis hacia el pecho al subir las piernas evitando el balanceo.',
    proTip: 'La clave para trabajar el abdomen (y no solo el psoas) es que la pelvis suba enrollándose.',
    demoImages: [
      `${IMG_BASE}/Hanging_Leg_Raise/0.jpg`,
      `${IMG_BASE}/Hanging_Leg_Raise/1.jpg`,
    ],
    stepByStep: [
      'Cuélgate de la barra con los hombros activos y el cuerpo completamente quieto.',
      'Eleva las piernas juntas enrollando la cadera hacia tus costillas (retroversión pélvica).',
      'Baja de forma lenta en 2 segundos para no generar columpio.',
    ],
    commonMistakes: [
      'Subir solo hasta 90° con la espalda arqueada (trabaja solo los flexores de cadera).',
      'Balancearse usando inercia entre repeticiones.',
    ],
    youtubeVideoId: 'hdng3Nm1x_E',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Hanging Leg-Lift (Abs)',
  },
  {
    id: 'core-plank-dynamic',
    name: 'Plancha Isométrica RKC (Alta Tensión)',
    muscleGroup: 'core',
    secondaryMuscles: ['Transverso Abdominal', 'Oblicuos', 'Glúteos'],
    equipment: ['gym', 'home', 'calisthenics'],
    equipmentLabel: 'Peso Corporal',
    defaultSets: 3,
    defaultReps: '45 seg',
    restSeconds: 45,
    caloriesPerSet: 11,
    instructions:
      'Contrae abdomen, cuádriceps y glúteos al 100% manteniendo una línea recta perfecta.',
    proTip: 'Tracciona los codos imaginariamente hacia las puntas de los pies para duplicar la activación.',
    demoImages: [`${IMG_BASE}/Plank/0.jpg`, `${IMG_BASE}/Plank/1.jpg`],
    stepByStep: [
      'Apoya los antebrazos en el suelo con los codos exactamente debajo de los hombros.',
      'Mete la cola hacia adentro (retroversión pélvica) apretando fuerte los glúteos y el abdomen.',
      'Tracciona el suelo con los codos hacia tus pies mientras respiras corto manteniendo la tensión.',
    ],
    commonMistakes: [
      'Dejar que la zona lumbar se hunda hacia el suelo.',
      'Aguantar minutos sin tensión muscular real en lugar de hacer series intensas de 45s.',
    ],
    youtubeVideoId: 'pSHjTRCQxIw',
    youtubeChannel: 'ScottHermanFitness',
    youtubeTitle: 'How To: Plank Properly',
  },
  {
    id: 'core-ab-wheel-pallof',
    name: 'Rueda Abdominal (Ab Roller)',
    muscleGroup: 'core',
    secondaryMuscles: ['Recto Abdominal', 'Dorsales', 'Anti-extensión'],
    equipment: ['gym', 'home', 'calisthenics'],
    equipmentLabel: 'Rueda Abdominal / Deslizadores',
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 45,
    caloriesPerSet: 10,
    instructions:
      'Mantén la retroversión pélvica durante todo el recorrido y extiende en bloque sin quebrar la cintura.',
    proTip: 'Nunca dejes que tu espalda baja se arquee al extenderte.',
    demoImages: [`${IMG_BASE}/Ab_Roller/0.jpg`, `${IMG_BASE}/Ab_Roller/1.jpg`],
    stepByStep: [
      'De rodillas en el suelo, sujeta la rueda con brazos extendidos y redondea levemente la espalda alta ("gato enojado").',
      'Rueda hacia adelante llevando la cadera y las manos juntas hasta donde puedas mantener el abdomen firme.',
      'Vuelve tirando desde el abdomen y los dorsales sin sentarte sobre los talones.',
    ],
    commonMistakes: [
      'Arquear la columna lumbar al llegar al punto más lejano.',
      'Iniciar el regreso empujando la cadera hacia los talones en vez de contraer el abdomen.',
    ],
    youtubeVideoId: 'rqiTPdK1c_I',
    youtubeChannel: 'Mind Pump TV',
    youtubeTitle: 'How to PROPERLY Use an Ab Wheel',
  },
];

export const MUSCLE_GROUP_LABELS: Record<
  MuscleGroup,
  { label: string; icon: string; subtitle: string }
> = {
  chest: {
    label: 'Pecho',
    icon: 'fitness-outline',
    subtitle: 'Fuerza de empuje e hipertrofia pectoral',
  },
  back: {
    label: 'Espalda',
    icon: 'body-outline',
    subtitle: 'Amplitud dorsal, postura y tracción',
  },
  legs: {
    label: 'Piernas y Glúteos',
    icon: 'walk-outline',
    subtitle: 'Potencia de tren inferior y estabilidad',
  },
  shoulders_arms: {
    label: 'Hombros y Brazos',
    icon: 'barbell-outline',
    subtitle: 'Deltoides 3D, bíceps y tríceps',
  },
  core: {
    label: 'Core y Abdomen',
    icon: 'shield-checkmark-outline',
    subtitle: 'Centro fuerte para deportes y estética',
  },
  push: {
    label: 'Empuje (Pecho/Hombro/Tríceps)',
    icon: 'flash-outline',
    subtitle: 'Split clásico Push completo',
  },
  pull: {
    label: 'Tracción (Espalda/Bíceps)',
    icon: 'magnet-outline',
    subtitle: 'Split clásico Pull completo',
  },
  full_body: {
    label: 'Full Body Total',
    icon: 'flame-outline',
    subtitle: 'Cuerpo completo de alto gasto calórico',
  },
};

export function generateSmartRoutine(params: {
  timeMinutes: AvailableTime;
  muscleGroup: MuscleGroup;
  equipment: EquipmentMode;
  weightKg: number;
}): {
  title: string;
  estimatedCalories: number;
  exercises: Array<ExerciseCatalogItem & { recommendedSets: number }>;
  coachingNote: string;
} {
  const { timeMinutes, muscleGroup, equipment, weightKg } = params;

  let targetMuscles: Array<'chest' | 'back' | 'legs' | 'shoulders_arms' | 'core'> = [];
  if (muscleGroup === 'push') {
    targetMuscles = ['chest', 'shoulders_arms', 'core'];
  } else if (muscleGroup === 'pull') {
    targetMuscles = ['back', 'shoulders_arms', 'core'];
  } else if (muscleGroup === 'full_body') {
    targetMuscles = ['legs', 'chest', 'back', 'shoulders_arms', 'core'];
  } else {
    targetMuscles = [muscleGroup, 'core'];
  }

  const matching = EXERCISE_CATALOG.filter(
    (ex) => ex.equipment.includes(equipment) && targetMuscles.includes(ex.muscleGroup)
  );

  const sorted = matching.sort((a, b) => {
    if (muscleGroup !== 'core') {
      if (a.muscleGroup === 'core' && b.muscleGroup !== 'core') return 1;
      if (a.muscleGroup !== 'core' && b.muscleGroup === 'core') return -1;
    }
    return 0;
  });

  const configByTime: Record<
    AvailableTime,
    { maxExercises: number; setsPerEx: number; note: string }
  > = {
    15: {
      maxExercises: 3,
      setsPerEx: 3,
      note: 'Formato Express (15 min): Descansos cortos de 45s o en circuito para máxima densidad en poco tiempo.',
    },
    30: {
      maxExercises: 4,
      setsPerEx: 3,
      note: 'Sesión Eficiente (30 min): Enfoque en ejercicios multiarticulares con descansos de 60-75s.',
    },
    45: {
      maxExercises: 5,
      setsPerEx: 4,
      note: 'Entrenamiento Completo (45 min): Volumen ideal de hipertrofia y fuerza con estímulo de Core al cierre.',
    },
    60: {
      maxExercises: 6,
      setsPerEx: 4,
      note: 'Sesión Pro (60 min): Alto volumen total. Tómate 90s en los básicos pesados para máxima sobrecarga progresiva.',
    },
  };

  const cfg = configByTime[timeMinutes];
  const selected = sorted.slice(0, cfg.maxExercises).map((ex) => ({
    ...ex,
    recommendedSets: cfg.setsPerEx,
  }));

  const weightFactor = weightKg / 75;
  const totalCalories = Math.round(
    selected.reduce(
      (sum, ex) => sum + ex.caloriesPerSet * ex.recommendedSets * weightFactor,
      0
    )
  );

  const eqLabel =
    equipment === 'gym' ? 'Gimnasio' : equipment === 'home' ? 'En Casa' : 'Calistenia';

  return {
    title: `Rutina ${MUSCLE_GROUP_LABELS[muscleGroup].label} (${timeMinutes}m • ${eqLabel})`,
    estimatedCalories: totalCalories,
    exercises: selected,
    coachingNote: cfg.note,
  };
}
