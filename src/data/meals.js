export const MACROS_TRAIN = { kcal: 2700, carb: 290, prot: 175, fat: 82 };
export const MACROS_REST = { kcal: 2300, carb: 255, prot: 155, fat: 72 };

export const meals = [
  {
    id: 'pre',
    name: 'Pre-Entreno',
    icon: '⚡',
    timing: '30–45 min antes',
    kcal: 500,
    macros: { c: 70, p: 20, g: 16 },
    base: 'Agua 500 ml + Creatina 5 g',
    hideOnRest: false,
    options: [
      {
        label: 'A',
        items: [
          { name: 'Yogur light + avena + plátano', qty: '150g yogur · 80g avena · 1 plátano', type: 'carb' },
          { name: 'Agave + nueces', qty: '1 cdta agave · 25g nueces', type: 'fat' },
        ],
      },
      {
        label: 'B',
        items: [
          { name: 'Yogur light + avena + arándanos', qty: '150g yogur · 80g avena · 100g arándanos', type: 'carb' },
          { name: 'Agave + almendras', qty: '1 cdta agave · 25g almendras', type: 'fat' },
        ],
      },
      {
        label: 'C',
        items: [
          { name: 'Yogur light + avena + manzana', qty: '150g yogur · 80g avena · 1 manzana', type: 'carb' },
          { name: 'Nueces + canela', qty: '25g nueces · canela al gusto', type: 'fat' },
        ],
      },
    ],
  },
  {
    id: 'post',
    name: 'Post-Entreno',
    icon: '🔥',
    timing: 'Dentro de 1 h',
    kcal: 600,
    macros: { c: 45, p: 50, g: 20 },
    base: 'Whey Isolate 1 scoop (30 g)',
    hideOnRest: false,
    options: [
      {
        label: 'A',
        items: [
          { name: 'Huevos revueltos', qty: '4 huevos (2 enteros + 2 claras)', type: 'prot' },
          { name: 'Tostada integral con AOVE y tomate', qty: '2 rebanadas · 1 cda AOVE · tomate', type: 'carb' },
        ],
      },
      {
        label: 'B',
        items: [
          { name: 'Tostadas con aguacate', qty: '2 rebanadas pan integral · ½ aguacate', type: 'carb' },
          { name: 'Huevos escalfados + pavo', qty: '2 huevos · 50g pavo lonchas', type: 'prot' },
        ],
      },
      {
        label: 'C',
        items: [
          { name: 'Tortilla de claras con espinacas', qty: '4 claras + 1 entero · 50g espinacas', type: 'prot' },
          { name: 'Queso fresco + pan + fruta', qty: '30g queso · 2 rebanadas · 1 fruta', type: 'carb' },
        ],
      },
    ],
  },
  {
    id: 'comida',
    name: 'Comida',
    icon: '🥗',
    timing: 'Trabajo / tupper',
    kcal: 700,
    macros: { c: 70, p: 50, g: 18 },
    base: 'Pescado > carne · AOVE > salsas',
    hideOnRest: false,
    options: [
      {
        label: 'A',
        items: [
          { name: 'Salmón o caballa', qty: '180g pescado', type: 'prot' },
          { name: 'Arroz integral + ensalada', qty: '100g arroz (seco) · ensalada · 1 cda AOVE', type: 'carb' },
        ],
      },
      {
        label: 'B',
        items: [
          { name: 'Lentejas con verduras', qty: '200g lentejas cocidas', type: 'carb' },
          { name: 'Pechuga de pollo + pan', qty: '150g pechuga · 1 rebanada integral', type: 'prot' },
        ],
      },
      {
        label: 'C',
        items: [
          { name: 'Pollo a la plancha', qty: '180g pollo', type: 'prot' },
          { name: 'Garbanzos + espinacas + boniato', qty: '150g garbanzos · 60g espinacas · 150g boniato · AOVE', type: 'carb' },
        ],
      },
    ],
  },
  {
    id: 'snack',
    name: 'Snacks',
    icon: '🥜',
    timing: 'Elige 2 por tarde',
    kcal: 450,
    macros: { c: 50, p: 25, g: 20 },
    base: null,
    hideOnRest: false,
    isSnack: true,
  },
  {
    id: 'cena',
    name: 'Cena',
    icon: '🌙',
    timing: 'Obligatoria · Recuperas durmiendo',
    kcal: 550,
    macros: { c: 48, p: 42, g: 20 },
    base: null,
    warn: 'No saltársela — tu cuerpo crece durmiendo',
    hideOnRest: false,
    options: [
      {
        label: 'A',
        items: [
          { name: 'Pollo + arroz integral', qty: '180g pollo · 80g arroz', type: 'prot' },
          { name: 'Ensalada + aguacate + AOVE', qty: 'ensalada mixta · ½ aguacate · 1 cda AOVE', type: 'fat' },
        ],
      },
      {
        label: 'B',
        items: [
          { name: 'Sardinas o atún', qty: '180g pescado', type: 'prot' },
          { name: 'Boniato asado + verduras salteadas', qty: '200g boniato · 150g verduras · AOVE', type: 'carb' },
        ],
      },
      {
        label: 'C',
        items: [
          { name: 'Tortilla francesa con verduras', qty: '4 huevos (mezcla) · 100g espinacas/champi', type: 'prot' },
          { name: 'Pan integral + AOVE', qty: '2 rebanadas · AOVE', type: 'carb' },
        ],
      },
    ],
  },
  {
    id: 'sleep',
    name: 'Pre-Sueño',
    icon: '😴',
    timing: 'Opcional · ~175 kcal',
    kcal: 175,
    macros: { c: 15, p: 10, g: 10 },
    base: null,
    hideOnRest: true,
    options: [
      {
        label: 'A',
        items: [
          { name: 'Yogur light con nueces', qty: '150g yogur · 15g nueces', type: 'prot' },
        ],
      },
      {
        label: 'B',
        items: [
          { name: 'Leche semi + chocolate negro', qty: '250ml leche · 20g chocolate 85%', type: 'carb' },
        ],
      },
      {
        label: 'C',
        items: [
          { name: 'Tortita arroz + crema cacahuete', qty: '2 tortitas · 15g crema natural', type: 'fat' },
        ],
      },
    ],
  },
];

