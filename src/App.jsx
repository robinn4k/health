import { useState, useEffect } from 'react';
import NutritionTab from './components/NutritionTab';
import WorkoutTab from './components/WorkoutTab';
import StatsTab from './components/StatsTab';
import RestTimer from './components/RestTimer';
import { useFirestoreSync, saveToFirestore, saveDailyState } from './hooks/useFirestore';

const STORAGE_KEY = 'plan_fitness_v1';
const WORKOUT_LOG_KEY = 'workout_log';
const WEIGHT_LOG_KEY = 'body_weight_log';

function getToday() {
  return new Date().toDateString();
}

// --- localStorage helpers ---

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.date === getToday()) return s;
    }
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, date: getToday() }));
  } catch {}
}

function loadWorkoutLog() {
  try {
    const raw = localStorage.getItem(WORKOUT_LOG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveWorkoutLog(log) {
  try {
    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(log));
  } catch {}
}

function loadWeightLog() {
  try {
    const raw = localStorage.getItem(WEIGHT_LOG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveWeightLog(log) {
  try {
    localStorage.setItem(WEIGHT_LOG_KEY, JSON.stringify(log));
  } catch {}
}

export function getLastWeight(log, dayId, exerciseN) {
  const today = getToday();
  const dates = Object.keys(log).sort().reverse();
  for (const date of dates) {
    if (date === today) continue;
    const entry = log[date];
    if (entry.day === dayId && entry.exercises[exerciseN]) {
      const sets = entry.exercises[exerciseN];
      const lastWithKg = sets.find(s => s.kg > 0);
      if (lastWithKg) return lastWithKg.kg;
    }
  }
  return null;
}

export default function App({ user }) {
  const uid = user?.uid;

  // Daily state (resets each day)
  const [tab, setTab] = useState('nutrition');
  const [isTraining, setIsTraining] = useState(true);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [activeDay, setActiveDay] = useState('push');

  // Persistent state
  const [workoutLog, setWorkoutLog] = useState({});
  const [weightLog, setWeightLog] = useState({});

  // Rest timer (ephemeral)
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(90);
  const [restDuration, setRestDuration] = useState(90);

  // Firebase sync
  useFirestoreSync(uid);

  // Load on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setIsTraining(saved.isTraining ?? true);
      setSelectedSnacks(saved.selectedSnacks ?? []);
      setOpenCards(saved.openCards ?? []);
      setActiveDay(saved.activeDay ?? 'push');
    }
    setWorkoutLog(loadWorkoutLog());
    setWeightLog(loadWeightLog());
  }, []);

  // Save daily state
  useEffect(() => {
    const data = { isTraining, selectedSnacks, openCards, activeDay };
    saveState(data);
    saveDailyState(uid, { ...data, date: getToday() });
  }, [isTraining, selectedSnacks, openCards, activeDay, uid]);

  // Save workout log
  useEffect(() => {
    if (Object.keys(workoutLog).length > 0) {
      saveWorkoutLog(workoutLog);
    }
  }, [workoutLog]);

  // Save weight log
  useEffect(() => {
    if (Object.keys(weightLog).length > 0) {
      saveWeightLog(weightLog);
    }
  }, [weightLog]);

  function handleReset() {
    setIsTraining(true);
    setSelectedSnacks([]);
    setOpenCards([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function handleWorkoutReset() {
    const today = getToday();
    setWorkoutLog(prev => {
      const next = { ...prev };
      delete next[today];
      return next;
    });
  }

  function updateExerciseSets(exerciseN, sets) {
    const today = getToday();
    setWorkoutLog(prev => {
      const todayEntry = prev[today] || { day: activeDay, exercises: {} };
      const hasDoneSet = sets.some(s => s.done);

      const updated = {
        ...prev,
        [today]: {
          ...todayEntry,
          day: activeDay,
          startedAt: todayEntry.startedAt || (hasDoneSet ? Date.now() : null),
          endedAt: hasDoneSet ? Date.now() : todayEntry.endedAt,
          exercises: {
            ...todayEntry.exercises,
            [exerciseN]: sets,
          },
        },
      };

      // Sync to Firestore
      saveToFirestore(uid, 'workoutLog', today, updated[today]);
      return updated;
    });
  }

  function startTimer() {
    setTimerRemaining(restDuration);
    setTimerActive(true);
  }

  function saveWeight(value) {
    const dateKey = new Date().toISOString().split('T')[0];
    setWeightLog(prev => {
      const updated = { ...prev, [dateKey]: value };
      saveWeightLog(updated);
      saveToFirestore(uid, 'bodyWeight', dateKey, { value });
      return updated;
    });
  }

  const todaySets = workoutLog[getToday()]?.exercises || {};
  const todayEntry = workoutLog[getToday()];

  return (
    <div className="relative z-[1] max-w-[430px] mx-auto min-h-dvh flex flex-col safe-top">
      {/* Content */}
      <div className="flex-1 pb-24">
        {tab === 'nutrition' ? (
          <NutritionTab
            isTraining={isTraining}
            setIsTraining={setIsTraining}
            selectedSnacks={selectedSnacks}
            setSelectedSnacks={setSelectedSnacks}
            openCards={openCards}
            setOpenCards={setOpenCards}
            onReset={handleReset}
            weightLog={weightLog}
            onSaveWeight={saveWeight}
            user={user}
          />
        ) : tab === 'workout' ? (
          <WorkoutTab
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            workoutLog={workoutLog}
            todaySets={todaySets}
            todayEntry={todayEntry}
            updateExerciseSets={updateExerciseSets}
            onReset={handleWorkoutReset}
            onStartTimer={startTimer}
          />
        ) : (
          <StatsTab
            workoutLog={workoutLog}
            weightLog={weightLog}
          />
        )}
      </div>

      {/* Rest Timer */}
      {timerActive && (
        <RestTimer
          remaining={timerRemaining}
          setRemaining={setTimerRemaining}
          duration={restDuration}
          setDuration={setRestDuration}
          onClose={() => setTimerActive(false)}
        />
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="max-w-[430px] mx-auto">
          <div
            className="flex mx-3 mb-2 rounded-2xl border overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(15,15,22,0.92)',
              borderColor: 'var(--border)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
            }}
          >
            {[
              { id: 'nutrition', icon: '🍽️', label: 'NUTRICIÓN' },
              { id: 'workout', icon: '🏋️', label: 'ENTRENO' },
              { id: 'stats', icon: '📊', label: 'STATS' },
            ].map((t, i) => (
              <div key={t.id} className="contents">
                {i > 0 && <div className="w-px my-3" style={{ background: 'var(--border)' }} />}
                <button
                  onClick={() => setTab(t.id)}
                  className="flex-1 py-3.5 flex flex-col items-center gap-1 transition-all duration-300"
                  style={{ color: tab === t.id ? 'var(--gold)' : 'var(--text3)' }}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="font-mono text-[10px] font-semibold tracking-wider">
                    {t.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
