import { meals, snackOptions, claves, MACROS_TRAIN, MACROS_REST } from '../data/meals';
import MealCard from './MealCard';
import SnackGrid from './SnackGrid';
import MacroSummary from './MacroSummary';
import DayToggle from './DayToggle';

export default function NutritionTab({
  isTraining, setIsTraining,
  selectedSnacks, setSelectedSnacks,
  openCards, setOpenCards,
  onReset,
}) {
  const macros = isTraining ? MACROS_TRAIN : MACROS_REST;

  function toggleCard(id) {
    setOpenCards(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-6 relative">
        <div
          className="absolute bottom-0 left-5 right-5 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border-gold), transparent)' }}
        />
        <h1
          className="font-display text-[28px] font-extrabold leading-tight animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, var(--text) 40%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animationDelay: '0.1s',
          }}
        >
          Entrenamiento personalizado
        </h1>
        <div className="flex gap-2 mt-3 flex-wrap animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {['77 kg', 'Prot 2.2 g/kg', '4–5 días/sem'].map(t => (
            <span
              key={t}
              className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-full border"
              style={{ color: 'var(--text2)', background: 'var(--gold-glow)', borderColor: 'var(--border)' }}
            >
              {t}
            </span>
          ))}
          <span
            className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-full border"
            style={{ color: 'var(--carb)', background: 'var(--carb-bg)', borderColor: 'rgba(96,165,250,0.12)' }}
          >
            💧 3 L/día
          </span>
        </div>
      </div>

      {/* Day Toggle */}
      <DayToggle isTraining={isTraining} setIsTraining={setIsTraining} />

      {/* Macro Summary */}
      <MacroSummary macros={macros} />

      {/* Meals */}
      <div className="px-3 flex flex-col gap-2.5">
        {meals.map((meal, i) => {
          if (meal.isSnack) {
            return (
              <SnackGrid
                key={meal.id}
                meal={meal}
                isTraining={isTraining}
                selectedSnacks={selectedSnacks}
                setSelectedSnacks={setSelectedSnacks}
                isOpen={openCards.includes(meal.id)}
                onToggle={() => toggleCard(meal.id)}
                index={i}
              />
            );
          }
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              isTraining={isTraining}
              isOpen={openCards.includes(meal.id)}
              onToggle={() => toggleCard(meal.id)}
              index={i}
            />
          );
        })}
      </div>

      {/* Claves */}
      <div className="px-3 mt-5">
        <div
          className="rounded-2xl border p-5 relative"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }}
          />
          <h3
            className="font-mono text-[10px] font-bold tracking-[4px] uppercase mb-4"
            style={{ color: 'var(--gold)' }}
          >
            📌 Claves
          </h3>
          {claves.map(c => (
            <div key={c.n} className="flex gap-2.5 py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-[11px] font-bold w-4 shrink-0" style={{ color: 'var(--gold)' }}>
                {c.n}
              </span>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                <strong className="font-semibold" style={{ color: 'var(--text)' }}>{c.text}</strong>
                {' '}{c.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 pb-4 mx-5 mt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="font-mono text-[9px] tracking-wider" style={{ color: 'var(--text3)' }}>
          Plan personalizado · <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Robin M. Ober</span>
        </p>
        <p className="font-mono text-[9px] tracking-wider mt-1" style={{ color: 'var(--text3)' }}>
          Basado en analítica Marzo 2026 · Agave máx 1 cdta/día
        </p>
        <button
          onClick={onReset}
          className="mt-2 font-mono text-[9px] tracking-wider px-4 py-1.5 rounded-full border transition-colors"
          style={{ color: 'var(--text3)', borderColor: 'var(--border)' }}
        >
          RESETEAR DÍA
        </button>
      </div>
    </div>
  );
}
