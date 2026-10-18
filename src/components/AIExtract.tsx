import { useState, useEffect } from 'react';
import { Patient } from '../data';

export default function AIExtract({ patient }: { patient: Patient }) {
  const [phase, setPhase] = useState<'idle' | 'processing' | 'done'>('idle');

  const startExtraction = () => {
    setPhase('processing');
    setTimeout(() => setPhase('done'), 1800);
  };

  const confirmed = patient.extracted.filter(e => e.confidence === 'confirmed');
  const uncertain = patient.extracted.filter(e => e.confidence === 'uncertain');

  return (
    <div>
      {/* Transcript */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Recorded Conversation</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {patient.name} — Care Manager check-in · Synthetic transcript (anonymized from Sept 17 meeting)
            </div>
          </div>
        </div>

        <div className="transcript-box">
          {patient.transcript.map((seg, i) => (
            <p key={i} style={{ marginBottom: 8 }}>
              <span className="speaker">{seg.speaker}:</span>{' '}
              {seg.text.split(/(\[|\])/).map((part, j) => (
                seg.highlights.includes(part)
                  ? <span key={j} className="highlight">{part}</span>
                  : <span key={j}>{part}</span>
              ))}
            </p>
          ))}
        </div>

        {phase === 'idle' && (
          <div className="action-bar">
            <button className="btn btn-primary" onClick={startExtraction}>
              Run AI Extraction
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
              Extracts providers, services, and flagged uncertainties
            </span>
          </div>
        )}

        {phase === 'processing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0' }}>
            <div className="spinner" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Extracting entities…</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Parsing transcript · Identifying providers · Flagging uncertainties
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {phase === 'done' && (
        <>
          <div className="card">
            <div className="card-title">Extracted Fields</div>

            {uncertain.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)', marginBottom: 8 }}>
                  ⚠ Needs Care Manager Review ({uncertain.length} uncertain)
                </div>
                {uncertain.map((e, i) => (
                  <div key={i} className="extract-item uncertain">
                    <span className="tag tag-amber">{e.field}</span>
                    <span className="value">{e.value}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                      {e.source}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', marginBottom: 8 }}>
                ✓ Confirmed ({confirmed.length} items)
              </div>
              {confirmed.map((e, i) => (
                <div key={i} className="extract-item confirmed">
                  <span className="tag tag-blue">{e.field}</span>
                  <span className="value">{e.value}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {e.source}
                  </span>
                </div>
              ))}
            </div>

            <div className="footnote">
              Extraction is deterministic for demo purposes. In production, this would use NER +
              context-aware LLM with confidence scoring. Uncertain items must be confirmed by
              the Care Manager before entering the care plan.
            </div>
          </div>

          <div className="card">
            <div className="card-title">Circle of Care — After Extraction</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Items below would be added or updated in the circle of care view based on extraction results:
            </div>
            {uncertain.map((e, i) => (
              <div key={i} style={{
                padding: '8px 12px',
                background: 'var(--warning-light)',
                border: '1px solid #fefcbf',
                borderRadius: 6,
                marginBottom: 6,
                fontSize: 13,
              }}>
                <strong style={{ color: 'var(--warning)' }}>? {e.field}:</strong> {e.value}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Source: {e.source} — pending CM confirmation
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
