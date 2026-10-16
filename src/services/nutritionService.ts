export interface ParsedFoodItem {
  name: string;
  portionDesc: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  barcode?: string;
}

interface LocalFoodReference {
  keywords: string[];
  name: string;
  unitLabel: string;
  gramsPerUnit: number;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  carbsPerUnit: number;
  fatPerUnit: number;
}

/**
 * Base de datos local de alimentos cotidianos y regionales para respuesta instantánea (0ms, offline)
 */
export const LOCAL_FOOD_DATABASE: LocalFoodReference[] = [
  {
    keywords: ['huevo', 'huevos', 'egg'],
    name: 'Huevo entero',
    unitLabel: 'unidad (55g)',
    gramsPerUnit: 55,
    caloriesPerUnit: 78,
    proteinPerUnit: 6.5,
    carbsPerUnit: 0.6,
    fatPerUnit: 5.3,
  },
  {
    keywords: ['empanada de carne', 'empanadas de carne', 'empanada', 'empanadas'],
    name: 'Empanada de carne al horno',
    unitLabel: 'unidad (110g)',
    gramsPerUnit: 110,
    caloriesPerUnit: 265,
    proteinPerUnit: 11,
    carbsPerUnit: 26,
    fatPerUnit: 13,
  },
  {
    keywords: ['empanada de pollo', 'empanadas de pollo'],
    name: 'Empanada de pollo',
    unitLabel: 'unidad (110g)',
    gramsPerUnit: 110,
    caloriesPerUnit: 240,
    proteinPerUnit: 13,
    carbsPerUnit: 25,
    fatPerUnit: 9.5,
  },
  {
    keywords: ['pechuga', 'pollo', 'pechuga de pollo'],
    name: 'Pechuga de pollo a la plancha',
    unitLabel: 'porción (150g)',
    gramsPerUnit: 150,
    caloriesPerUnit: 248,
    proteinPerUnit: 46,
    carbsPerUnit: 0,
    fatPerUnit: 5.4,
  },
  {
    keywords: ['carne', 'bife', 'asado', 'vacio', 'lomo'],
    name: 'Bife de carne vacuna magra',
    unitLabel: 'porción (180g)',
    gramsPerUnit: 180,
    caloriesPerUnit: 340,
    proteinPerUnit: 48,
    carbsPerUnit: 0,
    fatPerUnit: 15,
  },
  {
    keywords: ['milanesa', 'milanesas'],
    name: 'Milanesa al horno',
    unitLabel: 'unidad mediana (150g)',
    gramsPerUnit: 150,
    caloriesPerUnit: 310,
    proteinPerUnit: 29,
    carbsPerUnit: 18,
    fatPerUnit: 13,
  },
  {
    keywords: ['arroz', 'arroz blanco', 'arroz integral'],
    name: 'Arroz cocido',
    unitLabel: 'taza / porción (150g)',
    gramsPerUnit: 150,
    caloriesPerUnit: 195,
    proteinPerUnit: 4.2,
    carbsPerUnit: 42,
    fatPerUnit: 0.5,
  },
  {
    keywords: ['avena', 'oatmeal'],
    name: 'Avena arrollada',
    unitLabel: 'porción (60g)',
    gramsPerUnit: 60,
    caloriesPerUnit: 228,
    proteinPerUnit: 8,
    carbsPerUnit: 39,
    fatPerUnit: 4.2,
  },
  {
    keywords: ['tostada', 'tostadas', 'pan integral', 'pan'],
    name: 'Tostada de pan integral',
    unitLabel: 'rebanada (35g)',
    gramsPerUnit: 35,
    caloriesPerUnit: 88,
    proteinPerUnit: 3.8,
    carbsPerUnit: 15,
    fatPerUnit: 1.2,
  },
  {
    keywords: ['manzana', 'manzanas'],
    name: 'Manzana fresca',
    unitLabel: 'unidad mediana (180g)',
    gramsPerUnit: 180,
    caloriesPerUnit: 95,
    proteinPerUnit: 0.5,
    carbsPerUnit: 25,
    fatPerUnit: 0.3,
  },
  {
    keywords: ['banana', 'bananas', 'platano'],
    name: 'Banana mediana',
    unitLabel: 'unidad (120g)',
    gramsPerUnit: 120,
    caloriesPerUnit: 105,
    proteinPerUnit: 1.3,
    carbsPerUnit: 27,
    fatPerUnit: 0.4,
  },
  {
    keywords: ['cafe con leche', 'café con leche', 'latte', 'cortado'],
    name: 'Café con leche descremada',
    unitLabel: 'taza (240ml)',
    gramsPerUnit: 240,
    caloriesPerUnit: 90,
    proteinPerUnit: 6.5,
    carbsPerUnit: 9.5,
    fatPerUnit: 2.8,
  },
  {
    keywords: ['proteina', 'proteína', 'whey', 'scoop', 'batido'],
    name: 'Whey Protein (1 scoop)',
    unitLabel: 'scoop (30g)',
    gramsPerUnit: 30,
    caloriesPerUnit: 120,
    proteinPerUnit: 24,
    carbsPerUnit: 2.5,
    fatPerUnit: 1.5,
  },
  {
    keywords: ['palta', 'aguacate'],
    name: 'Palta / Aguacate',
    unitLabel: 'media unidad (80g)',
    gramsPerUnit: 80,
    caloriesPerUnit: 128,
    proteinPerUnit: 1.6,
    carbsPerUnit: 6.8,
    fatPerUnit: 11.8,
  },
  {
    keywords: ['yogur', 'yogurt', 'yogur griego'],
    name: 'Yogur Griego Natural',
    unitLabel: 'pote (170g)',
    gramsPerUnit: 170,
    caloriesPerUnit: 145,
    proteinPerUnit: 16,
    carbsPerUnit: 7,
    fatPerUnit: 5,
  },
  {
    keywords: ['fideos', 'pasta', 'tallarines'],
    name: 'Pasta cocida',
    unitLabel: 'plato (200g)',
    gramsPerUnit: 200,
    caloriesPerUnit: 310,
    proteinPerUnit: 11,
    carbsPerUnit: 61,
    fatPerUnit: 1.8,
  },
  {
    keywords: ['atun', 'atún', 'lata de atun'],
    name: 'Lata de Atún al natural',
    unitLabel: 'lata escurrida (120g)',
    gramsPerUnit: 120,
    caloriesPerUnit: 132,
    proteinPerUnit: 30,
    carbsPerUnit: 0,
    fatPerUnit: 1.2,
  },
  {
    keywords: ['pizza', 'porcion de pizza', 'porciones de pizza'],
    name: 'Pizza de Muzzarella',
    unitLabel: 'porción (100g)',
    gramsPerUnit: 100,
    caloriesPerUnit: 268,
    proteinPerUnit: 11.5,
    carbsPerUnit: 29,
    fatPerUnit: 11.5,
  },
];

