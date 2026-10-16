# ⚡ ArgonFit — Fitness, Nutrición IA y Gasto Energético (Pixel 9 Pro + Amazfit Active 2)

Aplicación móvil desarrollada con **React Native (Expo) + TypeScript** diseñada para un seguimiento integral, rápido y preciso de calorías consumidas, gasto energético total diario (**TDEE**), recomendaciones inteligentes de entrenamiento por tiempo disponible y sincronización con **Amazfit Active 2** mediante **Android Health Connect**.

---

## 🚀 Características Principales

### 1. 📊 Balance Energético en Tiempo Real (Dashboard OLED)
- **Cálculo de TMB (Mifflin-St Jeor):** Ajustado por peso, altura, edad, sexo y objetivo (`Déficit Calórico`, `Mantenimiento` o `Volumen Muscular`).
- **Gasto Energético Total Diario (TDEE Dinámico):** Suma en tiempo real tu metabolismo basal + gasto por pasos (**NEAT**) + entrenamientos y deportes del día.
- **Control de Macronutrientes e Hidratación:** Barras de progreso para Proteínas, Carbohidratos, Grasas y registro rápido de agua (`+250 ml`).

### 2. 🥗 Nutrición IA + Escáner OpenFoodFacts
- **Registro por Texto Natural o Foto con IA:** Escribe frases como *"2 empanadas de carne y una manzana"* o *"200g de pollo con arroz y 2 huevos"* (funciona 100% offline con motor NLP nutricional local y soporta **Gemini 2.5 Flash API** para análisis multimodal de fotos de platos).
- **Escáner de Código de Barras (`expo-camera`):** Conectado en vivo a la API mundial de **OpenFoodFacts** para escanear productos empaquetados (EAN-13 / UPC).
- **Comidas Frecuentes de 1 Toque:** Botonera rápida con alimentos cotidianos.

### 3. 🏋️ Recomendador de Rutinas, Fotos Reales (Sin IA) y Videos de YouTube
- **Filtros Dinámicos antes de Entrenar:**
  - ⏱️ **Tiempo disponible:** `15 min (Express)`, `30 min`, `45 min`, `60+ min`.
  - 🏠 **Equipamiento (3 Modos):** `Gimnasio Completo`, `Entrenamiento en Casa` y `Peso Corporal / Calistenia`.
  - 💪 **Grupo Muscular / Split:** `Pecho`, `Espalda`, `Piernas y Glúteos`, `Hombros y Brazos`, `Core`, `Push (Empuje)`, `Pull (Tracción)` y `Full Body`.
- **Demostración Fotográfica Real (0% IA):** Fotografías reales de inicio y contracción (`free-exercise-db`) con modo de animación de movimiento, técnica paso a paso y errores comunes a evitar.
- **Videos Demostrativos y Canales de YouTube:** Enlace directo al tutorial de cada ejercicio y pestaña de **Rutinas Guiadas en Video ("Hazlo Conmigo")** de canales referentes (**Powerexplosive**, **ATHLEAN-X Español**, **BUFF Academy**, **Entrena con Sergio Peinado** y **Jeff Nippard**).
- **Deportes Clásicos Integrados:** Cálculos precisos por **METs + Frecuencia Cardíaca** para **Fútbol (5, 7, 8, 11)**, **Correr**, **Natación (piletas de 25m/50m)** y **Caminar**.

### 4. ⌚ Sincronización con Amazfit Active 2 (Zepp ↔ Android Health Connect)
- Integración con **Android Health Connect** en tu **Google Pixel 9 Pro** para importar pasos diarios, frecuencia cardíaca y sesiones deportivas registradas por el reloj **Amazfit Active 2** (a través de la app **Zepp**) con deduplicación automática.

### 5. 📈 Recuento Semanal (7 días) y Mensual (30 días)
- Promedio calórico consumido vs. quemado, balance neto acumulado y **proyección matemática de cambio de peso en kg** (`Balance Neto ÷ 7700 kcal`).

---

## 🛠️ Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo Expo
npx expo start
```

Escanea el código QR con **Expo Go** en tu **Pixel 9 Pro** o presiona `a` para abrir en Android.
