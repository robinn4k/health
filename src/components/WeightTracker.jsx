import { useState } from 'react';
import WeightInput from './WeightInput';

export default function WeightTracker({ weightLog, onSaveWeight }) {
  const [showInput, setShowInput] = useState(false);

  const entries = Object.entries(weightLog || {})
    .sort(([a], [b]) => a.localeCompare(b));

  // Get current weight (latest entry)
  const currentEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const currentWeight = currentEntry ? (typeof currentEntry[1] === 'object' ? currentEntry[1].value : currentEntry[1]) : null;

  // Sparkline data (last 8 points)
  const sparkData = entries.slice(-8).map(([, v]) => typeof v === 'object' ? v.value : v);

  // Monthly delta
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthAgoStr = monthAgo.toISOString().split('T')[0];

  let monthDelta = null;
  if (entries.length >= 2) {
    const oldEntry = entries.find(([d]) => d >= monthAgoStr);
    if (oldEntry && currentEntry) {
      const oldVal = typeof oldEntry[1] === 'object' ? oldEntry[1].value : oldEntry[1];
      monthDelta = currentWeight - oldVal;
    }
  }

  // Sparkline SVG
  function renderSparkline() {
    if (sparkData.length < 2) return null;

    const w = 80, h = 28;
    const min = Math.min(...sparkData) - 0.5;
    const max = Math.max(...sparkData) + 0.5;
    const range = max - min || 1;

    const points = sparkData.map((v, i) => {
      const x = (i / (sparkData.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Last point dot */}
        {sparkData.length > 0 && (() => {
          const lastX = w;
          const lastY = h - ((sparkData[sparkData.length - 1] - min) / range) * h;
          return <circle cx={lastX} cy={lastY} r="2.5" fill="var(--gold)" />;
        })()}
      </svg>
    );
  }

  function getDeltaColor() {
    if (monthDelta === null) return 'var(--text3)';
    const abs = Math.abs(monthDelta);
    if (abs <= 0.5) return 'var(--green)';
    if (abs <= 1) return 'var(--gold)';
    return '#F59E0B'; // amber
  }

  return (
    <>
      <div
        className="mx-5 mb-3 px-4 py-3 rounded-xl border cursor-pointer transition-all active:scale-[0.99]"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={() => setShowInput(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] font-semibold tracking-[2px] uppercase mb-1" style={{ color: 'var(--text3)' }}>
              Peso Corporal
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[22px] font-bold" style={{ color: 'var(--text)' }}>
                {currentWeight ? currentWeight.toFixed(1) : '—'}
              </span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>kg</span>
              {monthDelta !== null && (
                <span className="font-mono text-[10px] font-semibold ml-2" style={{ color: getDeltaColor() }}>
                  {monthDelta > 0 ? '+' : ''}{monthDelta.toFixed(1)} kg/mes
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {renderSparkline()}
            <span className="text-[10px]" style={{ color: 'var(--text3)' }}>✏️</span>
          </div>
        </div>
      </div>

      {showInput && (
        <WeightInput
          currentWeight={currentWeight || 77.0}
          onSave={onSaveWeight}
          onClose={() => setShowInput(false)}
        />
      )}
    </>
  );
}
