// ─── Types ────────────────────────────────────────────────────────────────────

export type CareStatus = 'active' | 'historical' | 'awaiting';
export type PatientStatus = 'unmanaged' | 'managed' | 'in-transition';

export interface CircleMember {
  id: string;
  role: string;
  name: string;
  organization?: string;
  status: CareStatus;
  lastVerified: string;
  updateOwner: string;
  responsibility: string;
}

export interface ContactRow {
  trigger: string;
  action: string;
  contact: string;
  phone?: string;
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
  highlights: string[];
}

export interface ExtractedField {
  field: string;
  value: string;
  confidence: 'confirmed' | 'uncertain';
  source: string;
  needsReview?: boolean;
}

export interface HandoffItem {
  id: string;
  title: string;
  taskStatus: 'received' | 'in-progress' | 'closed';
  serviceStatus: 'connected' | 'waiting' | 'declined' | 'in-progress' | 'not-started';
  needStatus: 'met' | 'partial' | 'unmet' | 'in-progress';
  detail: string;
  owner: string;
  updated: string;
  exception?: { type: string; description: string; nextStep: string };
}

export interface TransitionInfo {
  currentStatus: string;
  goalsMet: number;
  goalsTotal: number;
  stableDays: number;
  pcpInformed: boolean;
  nextCheckin: string;
  note: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  location: string;
  status: PatientStatus;
  careManager: string;
  navigator: string;
  summary: string;
  circleOfCare: CircleMember[];
  contactCard: ContactRow[];
  transcript: TranscriptSegment[];
  extracted: ExtractedField[];
  handoffs: HandoffItem[];
  transition: TransitionInfo;
}

// ─── Synthetic Patients ──────────────────────────────────────────────────────

