import { useState } from 'react';
import RecipeSearch from './RecipeSearch';

const typeColors = {
  carb: 'var(--carb)',
  prot: 'var(--prot)',
  fat: 'var(--fat)',
};

const iconBgs = {
  pre: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(167,139,250,0.12))',
  post: 'linear-gradient(135deg, rgba(251,113,133,0.12), rgba(249,115,22,0.12))',
  comida: 'linear-gradient(135deg, rgba(74,222,128,0.12), rgba(16,185,129,0.12))',
  cena: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(99,102,241,0.12))',
  sleep: 'linear-gradient(135deg, rgba(148,163,184,0.1), rgba(100,116,139,0.1))',
};

export default function MealCard({ meal, isTraining, isOpen, onToggle, index }) {
  const [optIdx, setOptIdx] = useState(0);
  const [showRecipes, setShowRecipes] = useState(false);
  const isDimmed = meal.hideOnRest && !isTraining;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.15,1)]"
      style={{
        background: isOpen ? 'var(--card-up)' : 'var(--card)',
        borderColor: isOpen ? 'var(--border-gold)' : 'var(--border)',
        boxShadow: isOpen ? '0 4px 30px rgba(0,0,0,0.3), 0 0 0 1px var(--border-gold)' : 'none',
        opacity: isDimmed ? 0.2 : 1,
        pointerEvents: isDimmed ? 'none' : 'auto',
        transform: isDimmed ? 'scale(0.97)' : 'none',
        filter: isDimmed ? 'grayscale(0.5)' : 'none',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: iconBgs[meal.id] || iconBgs.comida }}
          >
            {meal.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold tracking-tight">{meal.name}</h3>
            <p className="font-mono text-[10.5px] mt-0.5" style={{ color: 'var(--text3)' }}>
              {meal.timing}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isDimmed && (
            <span className="font-mono text-[8px] font-bold tracking-[2px] px-2 py-0.5 rounded" style={{ color: 'var(--rest)', background: 'var(--rest-bg)' }}>
              DESCANSO
            </span>
          )}
          <span
            className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full transition-shadow"
            style={{
              color: 'var(--gold)',
              background: 'var(--gold-dim)',
              boxShadow: isOpen ? '0 0 12px rgba(212,175,55,0.15)' : 'none',
            }}
          >
            ~{meal.kcal}
          </span>
          <span
            className="text-xs transition-transform duration-300"
            style={{
              color: isOpen ? 'var(--gold)' : 'var(--text3)',
              transform: isOpen ? 'rotate(180deg)' : 'none',
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        className="overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0.4,0,0.15,1)]"
        style={{ maxHeight: isOpen ? '1400px' : '0' }}
      >
        <div className="px-4 pb-4">
          {/* Base hint */}
          {meal.base && (
            <div
              className="flex items-center gap-1.5 text-[10.5px] px-3 py-1.5 rounded-lg mb-3.5 font-mono tracking-wide border-l-2"
              style={{ color: 'var(--text2)', background: 'var(--gold-glow)', borderLeftColor: meal.warn ? 'var(--prot)' : 'var(--gold)' }}
            >
              {meal.base}
            </div>
          )}

          {meal.warn && (
            <div
              className="flex items-center gap-1.5 text-[10.5px] px-3 py-1.5 rounded-lg mb-3.5 font-mono tracking-wide border-l-2"
              style={{ color: 'var(--text2)', background: 'rgba(251,113,133,0.04)', borderLeftColor: 'var(--prot)' }}
            >
              ⚠ {meal.warn}
            </div>
          )}

          {/* Option tabs */}
          {meal.options && (
            <>
              <div className="flex gap-1.5 mb-3.5">
                {meal.options.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={(e) => { e.stopPropagation(); setOptIdx(i); }}
                    className="flex-1 text-center font-mono text-xs font-semibold py-2 rounded-lg border transition-all duration-200 select-none"
                    style={{
                      background: i === optIdx ? 'var(--gold-dim)' : 'rgba(255,255,255,0.02)',
                      borderColor: i === optIdx ? 'var(--border-gold)' : 'var(--border)',
                      color: i === optIdx ? 'var(--gold)' : 'var(--text3)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Food items */}
              <div className="flex flex-col gap-1.5">
                {meal.options[optIdx].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: typeColors[item.type] || 'var(--text3)' }} />
                    <div>
                      <p className="text-[13.5px] font-medium leading-snug">{item.name}</p>
                      <p className="font-mono text-[10.5px] mt-0.5" style={{ color: 'var(--text3)' }}>{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Search recipes button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowRecipes(true); }}
            className="w-full mt-3 py-2.5 rounded-xl border font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
            style={{ color: 'var(--gold)', borderColor: 'var(--border-gold)', background: 'var(--gold-glow)' }}
          >
            🔍 BUSCAR RECETAS
          </button>

          {/* Macro mini bar */}
          <div
            className="flex gap-3 mt-3.5 px-3.5 py-2.5 rounded-xl border"
            style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'var(--border)' }}
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--carb)' }} /> {meal.macros.c}C
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--prot)' }} /> {meal.macros.p}P
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--fat)' }} /> {meal.macros.g}G
            </span>
          </div>
        </div>
      </div>

      {/* Recipe Search Overlay */}
      {showRecipes && (
        <RecipeSearch mealType={meal.id} onClose={() => setShowRecipes(false)} />
      )}
    </div>
  );
}