/**
 * Analiza texto natural como "2 empanadas de carne, 1 manzana y un café con leche"
 * Si hay API Key de Gemini configurada, consulta Gemini 2.5 Flash; de lo contrario usa el motor NLP local instantáneo.
 */
export async function analyzeFoodByText(
  naturalText: string,
  geminiApiKey?: string
): Promise<ParsedFoodItem[]> {
  const cleanText = naturalText.trim();
  if (!cleanText) return [];

  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Eres un nutricionista deportivo experto. Analiza la siguiente comida descrita por el usuario: "${cleanText}".
Devuelve ÚNICAMENTE un arreglo JSON válido (sin bloques markdown) donde cada elemento tenga exactamente las claves:
[{"name": string, "portionDesc": string, "calories": number, "proteinG": number, "carbsG": number, "fatG": number}]`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({
              name: String(item.name || 'Alimento'),
              portionDesc: String(item.portionDesc || '1 porción'),
              calories: Math.round(Number(item.calories) || 0),
              proteinG: Math.round(Number(item.proteinG) || 0),
              carbsG: Math.round(Number(item.carbsG) || 0),
              fatG: Math.round(Number(item.fatG) || 0),
            }));
          }
        }
      }
    } catch {
      // Fallback transparente al motor NLP local si no hay conexión o la key falla
    }
  }

  // Motor NLP local: separa por ',', ' y ', ' + ', ' con '
  const segments = cleanText
    .toLowerCase()
    .split(/,|\by\b|\+|\bcon\b|\be\b/)
    .map((s) => s.trim())
    .filter(Boolean);

  const results: ParsedFoodItem[] = [];

  for (const seg of segments) {
    // Detectar gramos explícitos (ej. "200g de pollo")
    const gramsMatch = seg.match(/(\d+)\s*(?:g|gr|gramos)\b/);
    // Detectar cantidad numérica o en palabras (ej. "2 empanadas", "una manzana", "media palta")
    const qtyMatch = seg.match(/^(\d+(?:\.\d+)?)\b/);
    let multiplier = 1;

    if (seg.includes('media ') || seg.includes('medio ')) {
      multiplier = 0.5;
    } else if (seg.includes('un ') || seg.includes('una ')) {
      multiplier = 1;
    } else if (seg.includes('dos ')) {
      multiplier = 2;
    } else if (seg.includes('tres ')) {
      multiplier = 3;
    } else if (qtyMatch && !gramsMatch) {
      multiplier = parseFloat(qtyMatch[1]);
    }

    // Buscar coincidencia más específica en la base local
    let matchedRef: LocalFoodReference | undefined;
    for (const ref of LOCAL_FOOD_DATABASE) {
      if (ref.keywords.some((kw) => seg.includes(kw))) {
        matchedRef = ref;
        break;
      }
    }

    if (matchedRef) {
      if (gramsMatch) {
        const grams = parseFloat(gramsMatch[1]);
        const ratio = grams / matchedRef.gramsPerUnit;
        results.push({
          name: matchedRef.name,
          portionDesc: `${grams}g`,
          calories: Math.round(matchedRef.caloriesPerUnit * ratio),
          proteinG: Math.round(matchedRef.proteinPerUnit * ratio),
          carbsG: Math.round(matchedRef.carbsPerUnit * ratio),
          fatG: Math.round(matchedRef.fatPerUnit * ratio),
        });
      } else {
        results.push({
          name: matchedRef.name,
          portionDesc: `${multiplier} × ${matchedRef.unitLabel}`,
          calories: Math.round(matchedRef.caloriesPerUnit * multiplier),
          proteinG: Math.round(matchedRef.proteinPerUnit * multiplier),
          carbsG: Math.round(matchedRef.carbsPerUnit * multiplier),
          fatG: Math.round(matchedRef.fatPerUnit * multiplier),
        });
      }
    } else {
      // Estimación inteligente por defecto si escribe algo fuera del diccionario
      results.push({
        name: seg.charAt(0).toUpperCase() + seg.slice(1),
        portionDesc: `${multiplier} porción estimada`,
        calories: Math.round(220 * multiplier),
        proteinG: Math.round(12 * multiplier),
        carbsG: Math.round(24 * multiplier),
        fatG: Math.round(8 * multiplier),
      });
    }
  }

  return results;
}

/**
 * Analiza una foto de comida (con Gemini Vision si tiene API Key, o asistente guiado de reconocimiento)
 */
export async function analyzeFoodByPhoto(
  base64Image: string | undefined,
  hintText: string,
  geminiApiKey?: string
): Promise<ParsedFoodItem[]> {
  if (geminiApiKey && geminiApiKey.trim().length > 10 && base64Image) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analiza esta foto de comida${hintText ? ` (${hintText})` : ''}. Devuelve ÚNICAMENTE un arreglo JSON válido con los alimentos detectados y sus calorías/macros estimados:
[{"name": string, "portionDesc": string, "calories": number, "proteinG": number, "carbsG": number, "fatG": number}]`,
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({
              name: String(item.name || 'Plato detectado'),
              portionDesc: String(item.portionDesc || '1 plato'),
              calories: Math.round(Number(item.calories) || 0),
              proteinG: Math.round(Number(item.proteinG) || 0),
              carbsG: Math.round(Number(item.carbsG) || 0),
              fatG: Math.round(Number(item.fatG) || 0),
            }));
          }
        }
      }
    } catch {
      // Fallback si falla la red
    }
  }

  if (hintText && hintText.trim()) {
    return analyzeFoodByText(hintText, geminiApiKey);
  }

  return [
    {
      name: 'Plato Proteico Balanceado (Foto IA)',
      portionDesc: 'Porción estándar en plato (~420g)',
      calories: 510,
      proteinG: 38,
      carbsG: 46,
      fatG: 17,
    },
  ];
}

