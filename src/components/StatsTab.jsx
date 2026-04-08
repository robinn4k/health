import { useMemo } from 'react';
import { workoutDays } from '../data/workout';

export default function StatsTab({ workoutLog, weightLog }) {
  const stats = useMemo(() => {
    const now = new Date();
    const entries = Object.entries(workoutLog);

    // This week (Mon-Sun)
    const dayOfWeek = now.getDay() || 7; // Mon=1, Sun=7
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);
    weekStart.setHours(0, 0, 0, 0);

    const weekWorkouts = entries.filter(([date]) => new Date(date) >= weekStart);
    const weekSets = weekWorkouts.reduce((sum, [, e]) => {
      return sum + Object.values(e.exercises || {}).reduce((s, sets) => s + sets.filter(set => set.done).length, 0);
    }, 0);
    const weekVolume = weekWorkouts.reduce((sum, [, e]) => {
      return sum + Object.values(e.exercises || {}).reduce((s, sets) => {
        return s + sets.filter(set => set.done).reduce((v, set) => v + (parseFloat(set.kg) || 0) * (parseInt(set.reps) || 0), 0);
      }, 0);
    }, 0);
    const weekDuration = weekWorkouts.reduce((sum, [, e]) => {
      if (e.startedAt && e.endedAt) return sum + (e.endedAt - e.startedAt);
      return sum;
    }, 0);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthWorkouts = entries.filter(([date]) => new Date(date) >= monthStart);
    const monthSets = monthWorkouts.reduce((sum, [, e]) => {
      return sum + Object.values(e.exercises || {}).reduce((s, sets) => s + sets.filter(set => set.done).length, 0);
    }, 0);
    const monthVolume = monthWorkouts.reduce((sum, [, e]) => {
      return sum + Object.values(e.exercises || {}).reduce((s, sets) => {
        return s + sets.filter(set => set.done).reduce((v, set) => v + (parseFloat(set.kg) || 0) * (parseInt(set.reps) || 0), 0);
      }, 0);
    }, 0);

    // Streak (consecutive weeks with at least 1 workout)
    let streak = 0;
    let checkDate = new Date(weekStart);
    while (true) {
      const wStart = new Date(checkDate);
      const wEnd = new Date(wStart);
      wEnd.setDate(wEnd.getDate() + 7);
      const hasWorkout = entries.some(([date]) => {
        const d = new Date(date);
        return d >= wStart && d < wEnd;
      });
      if (hasWorkout) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 7);
      } else {
        break;
      }
    }

    // Volume by muscle group
    const muscleVolume = {};
    entries.forEach(([, entry]) => {
      const day = workoutDays.find(d => d.id === entry.day);
      if (!day) return;
      Object.entries(entry.exercises || {}).forEach(([exN, sets]) => {
        const ex = day.exercises.find(e => e.n === parseInt(exN));
        if (!ex) return;
        const vol = sets.filter(s => s.done).reduce((v, s) => v + (parseFloat(s.kg) || 0) * (parseInt(s.reps) || 0), 0);
        const muscle = ex.target.split('/')[0].trim();
        muscleVolume[muscle] = (muscleVolume[muscle] || 0) + vol;
      });
    });

    const muscleEntries = Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxMuscleVol = muscleEntries.length > 0 ? muscleEntries[0][1] : 1;

    // Weight change this month
    const weightEntries = Object.entries(weightLog || {}).sort(([a], [b]) => a.localeCompare(b));
    const monthWeightEntries = weightEntries.filter(([d]) => d >= monthStart.toISOString().split('T')[0]);
    let weightDelta = null;
    if (monthWeightEntries.length >= 2) {
      const first = typeof monthWeightEntries[0][1] === 'object' ? monthWeightEntries[0][1].value : monthWeightEntries[0][1];
      const last = typeof monthWeightEntries[monthWeightEntries.length - 1][1] === 'object' ? monthWeightEntries[monthWeightEntries.length - 1][1].value : monthWeightEntries[monthWeightEntries.length - 1][1];
      weightDelta = last - first;
    }

    return {
      weekWorkouts: weekWorkouts.length,
      weekSets,
      weekVolume,
      weekDuration,
      monthWorkouts: monthWorkouts.length,
      monthSets,
      monthVolume,
      weightDelta,
      streak,
      muscleEntries,
      maxMuscleVol,
      totalWorkouts: entries.length,
    };
  }, [workoutLog, weightLog]);

  function formatDuration(ms) {
    if (!ms) return '0m';
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  function formatVolume(v) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}t`;
    return `${Math.round(v)} kg`;
  }

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-6 relative">
        <div
          className="absolute bottom-0 left-5 right-5 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <p className="font-mono text-[10px] font-semibold tracking-[4px] uppercase" style={{ color: 'var(--gold)' }}>
          Resumen
        </p>
        <h1
          className="font-display text-[34px] font-extrabold leading-tight mt-1"
          style={{
            background: 'linear-gradient(135deg, var(--text) 40%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Estadísticas
        </h1>
      </div>

      {/* This Week */}
      <div className="px-5 mb-4">
        <h3 className="font-mono text-[9px] font-bold tracking-[3px] uppercase mb-3" style={{ color: 'var(--text3)' }}>
          Esta Semana
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Entrenamientos', value: stats.weekWorkouts, accent: 'var(--gold)' },
            { label: 'Series', value: stats.weekSets, accent: 'var(--cyan)' },
            { label: 'Volumen', value: formatVolume(stats.weekVolume), accent: 'var(--prot)' },
            { label: 'Duración', value: formatDuration(stats.weekDuration), accent: 'var(--carb)' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl border p-3.5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="font-mono text-[8px] font-semibold tracking-[2px] uppercase mb-1" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
              <p className="font-mono text-[22px] font-bold" style={{ color: s.accent }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* This Month */}
      <div className="px-5 mb-4">
        <h3 className="font-mono text-[9px] font-bold tracking-[3px] uppercase mb-3" style={{ color: 'var(--text3)' }}>
          Este Mes
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Entrenamientos', value: stats.monthWorkouts },
            { label: 'Series', value: stats.monthSets },
            { label: 'Volumen', value: formatVolume(stats.monthVolume) },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl border p-3"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <p className="font-mono text-[8px] font-semibold tracking-[2px] uppercase mb-1" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
              <p className="font-mono text-[18px] font-bold" style={{ color: 'var(--gold)' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
        {stats.weightDelta !== null && (
          <div
            className="mt-2 rounded-xl border p-3 flex items-center justify-between"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <span className="font-mono text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text3)' }}>
              Cambio Peso
            </span>
            <span
              className="font-mono text-[14px] font-bold"
              style={{ color: Math.abs(stats.weightDelta) <= 1 ? 'var(--green)' : '#F59E0B' }}
            >
              {stats.weightDelta > 0 ? '+' : ''}{stats.weightDelta.toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="px-5 mb-4">
        <div
          className="rounded-xl border p-4 flex items-center justify-between"
          style={{ background: 'var(--card)', borderColor: 'var(--border-gold)' }}
        >
          <div>
            <p className="font-mono text-[9px] font-bold tracking-[3px] uppercase" style={{ color: 'var(--text3)' }}>
              Racha Semanal
            </p>
            <p className="font-mono text-[11px] mt-1" style={{ color: 'var(--text2)' }}>
              Semanas consecutivas entrenando
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[28px] font-bold" style={{ color: 'var(--gold)' }}>
              {stats.streak}
            </span>
            <span className="font-mono text-[11px] ml-1" style={{ color: 'var(--text3)' }}>sem</span>
          </div>
        </div>
      </div>

      {/* Volume by muscle */}
      {stats.muscleEntries.length > 0 && (
        <div className="px-5 mb-4">
          <h3 className="font-mono text-[9px] font-bold tracking-[3px] uppercase mb-3" style={{ color: 'var(--text3)' }}>
            Volumen por Músculo
          </h3>
          <div
            className="rounded-xl border p-4 flex flex-col gap-2.5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {stats.muscleEntries.map(([muscle, vol]) => (
              <div key={muscle}>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px] font-medium" style={{ color: 'var(--text2)' }}>
                    {muscle}
                  </span>
                  <span className="font-mono text-[10px] font-semibold" style={{ color: 'var(--text3)' }}>
                    {formatVolume(vol)}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(vol / stats.maxMuscleVol) * 100}%`,
                      background: 'linear-gradient(90deg, var(--gold), var(--gold2))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 px-5">
        <p className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
          {stats.totalWorkouts} entrenamientos totales registrados
        </p>
      </div>
    </div>
  );
}
