import { Patient } from '../data';

const statusMap = {
  'received': { color: 'var(--accent)', label: 'Received' },
  'in-progress': { color: 'var(--warning)', label: 'In Progress' },
  'closed': { color: 'var(--success)', label: 'Closed' },
} as const;

const serviceMap = {
  'connected': { color: 'var(--success)', label: 'Connected' },
  'waiting': { color: 'var(--warning)', label: 'Waiting' },
  'declined': { color: 'var(--danger)', label: 'Declined' },
  'in-progress': { color: 'var(--warning)', label: 'In Progress' },
  'not-started': { color: 'var(--neutral)', label: 'Not Started' },
} as const;

const needMap = {
  'met': { color: 'var(--success)', label: 'Met ✓' },
  'partial': { color: 'var(--warning)', label: 'Partial' },
  'unmet': { color: 'var(--danger)', label: 'Unmet' },
  'in-progress': { color: 'var(--accent)', label: 'In Progress' },
} as const;

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 12, fontWeight: 500, color }}>{label}</span>
    </div>
  );
}

export default function HandoffLoop({ patient }: { patient: Patient }) {
  const hasExceptions = patient.handoffs.some(h => h.exception);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Navigator Handoff Loop</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Care Manager → CHR Tasks → {patient.navigator.split('(')[0].trim()}
              · Three distinct outcomes tracked separately
            </div>
          </div>
          <div className="tag tag-blue">CHR Tasks Channel</div>
        </div>

        <div style={{
          padding: '10px 12px',
          background: 'var(--accent-light)',
          borderRadius: 6,
          fontSize: 13,
          marginBottom: 16,
          border: '1px solid #bee3f8',
        }}>
          <strong>Key principle:</strong> Task complete ≠ service connected ≠ need resolved.
          Each layer is tracked independently. (Miro D2 §08)
        </div>

        {patient.handoffs.map(h => (
          <div key={h.id} className="track" style={{ flexWrap: 'wrap' }}>
            <div className="track-label">
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{h.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.owner}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated: {h.updated}</div>
            </div>

            <div className="track-content">
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <StatusDot {...statusMap[h.taskStatus]} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Task</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <StatusDot {...serviceMap[h.serviceStatus]} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Service</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <StatusDot {...needMap[h.needStatus]} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Need</span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{h.detail}</div>
            </div>
          </div>
        ))}

        <div className="footnote">
          Task/Service/Need separation per Miro D2 §08: "Task completion, service connection and
          need resolution are distinct outcomes."
        </div>
      </div>

      {hasExceptions && (
        <div className="card">
          <div className="card-title">⚠ Active Exceptions</div>
          {patient.handoffs.filter(h => h.exception).map(h => (
            <div key={h.id} className="exception-box">
              <div className="title">
                {h.exception!.type} — {h.title}
              </div>
              <div style={{ marginBottom: 4 }}>{h.exception!.description}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)' }}>
                Next step: {h.exception!.nextStep}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-title">Loop Closure Status</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {(() => {
            const total = patient.handoffs.length;
            const closed = patient.handoffs.filter(h => h.taskStatus === 'closed').length;
            const met = patient.handoffs.filter(h => h.needStatus === 'met').length;
            const pct = total ? Math.round((met / total) * 100) : 0;
            return (
              <>
                <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Needs resolved</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{closed}/{total}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tasks closed</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--warning)' }}>
                    {patient.handoffs.filter(h => h.exception).length}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Exceptions</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