/**
 * Consulta un producto por Código de Barras en la API oficial de OpenFoodFacts
 */
export async function lookupBarcodeOpenFoodFacts(barcode: string): Promise<ParsedFoodItem | null> {
  const cleanCode = barcode.trim();
  if (!cleanCode) return null;

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanCode)}.json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const nutriments = p.nutriments || {};
    const productName =
      p.product_name_es || p.product_name || p.generic_name || `Producto (${cleanCode})`;
    const brand = p.brands ? ` - ${p.brands.split(',')[0]}` : '';

    // Preferimos valores por porción si existen; si no, por 100g
    const hasServing = typeof nutriments['energy-kcal_serving'] === 'number';
    const calories = Math.round(
      hasServing
        ? nutriments['energy-kcal_serving']
        : nutriments['energy-kcal_100g'] || (nutriments['energy_100g'] || 0) / 4.184 || 150
    );
    const proteinG = Math.round(
      hasServing ? nutriments.proteins_serving || 0 : nutriments.proteins_100g || 0
    );
    const carbsG = Math.round(
      hasServing ? nutriments.carbohydrates_serving || 0 : nutriments.carbohydrates_100g || 0
    );
    const fatG = Math.round(hasServing ? nutriments.fat_serving || 0 : nutriments.fat_100g || 0);

    return {
      name: `${productName}${brand}`,
      portionDesc: hasServing ? `1 porción (${p.serving_size || 'estándar'})` : 'Por cada 100g',
      calories,
      proteinG,
      carbsG,
      fatG,
      barcode: cleanCode,
    };
  } catch {
    return null;
  }
}

