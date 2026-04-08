export default function DayToggle({ isTraining, setIsTraining }) {
  return (
    <div>
      <div className="px-5 pt-4 pb-1">
        <div
          className="flex rounded-[14px] p-1 relative border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          {/* Slider */}
          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-[11px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.1,1)]"
            style={{
              width: 'calc(50% - 4px)',
              background: isTraining ? 'var(--gold)' : 'var(--rest)',
              transform: isTraining ? 'translateX(0)' : 'translateX(100%)',
              boxShadow: isTraining
                ? '0 0 20px rgba(212,175,55,0.3)'
                : '0 0 20px rgba(167,139,250,0.3)',
            }}
          />
          <button
            onClick={() => setIsTraining(true)}
            className="flex-1 text-center py-3 font-mono text-[11px] font-semibold tracking-wider rounded-[11px] relative z-[2] transition-colors duration-300"
            style={{ color: isTraining ? 'var(--bg)' : 'var(--text3)' }}
          >
            🏋️ ENTRENO
          </button>
          <button
            onClick={() => setIsTraining(false)}
            className="flex-1 text-center py-3 font-mono text-[11px] font-semibold tracking-wider rounded-[11px] relative z-[2] transition-colors duration-300"
            style={{ color: !isTraining ? 'var(--bg)' : 'var(--text3)' }}
          >
            🛌 DESCANSO
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="mx-5 mt-2.5 mb-1.5 px-4 py-2.5 rounded-xl font-mono text-[11px] font-medium tracking-wide flex items-center gap-2 border transition-all duration-300"
        style={{
          background: isTraining ? 'var(--gold-glow)' : 'var(--rest-bg)',
          color: isTraining ? 'var(--gold)' : 'var(--rest)',
          borderColor: isTraining ? 'rgba(212,175,55,0.1)' : 'rgba(167,139,250,0.1)',
        }}
      >
        <span>{isTraining ? '⚡ Todas las comidas + 2 snacks' : '🛌 Sin snack C ni pre-sueño (−400 kcal)'}</span>
        <span className="ml-auto font-bold text-xs">
          {isTraining ? '2 700 kcal' : '2 300 kcal'}
        </span>
      </div>
    </div>
  );
}
