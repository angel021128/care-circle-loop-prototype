import { Patient } from '../data';

export default function CircleOfCare({ patient }: { patient: Patient }) {
  const active = patient.circleOfCare.filter(c => c.status === 'active');
  const historical = patient.circleOfCare.filter(c => c.status === 'historical');
  const awaiting = patient.circleOfCare.filter(c => c.status === 'awaiting');

  // Build SVG hub-spoke
  const cx = 200, cy = 180;
  const radius = 120;
  const total = patient.circleOfCare.length;

  const positions = patient.circleOfCare.map((_, i) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const statusColor = (s: string) =>
    s === 'active' ? '#38a169' : s === 'awaiting' ? '#d69e2e' : '#a0aec0';

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#38a169' }}>{active.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#d69e2e' }}>{awaiting.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Awaiting</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#a0aec0' }}>{historical.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Historical</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>{total}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total</div>
        </div>
      </div>

      {/* SVG hub-and-spoke */}
      <div className="card">
        <div className="card-title">Care Circle — {patient.name}</div>
        <svg className="care-circle-svg" viewBox="0 0 400 360">
          {/* Center node */}
          <circle cx={cx} cy={cy} r={52} fill="#ebf8ff" stroke="#3182ce" strokeWidth={2} />
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1a202c">
            {patient.name}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize={11} fill="#718096">
            Goals & Needs
          </text>

          {/* Spokes */}
          {patient.circleOfCare.map((c, i) => {
            const pos = positions[i];
            return (
              <g key={c.id}>
                <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  stroke={statusColor(c.status)} strokeWidth={c.status === 'active' ? 2 : 1}
                  strokeDasharray={c.status === 'historical' ? '4,4' : undefined}
                  opacity={0.6}
                />
                <circle cx={pos.x} cy={pos.y} r={34}
                  fill="white" stroke={statusColor(c.status)} strokeWidth={2}
                />
                <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1a202c">
                  {c.role.length > 14 ? c.role.slice(0, 12) + '…' : c.role}
                </text>
                <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize={10} fill="#718096">
                  {c.name.length > 14 ? c.name.slice(0, 12) + '…' : c.name}
                </text>
                <circle cx={pos.x + 24} cy={pos.y - 24} r={4} fill={statusColor(c.status)} />
              </g>
            );
          })}
        </svg>

        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span><span className="dot dot-done" style={{ display: 'inline-block', marginRight: 4 }} />Active</span>
          <span><span className="dot" style={{ display: 'inline-block', background: '#d69e2e', marginRight: 4 }} />Awaiting</span>
          <span><span className="dot" style={{ display: 'inline-block', background: '#a0aec0', marginRight: 4 }} />Historical</span>
        </div>
      </div>

      {/* Detail list */}
      <div className="card">
        <div className="card-title">Members & Responsibilities</div>
        {patient.circleOfCare.map(c => (
          <div key={c.id} className="info-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 140 }}>
              <span className={`tag ${c.status === 'active' ? 'tag-green' : c.status === 'awaiting' ? 'tag-amber' : 'tag-gray'}`}>
                {c.status.toUpperCase()}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.organization}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.role}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{c.responsibility}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Last verified: {c.lastVerified} · Update owner: {c.updateOwner}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        Care circle reflects patient-reported information (Sept 17 meeting) plus care plan entries.
        Awaiting = designated but not yet active. Historical = previously involved, no current duty.
        "Last verified" dates are synthetic for demo purposes.
      </div>
    </div>
  );
}
