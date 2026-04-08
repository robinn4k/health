import { useState, useEffect } from 'react';
import NutritionTab from './components/NutritionTab';
import WorkoutTab from './components/WorkoutTab';

const STORAGE_KEY = 'plan_fitness_v1';

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

export default function App() {
  const [tab, setTab] = useState('nutrition');
  const [isTraining, setIsTraining] = useState(true);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [openCards, setOpenCards] = useState([]);

  // Load on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setIsTraining(saved.isTraining ?? true);
      setSelectedSnacks(saved.selectedSnacks ?? []);
      setOpenCards(saved.openCards ?? []);
    }
  }, []);

  // Save on change
  useEffect(() => {
    saveState({ isTraining, selectedSnacks, openCards });
  }, [isTraining, selectedSnacks, openCards]);

  function handleReset() {
    setIsTraining(true);
    setSelectedSnacks([]);
    setOpenCards([]);
    localStorage.removeItem(STORAGE_KEY);
  }

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
          />
        ) : (
          <WorkoutTab />
        )}
      </div>

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