export const snackOptions = [
  { id: 'A', name: 'Manzana + nueces', detail: '1 manzana · 25g nueces', disableOnRest: false },
  { id: 'B', name: 'Plátano + crema cacahuete', detail: '1 plátano · 20g crema natural', disableOnRest: false },
  { id: 'C', name: 'Batido whey + plátano', detail: '1 scoop · 1 plátano · 30g avena', disableOnRest: true },
  { id: 'D', name: 'Yogur + fresas + chía', detail: '150g yogur · 100g fresas', disableOnRest: false },
  { id: 'E', name: 'Sandwich pavo + aguacate', detail: '2 reb pan · 60g pavo · ¼ aguacate', disableOnRest: false },
  { id: 'F', name: 'Tortitas + choco 85%', detail: '3 tortitas · 15g crema', disableOnRest: false },
];

export const claves = [
  { n: 1, text: 'Whey máx 55 g/día', detail: '1 post + 1 snack si necesitas' },
  { n: 2, text: 'Snacks:', detail: 'elige 2 al día para llegar a kcal' },
  { n: 3, text: 'Cena SIEMPRE', detail: 'tu cuerpo crece durmiendo' },
  { n: 4, text: 'Días sin gym:', detail: 'quita snack C y pre-sueño (−400 kcal)' },
  { n: 5, text: 'Rota opciones A/B/C', detail: 'variedad = micronutrientes' },
  { n: 6, text: 'Pésate 1×/semana', detail: '+0.5 kg/mes = vas bien' },
  { n: 7, text: 'Alcohol:', detail: 'reemplaza kcal útiles por vacías' },
  { n: 8, text: 'LDL:', detail: 'avena + nueces + pescado + AOVE = mejora' },
];
