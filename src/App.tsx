import { useState } from 'react';
import { patients, Patient } from './data';
import CircleOfCare from './components/CircleOfCare';
import AIExtract from './components/AIExtract';
import ContactCard from './components/ContactCard';
import HandoffLoop from './components/HandoffLoop';
import TransitionPanel from './components/TransitionPanel';

type Tab = 'circle' | 'extract' | 'contact' | 'handoff' | 'transition';

const tabs: { key: Tab; label: string }[] = [
  { key: 'circle', label: 'Circle of Care' },
  { key: 'extract', label: 'AI Extract' },
  { key: 'contact', label: 'Patient Card' },
  { key: 'handoff', label: 'Navigator Loop' },
  { key: 'transition', label: 'Transition' },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const [activeTab, setActiveTab] = useState<Tab>('circle');
  const patient: Patient = patients.find(p => p.id === selectedId)!;

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          Southlake Health
        </div>
        <div className="sidebar-subtitle">
          Care Circle &amp; Loop — Prototype
        </div>

        <div className="sidebar-subtitle" style={{ marginBottom: 8 }}>
          Patients (synthetic)
        </div>

        {patients.map(p => (
          <div
            key={p.id}
            className={`patient-card ${p.id === selectedId ? 'active' : ''}`}
            onClick={() => setSelectedId(p.id)}
          >
            <div className="name">{p.name}, {p.age}</div>
            <div className="meta">{p.location} · {p.careManager.split('(')[0].trim()}</div>
            <div>
              <span className={`status-badge ${p.status === 'unmanaged' ? 'unmanaged' : p.status === 'managed' ? 'managed' : 'transition'}`}>
                {p.status === 'unmanaged' ? 'Unmanaged' : p.status === 'managed' ? 'Managed' : 'In Transition'}
              </span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div className="sidebar-subtitle" style={{ marginBottom: 8 }}>
            Active patient
          </div>
          <div className="card" style={{ padding: 12, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{patient.name}</div>
            <div style={{ color: 'var(--text-muted)' }}>{patient.summary}</div>
          </div>
          <div className="footnote" style={{ marginTop: 12 }}>
            All data is synthetic. No PHI.
            Demo built for Ivey AFP — Care Management Digital Supports.
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="section-title">{patient.name} — {patient.summary}</div>
        <div className="section-sub">
          Care Manager: {patient.careManager} &nbsp;·&nbsp; Navigator: {patient.navigator}
        </div>

        <div className="tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'circle' && <CircleOfCare patient={patient} />}
        {activeTab === 'extract' && <AIExtract patient={patient} />}
        {activeTab === 'contact' && <ContactCard patient={patient} />}
        {activeTab === 'handoff' && <HandoffLoop patient={patient} />}
        {activeTab === 'transition' && <TransitionPanel patient={patient} />}
      </main>
    </>
  );
}
