import { useState } from 'react';
import { recipes, quickTags } from '../data/recipes';

const mealNames = {
  pre: 'Pre-Entreno',
  post: 'Post-Entreno',
  comida: 'Comida',
  cena: 'Cena',
  sleep: 'Pre-Sueño',
};

const typeColors = {
  carb: 'var(--carb)',
  prot: 'var(--prot)',
  fat: 'var(--fat)',
};

export default function RecipeSearch({ mealType, onClose }) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = recipes.filter(r => {
    if (!r.mealTypes.includes(mealType)) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      r.name.toLowerCase().includes(q) ||
      r.tags.some(t => t.includes(q)) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(q))
    );
  });

  function handleTagClick(tag) {
    setQuery(prev => prev === tag ? '' : tag);
  }

  return (
    <div className="recipe-overlay safe-top safe-bottom">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-[3px] uppercase" style={{ color: 'var(--gold)' }}>
              Recetas
            </p>
            <h2 className="font-display text-[24px] font-bold leading-tight mt-0.5">
              {mealNames[mealType] || 'Buscar'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl flex items-center justify-center border text-base"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text2)' }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3 relative">
          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--text3)' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por ingrediente..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="recipe-search-input"
            autoFocus
          />
        </div>

        {/* Quick Tags */}
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {quickTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="font-mono text-[11px] font-medium px-3 py-2 rounded-full border transition-all duration-200 min-h-[36px]"
              style={{
                background: query === tag ? 'var(--gold-dim)' : 'transparent',
                borderColor: query === tag ? 'var(--border-gold)' : 'var(--border)',
                color: query === tag ? 'var(--gold)' : 'var(--text3)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="px-3 pb-8 flex flex-col gap-2.5">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[15px]" style={{ color: 'var(--text3)' }}>
                No se encontraron recetas
              </p>
              <p className="font-mono text-[12px] mt-1" style={{ color: 'var(--text3)' }}>
                Prueba con otro ingrediente
              </p>
            </div>
          )}

          {filtered.map(recipe => {
            const isExpanded = expandedId === recipe.id;
            return (
              <div
                key={recipe.id}
                className="rounded-2xl border overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.15,1)]"
                style={{
                  background: isExpanded ? 'var(--card-up)' : 'var(--card)',
                  borderColor: isExpanded ? 'var(--border-gold)' : 'var(--border)',
                  boxShadow: isExpanded ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {/* Recipe Header */}
                <div
                  className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none min-h-[52px]"
                  onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <h4 className="text-[14px] font-semibold leading-snug">{recipe.name}</h4>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <span className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>
                        ⏱ {recipe.time}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--carb)' }} />
                        <span style={{ color: 'var(--text3)' }}>{recipe.macros.c}C</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--prot)' }} />
                        <span style={{ color: 'var(--text3)' }}>{recipe.macros.p}P</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--fat)' }} />
                        <span style={{ color: 'var(--text3)' }}>{recipe.macros.g}G</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: 'var(--gold)', background: 'var(--gold-dim)' }}
                    >
                      {recipe.kcal}
                    </span>
                    <span
                      className="text-xs transition-transform duration-300"
                      style={{
                        color: isExpanded ? 'var(--gold)' : 'var(--text3)',
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* Recipe Body */}
                <div
                  className="overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0.4,0,0.15,1)]"
                  style={{ maxHeight: isExpanded ? '800px' : '0' }}
                >
                  <div className="px-4 pb-4">
                    {/* Ingredients */}
                    <div className="flex flex-col gap-1.5">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.015)' }}>
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: typeColors[ing.type] || 'var(--text3)' }} />
                          <div className="flex-1 flex items-baseline justify-between gap-2">
                            <p className="text-[14px] font-medium leading-snug">{ing.name}</p>
                            <p className="font-mono text-[11px] shrink-0" style={{ color: 'var(--text3)' }}>{ing.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Macro bar */}
                    <div
                      className="flex gap-3 mt-3.5 px-3.5 py-3 rounded-xl border flex-wrap"
                      style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'var(--border)' }}
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[12px] font-medium">
                        <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--carb)' }} /> {recipe.macros.c}C
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[12px] font-medium">
                        <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--prot)' }} /> {recipe.macros.p}P
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[12px] font-medium">
                        <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--fat)' }} /> {recipe.macros.g}G
                      </span>
                      <span className="ml-auto font-mono text-[12px] font-bold" style={{ color: 'var(--gold)' }}>
                        {recipe.kcal} kcal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Count */}
          {filtered.length > 0 && (
            <p className="text-center font-mono text-[11px] py-3" style={{ color: 'var(--text3)' }}>
              {filtered.length} receta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
