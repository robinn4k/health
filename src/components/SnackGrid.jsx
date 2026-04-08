import { snackOptions } from '../data/meals';

export default function SnackGrid({ meal, isTraining, selectedSnacks, setSelectedSnacks, isOpen, onToggle, index }) {
  function handleSelect(id) {
    if (!isTraining && snackOptions.find(s => s.id === id)?.disableOnRest) return;

    setSelectedSnacks(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 2) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-[350ms]"
      style={{
        background: isOpen ? 'var(--card-up)' : 'var(--card)',
        borderColor: isOpen ? 'var(--border-gold)' : 'var(--border)',
        boxShadow: isOpen ? '0 4px 30px rgba(0,0,0,0.3), 0 0 0 1px var(--border-gold)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(234,179,8,0.12))' }}
          >
            🥜
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">Snacks</h3>
            <p className="font-mono text-[10.5px] mt-0.5" style={{ color: 'var(--text3)' }}>Elige 2 por tarde</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: 'var(--gold)', background: 'var(--gold-dim)' }}>
            ~450
          </span>
          <span className="text-xs transition-transform duration-300" style={{ color: isOpen ? 'var(--gold)' : 'var(--text3)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
            ▾
          </span>
        </div>
      </div>

      <div className="overflow-hidden transition-[max-height] duration-[450ms]" style={{ maxHeight: isOpen ? '1000px' : '0' }}>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {snackOptions.map(snack => {
              const disabled = !isTraining && snack.disableOnRest;
              const picked = selectedSnacks.includes(snack.id);
              return (
                <div
                  key={snack.id}
                  onClick={() => handleSelect(snack.id)}
                  className="p-2.5 rounded-xl border cursor-pointer transition-all duration-200 select-none relative overflow-hidden"
                  style={{
                    background: picked ? 'var(--card-glow, rgba(212,175,55,0.04))' : 'rgba(255,255,255,0.015)',
                    borderColor: picked ? 'var(--border-gold-hi)' : 'var(--border)',
                    opacity: disabled ? 0.15 : 1,
                    pointerEvents: disabled ? 'none' : 'auto',
                    filter: disabled ? 'grayscale(0.6)' : 'none',
                  }}
                >
                  <div className="font-mono text-[10px] font-bold tracking-[1.2px] mb-0.5" style={{ color: 'var(--gold)' }}>
                    {snack.id}
                  </div>
                  <div className="text-[12.5px] font-medium leading-tight">{snack.name}</div>
                  <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--text3)' }}>{snack.detail}</div>
                </div>
              );
            })}
            <div className="col-span-2 text-center text-[10.5px] italic py-1" style={{ color: 'var(--text3)' }}>
              Toca 2 para marcar tus snacks del día
            </div>
          </div>

          <div className="flex gap-3 mt-3.5 px-3.5 py-2.5 rounded-xl border" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--carb)' }} /> 50C
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--prot)' }} /> 25P
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--fat)' }} /> 20G
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
