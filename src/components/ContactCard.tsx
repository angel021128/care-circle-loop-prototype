import { Patient } from '../data';

export default function ContactCard({ patient }: { patient: Patient }) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Who to Contact</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Patient-facing guide · {patient.name} · Last updated: {patient.circleOfCare[0]?.lastVerified}
            </div>
          </div>
          <div className="tag tag-blue">Paper + Electronic</div>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
          "If this happens → call this person." Keep it simple. If you're not sure who to call,
          always call your Care Manager first.
        </div>

        {patient.contactCard.map((row, i) => (
          <div key={i} className="contact-row">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning)', marginBottom: 2 }}>
                IF
              </div>
              <div className="trigger">{row.trigger}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>
                → CALL
              </div>
              <div className="action">{row.contact}{row.phone ? ` · ${row.phone}` : ''}</div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 16,
          padding: 12,
          background: 'var(--success-light)',
          borderRadius: 8,
          fontSize: 13,
          border: '1px solid #c6f6d5',
        }}>
          <strong>Your Care Manager:</strong> {patient.careManager} · Available M–F 9:00–17:00
          <br />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            If you ever feel unsure, just call this number. We coordinate everything for you.
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Provider QR Card (Future)</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div className="qr-placeholder">QR<br />CODE</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              "You're part of {patient.name}'s care team"
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              This QR code can be shown by the patient to any provider or service.
              It confirms: <em>yes, this patient has a Care Manager at Southlake IPCT,
              and here's who they are and how to reach them.</em>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              Scanning the QR = implicit consent for basic info sharing (name, CM contact).
              Full clinical notes still require explicit consent.
            </div>
          </div>
        </div>
        <div className="footnote">
          QR delivery is a future consideration per Miro D2 section 09. Not yet confirmed in the workflow.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Print / Send Options</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">📄 Print</button>
          <button className="btn">✉️ Email to Patient</button>
          <button className="btn">📱 Send to Phone</button>
          <button className="btn btn-primary">🔄 Regenerate</button>
        </div>
      </div>
    </div>
  );
}