export const patients: Patient[] = [
  {
    id: 'P-001',
    name: 'Margaret',
    age: 74,
    location: 'Georgina',
    status: 'unmanaged',
    careManager: 'Krista Imrie (RN Care Manager)',
    navigator: 'Karen Webster (System Navigator)',
    summary: 'Palliative care patient, 9 circle-of-care members, active chemo at Southlake. High coordination complexity.',
    circleOfCare: [
      { id: 'C1', role: 'Primary Care', name: 'Dr. Chen', organization: 'Georgina Family Practice', status: 'active', lastVerified: '2026-09-15', updateOwner: 'Krista', responsibility: 'Referral source, ongoing PCP' },
      { id: 'C2', role: 'Oncologist', name: 'Dr. Patel', organization: 'Southlake Medical Ctr', status: 'active', lastVerified: '2026-09-20', updateOwner: 'Krista', responsibility: 'Chemo regimen, 2x/month' },
      { id: 'C3', role: 'Palliative Team', name: 'Palliative Care Team', organization: 'Southlake', status: 'active', lastVerified: '2026-09-18', updateOwner: 'Karen', responsibility: 'Symptom management, hospice planning' },
      { id: 'C4', role: 'Palliative Physician', name: 'Dr. Okafor', organization: 'Southlake', status: 'active', lastVerified: '2026-09-10', updateOwner: 'Krista', responsibility: 'Palliative medicine oversight' },
      { id: 'C5', role: 'Nurse Practitioner', name: 'NP Torres', organization: 'IPCT', status: 'active', lastVerified: '2026-09-22', updateOwner: 'Krista', responsibility: 'Regular vitals, medication reconciliation' },
      { id: 'C6', role: 'Social Worker', name: 'Rebecca Blencowe', organization: 'IPCT', status: 'active', lastVerified: '2026-09-05', updateOwner: 'Rebecca', responsibility: 'Psychosocial assessment, caregiver support' },
      { id: 'C7', role: 'Care Manager', name: 'Krista Imrie', organization: 'IPCT', status: 'active', lastVerified: '2026-09-25', updateOwner: 'Krista', responsibility: 'Coordination, care plan, patient education' },
      { id: 'C8', role: 'Hospice (designated)', name: 'Georgina Hospice', organization: 'Community', status: 'awaiting', lastVerified: '2026-09-20', updateOwner: 'Palliative Team', responsibility: 'End-of-life care (when activated)' },
      { id: 'C9', role: 'Home Support', name: 'Ontario Health at Home', organization: 'OH@H', status: 'active', lastVerified: '2026-09-12', updateOwner: 'Karen', responsibility: 'PSW 2x/week, bathing assistance' },
    ],
    contactCard: [
      { trigger: 'Fever, chemo side effects', action: 'Call Southlake Oncology Nurse', contact: 'Southlake Oncology Nurse Line', phone: '(905) 555-0142' },
      { trigger: 'Need help at home (bathing, mobility)', action: 'Call Ontario Health at Home coordinator', contact: 'OH@H Coordinator', phone: '(905) 555-0178' },
      { trigger: 'Symptoms changing, unsure who to call', action: 'Call your Care Manager', contact: 'Krista Imrie (IPCT)', phone: '(905) 555-0100' },
      { trigger: 'Need transportation to Southlake', action: 'Call CHATS (Karen will prioritize)', contact: 'CHATS / Karen Webster', phone: '(905) 555-0200' },
      { trigger: 'Mental health / social support needed', action: 'Call Rebecca (Social Worker)', contact: 'Rebecca Blencowe (IPCT)', phone: '(905) 555-0111' },
      { trigger: 'Medical emergency', action: 'Call 911 or Southlake ED', contact: 'Southlake Emergency Dept', phone: '(905) 555-0100' },
    ],
    transcript: [
      { speaker: 'Care Manager', text: 'So Margaret, let\'s walk through who\'s involved in your care. You\'re seeing Dr. Chen for your primary care, and he referred you to us about six weeks ago. Tell me about your other providers.', highlights: ['Dr. Chen', 'primary care', 'referred you'] },
      { speaker: 'Patient', text: 'I see Dr. Patel at Southlake for my chemo, every other week. The palliative team at Southlake — Dr. Okafor — called last week about setting up the hospice eventually, but that\'s not started yet.', highlights: ['Dr. Patel', 'chemo', 'palliative team', 'Dr. Okafor', 'hospice'] },
      { speaker: 'Care Manager', text: 'Got it. And the home support?', highlights: ['home support'] },
      { speaker: 'Patient', text: 'I\'ve got a PSW from Ontario Health at Home who comes twice a week for bathing. And I\'m not sure if I\'m supposed to call them or the palliative team if my symptoms get bad.', highlights: ['PSW', 'Ontario Health at Home', 'twice a week', 'symptoms'] },
      { speaker: 'Care Manager', text: 'That\'s exactly what I want to sort out. Let me make sure I have everyone. And Rebecca, our social worker, sees you too — she did the caregiver assessment for you last month, right?', highlights: ['Rebecca', 'social worker', 'caregiver assessment'] },
      { speaker: 'Patient', text: 'Yes, she did. Karen called me last week about the transportation through CHATS, she said they\'d prioritize me since I\'m on the advanced-needs list. I\'m not sure what that means in practice.', highlights: ['Karen', 'CHATS', 'transportation', 'advanced-needs list'] },
      { speaker: 'Care Manager', text: 'It means when you need a ride to Southlake, Karen flags it so you don\'t wait as long as a regular caller. And if you\'re ever unsure who to call, that\'s what this card is for — you\'ll always be able to reach me.', highlights: ['prioritize', 'transportation', 'care manager'] },
    ],
    extracted: [
      { field: 'Provider', value: 'Dr. Chen — Primary Care, Georgina Family Practice', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Provider', value: 'Dr. Patel — Oncologist, Southlake Medical Ctr, chemo 2x/month', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Provider', value: 'Dr. Okafor — Palliative Physician, Southlake', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Service', value: 'Palliative Care Team, Southlake — symptom management', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Service', value: 'Ontario Health at Home — PSW 2x/week, bathing', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Service', value: 'CHATS transportation (via Karen)', confidence: 'uncertain', source: 'Patient unsure of status', needsReview: true },
      { field: 'Provider', value: 'Rebecca Blencowe — Social Worker, IPCT', confidence: 'confirmed', source: 'CM confirmation', needsReview: false },
      { field: 'Future need', value: 'Hospice (Georgina) — designated, not yet activated', confidence: 'uncertain', source: 'Palliative team call', needsReview: true },
      { field: 'Patient concern', value: 'Unclear who to call when symptoms worsen', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
    ],
    handoffs: [
      {
        id: 'H1',
        title: 'Home safety assessment',
        taskStatus: 'in-progress',
        serviceStatus: 'in-progress',
        needStatus: 'in-progress',
        detail: 'Community social worker assigned via Navigation. Assessment scheduled 3 days out.',
        owner: 'Karen Webster',
        updated: '2026-09-25',
      },
      {
        id: 'H2',
        title: 'Women\'s Support Network connection',
        taskStatus: 'closed',
        serviceStatus: 'connected',
        needStatus: 'met',
        detail: 'Patient attending weekly. Navigator confirmed intake complete.',
        owner: 'Karen Webster',
        updated: '2026-09-10',
      },
      {
        id: 'H3',
        title: 'Transportation to Southlake for chemo',
        taskStatus: 'in-progress',
        serviceStatus: 'waiting',
        needStatus: 'partial',
        detail: 'CHATS waiting list (capacity). Interim: family drives when available. Priority flag set for when capacity opens.',
        owner: 'Karen Webster',
        updated: '2026-09-22',
        exception: {
          type: 'waiting / no resource',
          description: 'CHATS at capacity; priority indicator set but not yet honored',
          nextStep: 'Follow up with CHATS coordinator in 5 days; escalate to Caitlin if no movement',
        },
      },
    ],
    transition: {
      currentStatus: 'UNMANAGED — active care management',
      goalsMet: 3,
      goalsTotal: 5,
      stableDays: 0,
      pcpInformed: true,
      nextCheckin: 'Ongoing weekly',
      note: 'Goals: symptom control ✓, social support ✓, home safety in progress. Not yet stable for managed status.',
    },
  },
  {
    id: 'P-002',
    name: 'Patricia',
    age: 68,
    location: 'Aurora',
    status: 'managed',
    careManager: 'Sheridan Johnston (RN Care Manager)',
    navigator: 'Karen Webster (System Navigator)',
    summary: 'Diabetes + mobility management. Goals met 4 weeks ago. Transitioned to PCP with 6-month IPCT follow-up.',
    circleOfCare: [
      { id: 'C1', role: 'Primary Care', name: 'Dr. Nguyen', organization: 'Aurora FHP', status: 'active', lastVerified: '2026-09-20', updateOwner: 'Sheridan', responsibility: 'Ongoing PCP, all routine care' },
      { id: 'C2', role: 'Endocrinologist', name: 'Dr. Kowalski', organization: 'York Region', status: 'historical', lastVerified: '2026-08-01', updateOwner: 'PCP', responsibility: 'HbA1c 6-month follow-up only' },
      { id: 'C3', role: 'Physiotherapist', name: 'Physio Rina', organization: 'Community Clinic', status: 'active', lastVerified: '2026-09-15', updateOwner: 'PCP', responsibility: 'Mobility program, 2x/month' },
      { id: 'C4', role: 'Care Manager', name: 'Sheridan Johnston', organization: 'IPCT', status: 'historical', lastVerified: '2026-09-01', updateOwner: 'Sheridan', responsibility: 'Case closed — 6-month check-in' },
      { id: 'C5', role: 'Dietitian', name: 'Ms. Park', organization: 'Nutrition Ctr', status: 'historical', lastVerified: '2026-07-20', updateOwner: 'Patient', responsibility: 'Meal plan completed' },
    ],
    contactCard: [
      { trigger: 'Blood sugar management question', action: 'Call PCP (Dr. Nguyen)', contact: 'Aurora FHP', phone: '(905) 555-0301' },
      { trigger: 'Mobility program scheduling', action: 'Call physio clinic directly', contact: 'Physio Rina', phone: '(905) 555-0302' },
      { trigger: 'Need IPCT support again (condition change)', action: 'Re-refer through PCP or call IPCT', contact: 'IPCT Intake', phone: '(905) 555-0100' },
    ],
    transcript: [
      { speaker: 'Care Manager', text: 'Patricia, just checking in on the transition. How are you managing with Dr. Nguyen and the physio?', highlights: ['Dr. Nguyen', 'physio'] },
      { speaker: 'Patient', text: 'Honestly it\'s going fine. Dr. Nguyen adjusted my metformin last month and the physio is doing great with the mobility. I think I\'m settled.', highlights: ['metformin', 'physio', 'settled'] },
      { speaker: 'Care Manager', text: 'That\'s great to hear. I\'m going to mark you as managed. Dr. Nguyen is your main point now. If anything changes, just tell her or call us — you\'re on our list, it\'s not a discharge.', highlights: ['managed', 'not a discharge', 'on our list'] },
    ],
    extracted: [
      { field: 'Provider', value: 'Dr. Nguyen — PCP, Aurora FHP (all routine care)', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Provider', value: 'Dr. Kowalski — Endocrinologist, 6-month only', confidence: 'confirmed', source: 'Care plan', needsReview: false },
      { field: 'Service', value: 'Physio Rina — mobility 2x/month, active', confidence: 'confirmed', source: 'Patient statement', needsReview: false },
      { field: 'Status', value: 'Case managed — closed to PCP, IPCT check-in in 6 months', confidence: 'confirmed', source: 'CM confirmation', needsReview: false },
    ],
    handoffs: [
      {
        id: 'H1',
        title: 'Diabetes medication review',
        taskStatus: 'closed',
        serviceStatus: 'connected',
        needStatus: 'met',
        detail: 'PCP adjusted metformin in August. Stable HbA1c for 2 months.',
        owner: 'Dr. Nguyen (PCP)',
        updated: '2026-08-15',
      },
      {
        id: 'H2',
        title: 'Mobility program completion',
        taskStatus: 'closed',
        serviceStatus: 'connected',
        needStatus: 'met',
        detail: '12-week program complete. Maintenance 2x/month ongoing.',
        owner: 'Physio Rina',
        updated: '2026-09-01',
      },
    ],
    transition: {
      currentStatus: 'MANAGED — active care returned to PCP',
      goalsMet: 4,
      goalsTotal: 4,
      stableDays: 28,
      pcpInformed: true,
      nextCheckin: '2027-03 (6-month IPCT follow-up)',
      note: 'All goals met. Patient reports good control. Deactivated from active CM caseload. Remains on advanced-needs registry.',
    },
  },
  {
    id: 'P-003',
    name: 'Douglas',
    age: 81,
    location: 'Georgina',
    status: 'in-transition',
    careManager: 'Sheridan Johnston (RN Care Manager)',
    navigator: 'Karen Webster (System Navigator)',
    summary: 'Post-hospitalization (Southlake, COPD exacerbation). Returning to PCP/IPCT. Reverse transition in progress.',
    circleOfCare: [
      { id: 'C1', role: 'Primary Care', name: 'Dr. Chen', organization: 'Georgina FHP', status: 'active', lastVerified: '2026-09-28', updateOwner: 'Sheridan', responsibility: 'Receiving patient back from hospital' },
      { id: 'C2', role: 'Hospital Team', name: 'Dr. Singh (Pulm.)', organization: 'Southlake', status: 'active', lastVerified: '2026-09-28', updateOwner: 'Southlake', responsibility: 'Discharge plan, pulmonary follow-up' },
      { id: 'C3', role: 'Respiratory Therapy', name: 'RT Smith', organization: 'Southlake', status: 'awaiting', lastVerified: '2026-09-28', updateOwner: 'Dr. Singh', responsibility: 'Inspiratory muscle training (post-discharge)' },
      { id: 'C4', role: 'Care Manager', name: 'Sheridan Johnston', organization: 'IPCT', status: 'active', lastVerified: '2026-09-28', updateOwner: 'Sheridan', responsibility: 'Post-discharge check-in day 3' },
      { id: 'C5', role: 'Ontario Health at Home', name: 'OH@H — Respiratory', organization: 'OH@H', status: 'awaiting', lastVerified: '2026-09-28', updateOwner: 'Karen', responsibility: 'Oxygen titration at home (pending referral)' },
    ],
    contactCard: [
      { trigger: 'Worsening breathing / oxygen concerns', action: 'Call Southlake Pulmonary (Dr. Singh)', contact: 'Southlake Pulmonary', phone: '(905) 555-0142' },
      { trigger: 'Need help with oxygen equipment', action: 'Call Ontario Health at Home', contact: 'OH@H Respiratory', phone: '(905) 555-0178' },
      { trigger: 'Post-discharge concerns / unsure who to call', action: 'Call your Care Manager', contact: 'Sheridan Johnston (IPCT)', phone: '(905) 555-0100' },
      { trigger: 'Respiratory therapy appointment', action: 'Call RT clinic directly', contact: 'RT Smith (Southlake)', phone: '(905) 555-0199' },
    ],
    transcript: [
      { speaker: 'Care Manager', text: 'Douglas, how\'s the recovery going? You were at Southlake for a week with the COPD exacerbation. Dr. Singh sent us the discharge summary yesterday.', highlights: ['COPD', 'Southlake', 'Dr. Singh', 'discharge summary'] },
      { speaker: 'Patient', text: 'I\'m getting better, but my breathing is still tight in the mornings. The hospital said I need oxygen titration but I don\'t think that\'s been set up yet at home.', highlights: ['oxygen titration', 'not set up', 'home'] },
      { speaker: 'Care Manager', text: 'That\'s a gap. I\'m going to send that to Karen to get the OH@H referral in. In the meantime, if your breathing gets much worse, call Southlake pulmonary directly.', highlights: ['Karen', 'OH@H referral', 'gap'] },
    ],
    extracted: [
      { field: 'Provider', value: 'Dr. Singh — Pulmonologist, Southlake (discharge planning)', confidence: 'confirmed', source: 'Hospital discharge summary', needsReview: false },
      { field: 'Service', value: 'OH@H Oxygen titration — PENDING referral', confidence: 'uncertain', source: 'Patient reports not set up', needsReview: true },
      { field: 'Service', value: 'Respiratory therapy — awaiting appointment', confidence: 'uncertain', source: 'Not yet scheduled', needsReview: true },
      { field: 'Gap', value: 'No home oxygen support yet — 7 days since discharge', confidence: 'confirmed', source: 'Patient statement', needsReview: true },
    ],
    handoffs: [
      {
        id: 'H1',
        title: 'OH@H oxygen referral',
        taskStatus: 'in-progress',
        serviceStatus: 'not-started',
        needStatus: 'unmet',
        detail: 'Sent to Karen 2026-09-28. Pending OH@H intake.',
        owner: 'Karen Webster',
        updated: '2026-09-28',
        exception: {
          type: 'cannot contact / need persists',
          description: 'OH@H waiting list; oxygen need not yet addressed 7 days post-discharge',
          nextStep: 'Escalate to Caitlin (partnerships) if not scheduled by Oct 5',
        },
      },
      {
        id: 'H2',
        title: 'RT follow-up appointment',
        taskStatus: 'received',
        serviceStatus: 'not-started',
        needStatus: 'unmet',
        detail: 'RT Smith notified by Dr. Singh. Appointment not yet scheduled.',
        owner: 'Dr. Singh (Southlake)',
        updated: '2026-09-28',
      },
    ],
    transition: {
      currentStatus: 'IN TRANSITION — hospital → IPCT/PCP',
      goalsMet: 1,
      goalsTotal: 3,
      stableDays: 0,
      pcpInformed: true,
      nextCheckin: 'Day 3 post-discharge check-in',
      note: 'Two gaps: oxygen not set up, RT not scheduled. Both blocking transition to managed.',
    },
  },
];
