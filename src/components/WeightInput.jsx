import { useState } from 'react';

export default function WeightInput({ currentWeight, onSave, onClose }) {
  const [value, setValue] = useState(currentWeight || 77.0);

  function adjust(delta) {
    setValue(prev => Math.round((prev + delta) * 10) / 10);
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[640px] rounded-t-3xl border-t border-x px-6 pt-6 pb-8 safe-bottom animate-slide-up"
        style={{
          background: 'var(--card-up)',
          borderColor: 'var(--border-gold)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />

        <h3 className="font-mono text-[10px] font-bold tracking-[4px] uppercase text-center mb-6" style={{ color: 'var(--gold)' }}>
          Peso Corporal
        </h3>

        {/* Value display + controls */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <button
            onClick={() => adjust(-0.1)}
            className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-lg font-bold transition-all active:scale-95"
            style={{ color: 'var(--text2)', borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            −
          </button>

          <div className="text-center">
            <span
              className="font-mono text-[40px] font-bold leading-none"
              style={{ color: 'var(--text)' }}
            >
              {value.toFixed(1)}
            </span>
            <span className="font-mono text-[14px] ml-1" style={{ color: 'var(--text3)' }}>kg</span>
          </div>

          <button
            onClick={() => adjust(0.1)}
            className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-lg font-bold transition-all active:scale-95"
            style={{ color: 'var(--text2)', borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            +
          </button>
        </div>

        {/* Quick adjust */}
        <div className="flex justify-center gap-2 mb-6">
          {[-1, -0.5, 0.5, 1].map(d => (
            <button
              key={d}
              onClick={() => adjust(d)}
              className="font-mono text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all"
              style={{ color: 'var(--text3)', borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              {d > 0 ? '+' : ''}{d}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={() => { onSave(value); onClose(); }}
          className="w-full py-4 rounded-2xl border font-mono text-[13px] font-bold tracking-wider transition-all active:scale-[0.98]"
          style={{
            background: 'var(--gold-dim)',
            borderColor: 'var(--border-gold)',
            color: 'var(--gold)',
          }}
        >
          GUARDAR
        </button>
      </div>
    </div>
  );
}
