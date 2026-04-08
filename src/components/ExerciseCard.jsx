import { useState } from 'react';
import { getLastWeight } from '../App';

export default function ExerciseCard({ exercise, palette, index, sets, onUpdateSets, workoutLog, dayId }) {
  const [isOpen, setIsOpen] = useState(false);
  const lastKg = getLastWeight(workoutLog, dayId, exercise.n);

  const defaultSet = { kg: '', reps: '', done: false };
  const currentSets = sets || Array.from({ length: exercise.sets }, () => ({ ...defaultSet }));

  const completedSets = currentSets.filter(s => s.done).length;
  const allDone = currentSets.length > 0 && completedSets === currentSets.length;

  function updateSet(idx, field, value) {
    const next = currentSets.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    onUpdateSets(exercise.n, next);
  }

  function toggleDone(idx) {
    const next = currentSets.map((s, i) => i === idx ? { ...s, done: !s.done } : s);
    onUpdateSets(exercise.n, next);
  }

  function addSet() {
    onUpdateSets(exercise.n, [...currentSets, { ...defaultSet }]);
  }

  function removeSet() {
    if (currentSets.length <= 1) return;
    onUpdateSets(exercise.n, currentSets.slice(0, -1));
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.15,1)] animate-slide-up"
      style={{
        background: isOpen ? 'var(--card-up)' : 'var(--card)',
        borderColor: allDone ? 'rgba(74,222,128,0.3)' : isOpen ? palette.border : 'var(--border)',
        boxShadow: allDone
          ? '0 0 20px rgba(74,222,128,0.08)'
          : isOpen ? `0 4px 30px rgba(0,0,0,0.3)` : 'none',
        animationDelay: `${index * 0.03}s`,
      }}
    >
      {/* Header — min 48px touch target */}
      <div
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none min-h-[48px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
            style={{
              background: allDone ? 'rgba(74,222,128,0.15)' : palette.bg,
              color: allDone ? 'var(--green)' : palette.accent,
            }}
          >
            {allDone ? '✓' : exercise.n}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] font-semibold tracking-[1.5px] uppercase" style={{ color: palette.accent }}>
              {exercise.block}
            </p>
            <h4 className="text-[14px] font-semibold mt-0.5 leading-snug">{exercise.name}</h4>
            {exercise.detail && (
              <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
                {exercise.detail}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {lastKg && !isOpen && (
            <span
              className="font-mono text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{ color: palette.accent, background: palette.bg }}
            >
              {lastKg} kg
            </span>
          )}
          {completedSets > 0 && !allDone && (
            <span
              className="font-mono text-[10px] font-bold px-2 py-1 rounded"
              style={{ color: 'var(--green)', background: 'rgba(74,222,128,0.1)' }}
            >
              {completedSets}/{currentSets.length}
            </span>
          )}
          <span
            className="text-xs transition-transform duration-300"
            style={{
              color: isOpen ? palette.accent : 'var(--text3)',
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
        style={{ maxHeight: isOpen ? '1000px' : '0' }}
      >
        <div className="px-4 pb-4">
          {/* Target */}
          <p className="text-[12px] mb-3" style={{ color: 'var(--text2)' }}>
            → {exercise.target}
          </p>

          {/* Reference */}
          {lastKg && (
            <div
              className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg mb-3 font-mono tracking-wide border-l-2"
              style={{ color: 'var(--text2)', background: palette.glow, borderLeftColor: palette.accent }}
            >
              Último peso: {lastKg} kg · Objetivo: {exercise.reps} reps
            </div>
          )}

          {!lastKg && (
            <div
              className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg mb-3 font-mono tracking-wide border-l-2"
              style={{ color: 'var(--text3)', background: 'rgba(255,255,255,0.02)', borderLeftColor: 'var(--border)' }}
            >
              Objetivo: {exercise.reps} reps · Primera vez
            </div>
          )}

          {/* Sets */}
          <div className="flex flex-col gap-2.5">
            {currentSets.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200"
                style={{
                  background: s.done ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.015)',
                  borderColor: s.done ? 'rgba(74,222,128,0.2)' : 'var(--border)',
                }}
              >
                {/* Set number */}
                <span className="font-mono text-[11px] font-bold w-5 text-center shrink-0" style={{ color: 'var(--text3)' }}>
                  {i + 1}
                </span>

                {/* Kg input */}
                <div className="flex-1 relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={s.kg}
                    onChange={e => updateSet(i, 'kg', e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="exercise-input w-full text-right pr-8"
                    style={{ color: s.kg ? 'var(--text)' : 'var(--text3)' }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-medium pointer-events-none" style={{ color: 'var(--text3)' }}>
                    kg
                  </span>
                </div>

                {/* Reps input */}
                <div className="flex-1 relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={s.reps}
                    onChange={e => updateSet(i, 'reps', e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="exercise-input w-full text-right pr-9"
                    style={{ color: s.reps ? 'var(--text)' : 'var(--text3)' }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-medium pointer-events-none" style={{ color: 'var(--text3)' }}>
                    rep
                  </span>
                </div>

                {/* Done toggle — 44px min touch target */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDone(i); }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200"
                  style={{
                    background: s.done ? 'rgba(74,222,128,0.15)' : 'transparent',
                    borderColor: s.done ? 'rgba(74,222,128,0.3)' : 'var(--border)',
                    color: s.done ? 'var(--green)' : 'var(--text3)',
                  }}
                >
                  <span className="text-base">{s.done ? '✓' : '○'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add/Remove set buttons — 44px min height */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); addSet(); }}
              className="flex-1 py-3 rounded-xl border font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 min-h-[44px]"
              style={{ color: palette.accent, borderColor: palette.border, background: palette.glow }}
            >
              + SERIE
            </button>
            {currentSets.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); removeSet(); }}
                className="py-3 px-5 rounded-xl border font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 min-h-[44px]"
                style={{ color: 'var(--text3)', borderColor: 'var(--border)', background: 'transparent' }}
              >
                −
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
