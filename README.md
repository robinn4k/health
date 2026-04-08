# Plan Fitness — Robin M. Ober

PWA de nutrición y entrenamiento personal. React + Vite + Tailwind CSS.

## Stack
- **React 18** + Vite
- **Tailwind CSS** (dark theme, gold accent)
- **localStorage** para persistencia diaria
- **PWA** instalable en iPhone 15

## Estructura
```
src/
  components/
    App.jsx          — Layout principal con tabs
    NavBar.jsx       — Bottom navigation (Nutrición / Entreno)
    NutritionTab.jsx — Plan nutricional interactivo
    WorkoutTab.jsx   — Rutina Push & Pull
    DayToggle.jsx    — Toggle entreno/descanso
    MealCard.jsx     — Card expandible de comida
    SnackGrid.jsx    — Grid seleccionable de snacks
    ExerciseCard.jsx — Card de ejercicio
    MacroSummary.jsx — Resumen de macros
  data/
    meals.js         — Datos de comidas y opciones
    workout.js       — Datos de ejercicios Push & Pull
  styles/
    globals.css      — Variables CSS, fuentes, animaciones
```

## Setup con Claude Code
```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss @tailwindcss/vite
# Copiar los archivos src/ y public/
npm run dev
```

## Deploy a GitHub Pages
```bash
npm run build
# Push dist/ a gh-pages branch
```

## Datos personales
- 77 kg · 2600-2800 kcal · Prot 2.2g/kg
- Entreno mañana · 4-5 días/sem
- Push & Pull All Around (2 días, rotación)
