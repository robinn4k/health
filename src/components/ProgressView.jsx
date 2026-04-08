import { useState, useMemo } from 'react';
import { workoutDays } from '../data/workout';
import ProgressChart from './ProgressChart';

const RANGES = [
  { id: '30d', label: '30D', days: 30 },
  { id: '60d', label: '60D', days: 60 },
  { id: '90d', label: '90D', days: 90 },
  { id: 'all', label: 'TODO', days: Infinity },
];

export default function ProgressView({ workoutLog, onClose }) {
  const [selectedDay, setSelectedDay] = useState('push');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [range, setRange] = useState('all');

  const day = workoutDays.find(d => d.id === selectedDay);
  const exercises = day?.exercises || [];
  const palette = selectedDay === 'push'
    ? { accent: 'var(--gold)', bg: 'var(--gold-dim)', border: 'var(--border-gold)' }
    : { accent: 'var(--cyan)', bg: 'var(--cyan-bg)', border: 'rgba(34,211,238,0.2)' };

  // When changing day, reset exercise selection
  const activeExercise = selectedExercise && exercises.find(e => e.n === selectedExercise)
    ? selectedExercise
    : exercises[0]?.n;

  const exerciseObj = exercises.find(e => e.n === activeExercise);

  // Build chart data for selected exercise
  const chartData = useMemo(() => {
    if (!activeExercise) return [];

    const rangeDays = RANGES.find(r => r.id === range)?.days || Infinity;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeDays);
    const cutoffStr = cutoff.toDateString();

    const entries = Object.entries(workoutLog)
      .filter(([, entry]) => entry.day === selectedDay)
      .filter(([date]) => rangeDays === Infinity || new Date(date) >= new Date(cutoffStr))
      .sort(([a], [b]) => new Date(a) - new Date(b));

    return entries
      .map(([date, entry]) => {
        const sets = entry.exercises?.[activeExercise];
        if (!sets) return null;
        const bestSet = sets
          .filter(s => s.done && s.kg > 0)
          .sort((a, b) => b.kg - a.kg)[0];
        if (!bestSet) return null;

        const d = new Date(date);
        const label = `${d.getDate()}/${d.getMonth() + 1}`;
        const epley1RM = parseFloat(bestSet.kg) * (1 + parseFloat(bestSet.reps || 0) / 30);

        return {
          date,
          label,
          value: parseFloat(bestSet.kg),
          reps: parseInt(bestSet.reps) || 0,
          estimated1RM: Math.round(epley1RM),
        };
      })
      .filter(Boolean);
  }, [workoutLog, selectedDay, activeExercise, range]);

  // Stats
  const best = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
  const last = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const best1RM = chartData.length > 0 ? Math.max(...chartData.map(d => d.estimated1RM)) : 0;

  return (
    <div className="recipe-overlay safe-top safe-bottom">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[3px] uppercase" style={{ color: palette.accent }}>
              Progreso
            </p>
            <h2 className="font-display text-[24px] font-bold mt-0.5" style={{ color: 'var(--text)' }}>
              {exerciseObj?.name || 'Ejercicio'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border flex items-center justify-center"
            style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
          >
            ✕
          </button>
        </div>

        {/* Day toggle */}
        <div className="flex gap-2 px-5 mb-4">
          {['push', 'pull'].map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDay(d); setSelectedExercise(null); }}
              className="font-mono text-[10px] font-semibold tracking-wider px-4 py-2 rounded-lg border transition-all"
              style={{
                color: selectedDay === d ? 'var(--bg)' : 'var(--text3)',
                background: selectedDay === d ? palette.accent : 'transparent',
                borderColor: selectedDay === d ? palette.accent : 'var(--border)',
              }}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exercise selector */}
        <div className="px-5 mb-4 overflow-x-auto">
          <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
            {exercises.map(ex => (
              <button
                key={ex.n}
                onClick={() => setSelectedExercise(ex.n)}
                className="font-mono text-[9px] font-medium px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap"
                style={{
                  color: activeExercise === ex.n ? palette.accent : 'var(--text3)',
                  background: activeExercise === ex.n ? palette.bg : 'transparent',
                  borderColor: activeExercise === ex.n ? palette.border : 'var(--border)',
                }}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Range pills */}
        <div className="flex gap-2 px-5 mb-4">
          {RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className="font-mono text-[9px] font-semibold px-3 py-1.5 rounded-md border transition-all"
              style={{
                color: range === r.id ? 'var(--bg)' : 'var(--text3)',
                background: range === r.id ? palette.accent : 'transparent',
                borderColor: range === r.id ? palette.accent : 'var(--border)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="px-5 mb-4">
          <div
            className="rounded-2xl border p-3"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <ProgressChart
              data={chartData}
              color={selectedDay === 'push' ? 'var(--gold)' : 'var(--cyan)'}
              height={180}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 grid grid-cols-3 gap-2 mb-6">
          {[
            { label: 'MEJOR', value: best ? `${best} kg` : '—' },
            { label: 'ÚLTIMO', value: last ? `${last} kg` : '—' },
            { label: '1RM EST.', value: best1RM ? `${best1RM} kg` : '—' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl border p-3 text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="font-mono text-[8px] font-semibold tracking-[2px] uppercase mb-1" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
              <p className="font-mono text-[16px] font-bold" style={{ color: palette.accent }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sessions count */}
        <div className="px-5 pb-8 text-center">
          <p className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
            {chartData.length} sesiones registradas
          </p>
        </div>
      </div>
    </div>
  );
}
