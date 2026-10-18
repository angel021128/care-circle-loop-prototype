"""
FastAPI backend for Care Circle & Loop prototype.
Optional — the frontend runs standalone with embedded data.
This server exposes the patient data for API testing / integration demos.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
from datetime import datetime, date

app = FastAPI(title="Care Circle & Loop — Prototype API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load synthetic data
DATA_FILE = Path(__file__).parent / "src" / "data.ts"

def load_patients() -> list[dict]:
    """Parse patients from data.ts (simple extraction — production would use a JSON fixture)."""
    # For demo purposes, read a separate JSON fixture
    fixture = Path(__file__).parent / "patients.json"
    if fixture.exists():
        return json.loads(fixture.read_text())
    return []


@app.get("/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "patients": len(load_patients()),
        "version": "0.1.0",
    }


@app.get("/patients")
def list_patients():
    """Return all synthetic patients with their care circle data."""
    patients = load_patients()
    return {
        "count": len(patients),
        "patients": [
            {
                "id": p["id"],
                "name": p["name"],
                "status": p["status"],
                "location": p["location"],
                "careManager": p["careManager"],
            }
            for p in patients
        ],
    }


@app.get("/patients/{patient_id}/circle")
def get_circle(patient_id: str):
    """Return the full care circle for a patient."""
    for p in load_patients():
        if p["id"] == patient_id:
            return p
    return {"error": "Patient not found", "status": 404}


@app.get("/patients/{patient_id}/handoffs")
def get_handoffs(patient_id: str):
    """Return navigator handoff items with 3-layer status."""
    for p in load_patients():
        if p["id"] == patient_id:
            return {
                "patient": p["name"],
                "handoffs": p.get("handoffs", []),
            }
    return {"error": "Patient not found", "status": 404}


@app.get("/patients/{patient_id}/transition")
def get_transition(patient_id: str):
    """Return transition status for a patient."""
    for p in load_patients():
        if p["id"] == patient_id:
            return p.get("transition", {})
    return {"error": "Patient not found", "status": 404}
