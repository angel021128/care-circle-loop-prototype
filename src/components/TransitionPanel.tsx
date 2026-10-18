import { Patient } from '../data';

export default function TransitionPanel({ patient }: { patient: Patient }) {
  const t = patient.transition;
  const pct = t.goalsTotal ? Math.round((t.goalsMet / t.goalsTotal) * 100) : 0;

  const statusColor =
    patient.status === 'unmanaged' ? 'var(--warning)' :
    patient.status === 'managed' ? 'var(--success)' :
    'var(--accent)';

  return (
    <div>
      {/* Status banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 8,
        background: `color-mix(in srgb, ${statusColor} 10%, white)`,
        border: `1px solid ${statusColor}`,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Status
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: statusColor }}>
              {t.currentStatus}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Next check-in</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t.nextCheckin}</div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card">
        <div className="card-title">Goal Progress</div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>{t.goalsMet} of {t.goalsTotal} goals met</span>
            <span style={{ fontWeight: 600, color: pct === 100 ? 'var(--success)' : 'var(--warning)' }}>
              {pct}%
            </span>
          </div>
          <div className="meter">
            <div
              className="meter-fill"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--warning)',
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{t.note}</div>
        </div>
      </div>

      {/* Stable indicator */}
      <div className="card">
        <div className="card-title">Stability Indicator</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.stableDays > 0 ? 'var(--success)' : 'var(--text)' }}>
              {t.stableDays}d
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Days stable (no escalation)</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.pcpInformed ? 'var(--success)' : 'var(--danger)' }}>
              {t.pcpInformed ? '✓' : '✗'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>PCP informed</div>
          </div>
        </div>
      </div>

      {/* Transition preview */}
      {patient.status === 'unmanaged' && (
        <div className="card">
          <div className="card-title">When Ready → Managed</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>
              <strong>Deactivate (not discharge).</strong> When goals are met and the patient is stable:
            </p>
            <ul style={{ fontSize: 13, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>Active CM involvement ends</li>
              <li>Routine care returns to PCP — PCP owns follow-up cadence</li>
              <li>6-month IPCT check-in scheduled</li>
              <li>Patient remains on advanced-needs registry</li>
              <li>If condition changes → PCP re-refers or patient contacts IPCT → case reactivated</li>
            </ul>
            <div style={{
              marginTop: 12,
              padding: 12,
              background: 'var(--success-light)',
              borderRadius: 8,
              fontSize: 13,
              border: '1px solid #c6f6d5',
            }}>
              <strong>Key language for patient conversation:</strong>
              <br />"Your goals are met and you're doing well. I'm moving you to a lighter follow-up
              with your doctor. You're still on our list — if anything changes, just call us and
              we'll reactivate your case right away. This isn't a discharge."
            </div>
          </div>
        </div>
      )}

      {patient.status === 'managed' && (
        <div className="card">
          <div className="card-title">Currently Managed — PCP Follow-up</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>
              <strong>{patient.name} is managed.</strong> Active care management is complete.
            </p>
            <ul style={{ fontSize: 13, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>PCP owns all routine follow-up</li>
              <li>IPCT next check-in: <strong>{t.nextCheckin}</strong></li>
              <li>Patient remains on advanced-needs registry (name never removed)</li>
              <li>If condition deteriorates → PCP re-refers → case reactivated</li>
            </ul>

            <div style={{
              marginTop: 12,
              padding: 12,
              background: 'var(--neutral-light)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
              <strong>Scope note:</strong> If {patient.name} presents at Southlake years from now,
              the hospital sees she's on the registry. They contact PCP first, not the previous
              Care Manager. Reactivation requires a new referral or IPCT trigger.
            </div>
          </div>
        </div>
      )}

      {patient.status === 'in-transition' && (
        <div className="card">
          <div className="card-title">Reverse Transition — Hospital → PCP/IPCT</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 16,
            }}>
              <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>
                  {t.goalsMet}/{t.goalsTotal}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Post-discharge goals met</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--neutral-light)', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--danger)' }}>
                  {patient.handoffs.filter(h => h.exception).length}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Blocking gaps</div>
              </div>
            </div>

            <div style={{
              padding: 12,
              background: 'var(--danger-light)',
              borderRadius: 8,
              fontSize: 13,
              border: '1px solid #fed7d7',
            }}>
              <strong>⚠ Cannot transition yet.</strong>
              {patient.handoffs.filter(h => h.exception).map((h, i) => (
                <div key={i} style={{ marginTop: 4 }}>
                  • {h.title}: {h.exception!.description}
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                All gaps must be addressed before {patient.name} can move to Managed status.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caseload note */}
      <div className="card">
        <div className="card-title">Caseload Note</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <strong>Deactivation ≠ removal from list.</strong>
          {' '}Per Matt's direction (Sept 17 meeting): once {patient.name} is on the advanced-needs
          registry, the name stays. Only two exits: the patient moves or passes. The registry
          maintains awareness; the caseload is protected by deactivating managed patients from
          active CM assignment.
        </div>
      </div>
    </div>
  );
}
