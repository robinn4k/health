export default function MacroSummary({ macros }) {
  const items = [
    { key: 'kcal', val: macros.kcal, label: 'kcal', color: 'var(--gold)' },
    { key: 'carb', val: macros.carb, label: 'carbos', color: 'var(--carb)' },
    { key: 'prot', val: macros.prot, label: 'prote', color: 'var(--prot)' },
    { key: 'fat', val: macros.fat, label: 'grasas', color: 'var(--fat)' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 px-5 py-3">
      {items.map(item => (
        <div
          key={item.key}
          className="text-center py-3 px-1.5 rounded-xl border relative overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="font-mono text-xl font-bold leading-none transition-all duration-300"
            style={{ color: item.color }}
          >
            {item.val}
          </div>
          <span
            className="text-[9px] uppercase tracking-[1.5px] mt-1.5 block font-medium"
            style={{ color: 'var(--text3)' }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
