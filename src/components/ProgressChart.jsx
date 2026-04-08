export default function ProgressChart({ data, color = 'var(--gold)', height = 160 }) {
  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border"
        style={{ height, background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <p className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>
          Necesitas al menos 2 sesiones para ver el gráfico
        </p>
      </div>
    );
  }

  const padding = { top: 20, right: 12, bottom: 30, left: 40 };
  const w = 100; // percentage-based viewBox
  const h = height;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.value - min) / range) * chartH,
  }));

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  // Gradient fill area
  const areaPath = `M ${points[0].x},${padding.top + chartH} ` +
    points.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${padding.top + chartH} Z`;

  // Y-axis labels (4 steps)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = min + (range * i) / 4;
    const y = padding.top + chartH - (i / 4) * chartH;
    return { val: Math.round(val), y };
  });

  // X-axis labels (first, middle, last)
  const xLabels = [0, Math.floor(data.length / 2), data.length - 1]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(i => ({
      label: data[i].label,
      x: points[i].x,
    }));

  const gradientId = `grad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map((l, i) => (
        <line
          key={i}
          x1={padding.left} y1={l.y}
          x2={w - padding.right} y2={l.y}
          stroke="var(--border)" strokeWidth="0.3"
        />
      ))}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r="1.5"
          fill={color}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Y-axis labels */}
      {yLabels.map((l, i) => (
        <text
          key={i}
          x={padding.left - 3}
          y={l.y + 1}
          textAnchor="end"
          fill="var(--text3)"
          fontSize="3.5"
          fontFamily="'JetBrains Mono', monospace"
        >
          {l.val}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={h - 5}
          textAnchor="middle"
          fill="var(--text3)"
          fontSize="3"
          fontFamily="'JetBrains Mono', monospace"
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}
