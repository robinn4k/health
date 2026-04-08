# CLAUDE.md — Instrucciones para Claude Code

## Proyecto
PWA de fitness personal (nutrición + entrenamiento). React + Vite + Tailwind CSS.
Optimizada para iPhone 15 con estética dark luxury (negro + dorado).

## Setup
```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss @tailwindcss/vite
```

Después copiar los archivos de `src/` y `public/` al proyecto.

## Configurar Tailwind
En `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/plan-fitness/', // Para GitHub Pages
})
```

## Deploy a GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

O configurar GitHub Actions para deploy automático.

## Estructura clave
- `src/data/meals.js` — Datos nutricionales (comidas, macros, snacks, claves)
- `src/data/workout.js` — Rutina Push & Pull con ejercicios
- `src/components/` — Componentes React
- `src/styles/globals.css` — Variables CSS, fuentes, animaciones
- `public/manifest.json` — PWA manifest

## Estilo
- Fonts: Playfair Display (headers), Outfit (body), JetBrains Mono (datos)
- Colores: Negro #06060A, Dorado #D4AF37, macro colors (carb azul, prot rosa, fat amarillo)
- Push = dorado, Pull = cyan
- localStorage para persistencia diaria con auto-reset

## Testing
La app debe verse perfecta en:
- iPhone 15 (Safari, Chrome)
- Resolución 430px max-width
- Con safe-area-inset para notch
