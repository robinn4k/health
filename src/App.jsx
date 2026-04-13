import { useState, useEffect } from 'react';
import NutritionTab from './components/NutritionTab';
import WorkoutTab from './components/WorkoutTab';

const STORAGE_KEY = 'plan_fitness_v1';
const WORKOUT_LOG_KEY = 'workout_log';
const NOTES_KEY = 'plan_fitness_notes';

function getToday() {
  return new Date().toDateString();
}

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

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {}
}

export function getLastWeight(log, dayId, exerciseN) {
  const dates = Object.keys(log).sort().reverse();
  for (const date of dates) {
    const entry = log[date];
    if (entry.day === dayId && entry.exercises[exerciseN]) {
      const sets = entry.exercises[exerciseN];
      const lastWithKg = sets.find(s => s.kg > 0);
      if (lastWithKg) return lastWithKg.kg;
    }
  }
  return null;
}

export default function App() {
  const [tab, setTab] = useState('nutrition');
  const [isTraining, setIsTraining] = useState(true);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [activeDay, setActiveDay] = useState('push');
  const [workoutLog, setWorkoutLog] = useState({});
  const [notes, setNotes] = useState({});

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
    setNotes(loadNotes());
  }, []);

  // Save daily state on change
  useEffect(() => {
    saveState({ isTraining, selectedSnacks, openCards, activeDay });
  }, [isTraining, selectedSnacks, openCards, activeDay]);

  // Save workout log on change
  useEffect(() => {
    saveWorkoutLog(workoutLog);
  }, [workoutLog]);

  // Save notes on change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

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

  function updateNote(key, text) {
    setNotes(prev => {
      if (!text.trim()) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: text };
    });
  }

  function updateExerciseSets(exerciseN, sets) {
    const today = getToday();
    setWorkoutLog(prev => ({
      ...prev,
      [today]: {
        day: activeDay,
        exercises: {
          ...(prev[today]?.exercises || {}),
          [exerciseN]: sets,
        },
      },
    }));
  }

  return (
    <div className="relative z-[1] w-full max-w-[640px] mx-auto min-h-dvh flex flex-col safe-top">
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
            notes={notes}
            updateNote={updateNote}
            onReset={handleReset}
          />
        ) : (
          <WorkoutTab
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            workoutLog={workoutLog}
            todaySets={workoutLog[getToday()]?.exercises || {}}
            updateExerciseSets={updateExerciseSets}
            notes={notes}
            updateNote={updateNote}
            onReset={handleWorkoutReset}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="max-w-[640px] mx-auto">
          <div
            className="flex mx-3 mb-2 rounded-2xl border overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(15,15,22,0.92)',
              borderColor: 'var(--border)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={() => setTab('nutrition')}
              className="flex-1 py-3.5 flex flex-col items-center gap-1 transition-all duration-300"
              style={{ color: tab === 'nutrition' ? 'var(--gold)' : 'var(--text3)' }}
            >
              <span className="text-lg">🍽️</span>
              <span className="font-mono text-[10px] font-semibold tracking-wider">
                NUTRICIÓN
              </span>
            </button>
            <div className="w-px my-3" style={{ background: 'var(--border)' }} />
            <button
              onClick={() => setTab('workout')}
              className="flex-1 py-3.5 flex flex-col items-center gap-1 transition-all duration-300"
              style={{ color: tab === 'workout' ? 'var(--gold)' : 'var(--text3)' }}
            >
              <span className="text-lg">🏋️</span>
              <span className="font-mono text-[10px] font-semibold tracking-wider">
                ENTRENO
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
