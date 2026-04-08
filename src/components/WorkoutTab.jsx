import { useState } from 'react';
import { workoutDays } from '../data/workout';

const dayColors = {
  gold: { accent: 'var(--gold)', bg: 'var(--gold-dim)', glow: 'var(--gold-glow)', border: 'var(--border-gold)' },
  cyan: { accent: 'var(--cyan)', bg: 'var(--cyan-bg)', glow: 'rgba(34,211,238,0.06)', border: 'rgba(34,211,238,0.2)' },
};

export default function WorkoutTab() {
  const [activeDay, setActiveDay] = useState('push');
  const day = workoutDays.find(d => d.id === activeDay);
  const palette = dayColors[day.color];

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-6 relative">
        <div
          className="absolute bottom-0 left-5 right-5 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)` }}
        />
        <p
          className="font-mono text-[10px] font-semibold tracking-[4px] uppercase"
          style={{ color: palette.accent }}
        >
          Push & Pull
        </p>
        <h1
          className="font-display text-[34px] font-extrabold leading-tight mt-1"
          style={{
            background: `linear-gradient(135deg, var(--text) 40%, ${palette.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          All Around
        </h1>
      </div>

      {/* Day Toggle */}
      <div className="px-5 pb-4">
        <div
          className="flex rounded-[14px] p-1 relative border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-[11px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.1,1)]"
            style={{
              width: 'calc(50% - 4px)',
              background: activeDay === 'push' ? 'var(--gold)' : 'var(--cyan)',
              transform: activeDay === 'push' ? 'translateX(0)' : 'translateX(100%)',
              boxShadow: activeDay === 'push'
                ? '0 0 20px rgba(212,175,55,0.3)'
                : '0 0 20px rgba(34,211,238,0.3)',
            }}
          />
          <button
            onClick={() => setActiveDay('push')}
            className="flex-1 text-center py-3 font-mono text-[11px] font-semibold tracking-wider rounded-[11px] relative z-[2] transition-colors duration-300"
            style={{ color: activeDay === 'push' ? 'var(--bg)' : 'var(--text3)' }}
          >
            DÍA 1 · PUSH
          </button>
          <button
            onClick={() => setActiveDay('pull')}
            className="flex-1 text-center py-3 font-mono text-[11px] font-semibold tracking-wider rounded-[11px] relative z-[2] transition-colors duration-300"
            style={{ color: activeDay === 'pull' ? 'var(--bg)' : 'var(--text3)' }}
          >
            DÍA 2 · PULL
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <div
        className="mx-5 mb-4 px-4 py-2.5 rounded-xl font-mono text-[11px] font-medium tracking-wide flex items-center gap-2 border"
        style={{ background: palette.glow, color: palette.accent, borderColor: palette.border }}
      >
        <span>{day.subtitle}</span>
        <span className="ml-auto font-bold">{day.exercises.length} ejercicios</span>
      </div>

      {/* Exercises */}
      <div className="px-3 flex flex-col gap-2">
        {day.exercises.map((ex, i) => (
          <div
            key={ex.n}
            className="rounded-2xl border px-4 py-3 animate-slide-up"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              animationDelay: `${i * 0.03}s`,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Number */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
                style={{ background: palette.bg, color: palette.accent }}
              >
                {ex.n}
              </div>

              <div className="flex-1 min-w-0">
                {/* Block label */}
                <p className="font-mono text-[9px] font-semibold tracking-[1.5px] uppercase" style={{ color: palette.accent }}>
                  {ex.block}
                </p>
                {/* Exercise name */}
                <h4 className="text-[14px] font-semibold mt-0.5 leading-snug">
                  {ex.name}
                </h4>
                {/* Detail */}
                {ex.detail && (
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
                    {ex.detail}
                  </p>
                )}
                {/* Target */}
                <p className="text-[11px] mt-1" style={{ color: 'var(--text2)' }}>
                  → {ex.target}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8 px-5">
        <p className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--text3)' }}>
          ¡A entrenar! — <span style={{ color: palette.accent, fontWeight: 600 }}>Push & Pull All Around</span>
        </p>
      </div>
    </div>
  );
}
