# Care Circle & Loop — Prototype (D5)

> Ivey AFP · Southlake Health · Care Management Digital Supports
> **All data is synthetic. No PHI.**

## What This Is

A working proof-of-concept showing the full care management loop for three synthetic
patients, covering:

1. **Circle of Care** — hub-and-spoke visual of all providers/services, with active/
   awaiting/historical status, last-verified dates, and update ownership
2. **AI Extract** — simulated transcription of a CM–patient conversation with entity
   extraction, confidence flags, and "needs CM review" checklist
3. **Patient Card** — "Who to Contact" if/then guide (paper + electronic), with QR
   code placeholder for provider-facing consent mechanism
4. **Navigator Loop** — 3-layer status tracking (Task / Service / Need) with
   exception handling (waiting, ineligible, can't contact)
5. **Transition** — Managed/Unmanaged/In-Transition status with goal progress,
   stability indicator, and "deactivate not discharge" workflow

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript (no external UI libs — all custom CSS)
- **Backend** (optional): FastAPI on port 8000
- **Data**: `src/data.ts` (embedded in frontend) + `patients.json` (for API)

## Run

```bash
# Frontend only (no backend needed)
npm install
npm run dev
# → http://localhost:5173

# With FastAPI backend
pip install fastapi uvicorn
python -m uvicorn server:app --reload --port 8000
# → http://localhost:8000/health
# → http://localhost:8000/patients/P-001/circle
```

## 7-Minute Demo Script

| Time | Tab | What to show |
|---|---|---|
| 0:00–1:00 | sidebar | Switch to Margaret — 9 circle members, unmanaged, palliative |
| 1:00–2:30 | AI Extract | Click "Run AI Extraction" → see confirmed + flagged items |
| 2:30–4:00 | Navigator Loop | 3 handoff items, CHATS exception (waiting → escalate to Caitlin) |
| 4:00–5:30 | Patient Card | "If you have a fever → call this number" + QR code explanation |
| 5:30–7:00 | Transition | Patricia (managed, 6-mo check) vs Douglas (blocked, can't transition yet) |

## Files

```
care-circle-loop/
├── src/
│   ├── App.tsx                    # Main shell: sidebar + 5 tabs
│   ├── main.tsx
│   ├── index.css                  # All styles (no CSS framework)
│   ├── data.ts                    # 3 synthetic patients, full data model
│   └── components/
│       ├── CircleOfCare.tsx       # SVG hub-and-spoke + detail list
│       ├── AIExtract.tsx          # Transcript → extracted fields (simulated)
│       ├── ContactCard.tsx        # Patient-facing if/then guide
│       ├── HandoffLoop.tsx        # 3-layer status + exceptions
│       └── TransitionPanel.tsx    # Managed/unmanaged transition workflow
├── server.py                      # FastAPI (optional)
├── patients.json                  # Fixture for API
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design Decisions

- **No real LLM** — extraction is pre-baked in `data.ts`. In production, replace with
  Ollama (Llama 3.1 8B) per project hard constraint (no cloud, PHI stays on-site).
- **No Tailwind/Bootstrap** — pure CSS, matches project pattern (Southlake doc mgmt).
- **QR code is a placeholder** — Miro D2 §09 flags QR delivery as unconfirmed.
- **Task ≠ Service ≠ Need** — three distinct status layers per Miro D2 §08.
- **"Deactivate not discharge"** — language from Matt (Sept 17 transcript).
- **Caseload note** — patients never leave the registry, only their active status changes.