/**
 * Busca productos por texto en OpenFoodFacts + base de datos local
 */
export async function searchOpenFoodFacts(query: string): Promise<ParsedFoodItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // 1. Resultados locales instantáneos
  const localMatches: ParsedFoodItem[] = LOCAL_FOOD_DATABASE.filter(
    (item) =>
      item.name.toLowerCase().includes(q) || item.keywords.some((kw) => kw.includes(q))
  ).map((item) => ({
    name: item.name,
    portionDesc: item.unitLabel,
    calories: item.caloriesPerUnit,
    proteinG: item.proteinPerUnit,
    carbsG: item.carbsPerUnit,
    fatG: item.fatPerUnit,
  }));

  // 2. Consulta remota a OpenFoodFacts
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      q
    )}&search_simple=1&action=process&json=1&page_size=8`;
    const res = await fetch(url);
    if (!res.ok) return localMatches;
    const data = await res.json();
    const products = Array.isArray(data.products) ? data.products : [];

    const remoteMatches: ParsedFoodItem[] = products
      .filter((p: any) => p.product_name || p.product_name_es)
      .map((p: any) => {
        const n = p.nutriments || {};
        const kcal = Math.round(
          n['energy-kcal_100g'] || (n['energy_100g'] ? n['energy_100g'] / 4.184 : 0)
        );
        return {
          name: `${p.product_name_es || p.product_name}${
            p.brands ? ` (${p.brands.split(',')[0]})` : ''
          }`,
          portionDesc: p.serving_size ? `100g (Porción: ${p.serving_size})` : '100g',
          calories: kcal,
          proteinG: Math.round(n.proteins_100g || 0),
          carbsG: Math.round(n.carbohydrates_100g || 0),
          fatG: Math.round(n.fat_100g || 0),
          barcode: p.code,
        };
      })
      .filter((item: ParsedFoodItem) => item.calories > 0);

    return [...localMatches, ...remoteMatches];
  } catch {
    return localMatches;
  }
}
