import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Customized } from 'recharts';

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      {payload.map((e) => (
        <p key={e.dataKey} className="text-[12px] font-semibold" style={{ color: e.color }}>
          {e.name}: {e.value?.toFixed(1)} Jahre
        </p>
      ))}
    </div>
  );
}

function DotWithLabel({ cx, cy, value, fill }) {
  if (!cx || !cy || value == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      <text x={cx} y={cy - 10} textAnchor="middle" fill={fill} fontSize={10} fontWeight={600}>
        {value.toFixed(1)}
      </text>
    </g>
  );
}

function ColoredArea({ formattedGraphicalItems }) {
  if (!formattedGraphicalItems || formattedGraphicalItems.length < 2) return null;

  const chronoLine = formattedGraphicalItems.find(item => item.props?.dataKey === 'chrono');
  const bioLine = formattedGraphicalItems.find(item => item.props?.dataKey === 'bio');
  if (!chronoLine || !bioLine) return null;

  const chronoPoints = chronoLine.props.points?.filter(p => p.x != null && p.y != null) || [];
  const bioPoints = bioLine.props.points?.filter(p => p.x != null && p.y != null) || [];

  if (chronoPoints.length < 2 || bioPoints.length < 2) return null;

  // Build segments between consecutive data points
  const segments = [];
  const len = Math.min(chronoPoints.length, bioPoints.length);
  for (let i = 0; i < len - 1; i++) {
    const bioYounger = bioPoints[i].y > chronoPoints[i].y || bioPoints[i + 1].y > chronoPoints[i + 1].y;
    // In chart coordinates, higher y = lower value, so bio.y > chrono.y means bio < chrono (younger)
    const color = bioYounger ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.12)';
    const d = `M${bioPoints[i].x},${bioPoints[i].y} L${bioPoints[i + 1].x},${bioPoints[i + 1].y} L${chronoPoints[i + 1].x},${chronoPoints[i + 1].y} L${chronoPoints[i].x},${chronoPoints[i].y} Z`;
    segments.push(<path key={i} d={d} fill={color} />);
  }

  return <g>{segments}</g>;
}

export default function TimelineChart({ history, projection, dark }) {
  const data = history.map((h) => ({
    label: new Date(h.date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }),
    bio: h.bioAge,
    chrono: h.chronoAge,
  }));

  if (projection && projection.bioAgeChange !== 0) {
    const last = history[history.length - 1];
    // Add the last real data point as the start of the projection line
    data[data.length - 1].proj = last.bioAge;
    data.push({
      label: 'Ziel',
      bio: null,
      chrono: null,
      proj: +(last.bioAge + projection.bioAgeChange).toFixed(1),
    });
  }

  const bioColor = dark ? '#30D158' : '#007AFF';
  const chronoColor = dark ? '#8E8E93' : '#AEAEB2';

  return (
    <div className="card p-5 animate-in-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Verlauf</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">Alter in Jahren</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 16, right: 12, left: -16, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: dark ? '#636366' : '#AEAEB2' }} axisLine={false} tickLine={false} />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11, fill: dark ? '#636366' : '#AEAEB2' }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} />

          <Customized component={ColoredArea} />

          {/* Chrono age line - more visible */}
          <Line
            type="monotone"
            dataKey="chrono"
            stroke={chronoColor}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            name="Chronologisch"
          />

          {/* Bio age line */}
          <Line
            type="monotone"
            dataKey="bio"
            stroke={bioColor}
            strokeWidth={2.5}
            dot={<DotWithLabel fill={bioColor} />}
            activeDot={{ r: 5, fill: bioColor, stroke: dark ? '#000' : '#fff', strokeWidth: 2 }}
            name="Biologisch"
          />

          {/* Projection - connects to last data point */}
          {projection && projection.bioAgeChange !== 0 && (
            <Line
              type="monotone"
              dataKey="proj"
              stroke="#34C759"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={<DotWithLabel fill="#34C759" />}
              connectNulls={false}
              name="Projektion"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] rounded" style={{ background: bioColor }} /> Biologisch
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] rounded border-b border-dashed" style={{ borderColor: chronoColor }} /> Chronologisch
        </span>
      </div>
    </div>
  );
}
