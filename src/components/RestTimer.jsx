import { useState, useEffect, useRef, useCallback } from 'react';

const DURATIONS = [60, 90, 120, 180];

export default function RestTimer({ remaining, setRemaining, duration, setDuration, onClose }) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    if (pausedRef.current) return;
    setRemaining(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        try { navigator.vibrate?.(200); } catch {}
        return 0;
      }
      return prev - 1;
    });
  }, [setRemaining]);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [tick]);

  function togglePause() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }

  function handleDurationChange(d) {
    setDuration(d);
    setRemaining(d);
    pausedRef.current = false;
    setPaused(false);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }

  const pct = duration > 0 ? remaining / duration : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div
      className="fixed left-0 right-0 z-[100] flex justify-center"
      style={{ bottom: '90px' }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border backdrop-blur-xl animate-slide-up"
        style={{
          background: 'rgba(15,15,22,0.95)',
          borderColor: remaining === 0 ? 'rgba(74,222,128,0.3)' : 'var(--border-gold)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          maxWidth: '400px',
          width: 'calc(100% - 24px)',
        }}
      >
        {/* SVG Ring */}
        <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
          <svg width="56" height="56" viewBox="0 0 88 88" className="transform -rotate-90">
            <circle
              cx="44" cy="44" r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="4"
            />
            <circle
              cx="44" cy="44" r={radius}
              fill="none"
              stroke={remaining === 0 ? 'var(--green)' : 'var(--gold)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.3s linear' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center font-mono text-[15px] font-bold"
            style={{ color: remaining === 0 ? 'var(--green)' : 'var(--gold)' }}
          >
            {timeStr}
          </span>
        </div>

        {/* Controls */}
        <div className="flex-1 min-w-0">
          {/* Duration pills */}
          <div className="flex gap-1.5 mb-2">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => handleDurationChange(d)}
                className="font-mono text-[9px] font-semibold px-2 py-1 rounded-md border transition-all"
                style={{
                  color: d === duration ? 'var(--bg)' : 'var(--text3)',
                  background: d === duration ? 'var(--gold)' : 'transparent',
                  borderColor: d === duration ? 'var(--gold)' : 'var(--border)',
                }}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="font-mono text-[9px] font-semibold tracking-wider px-3 py-1.5 rounded-lg border transition-all"
              style={{
                color: 'var(--text2)',
                borderColor: 'var(--border)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {paused ? '▶ PLAY' : '⏸ PAUSA'}
            </button>
            <button
              onClick={onClose}
              className="font-mono text-[9px] font-semibold tracking-wider px-3 py-1.5 rounded-lg border transition-all"
              style={{
                color: 'var(--text3)',
                borderColor: 'var(--border)',
                background: 'transparent',
              }}
            >
              ✕ CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
