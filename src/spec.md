# Specification

## Summary
**Goal:** Replace the Agent Arena Internet Identity entry flow with an Agent Code gate (050702) and enforce the same code for backend listing management.

**Planned changes:**
- Update `/agent` to show an English-only Agent Code input + submit; accept only `050702`, persist authorization locally, and redirect to `/agent/dashboard`.
- Protect all `/agent/*` routes (`/agent/dashboard`, `/agent/properties`, `/agent/properties/new`, `/agent/properties/edit/:id`) based on the locally-stored Agent Code authorization state; show an English “Access Denied” screen with a link/button back to `/agent` when unauthorized.
- Update the Agent Dashboard logout to clear the locally-stored Agent Code authorization state (and related cached agent data) and return to `/agent`.
- Enforce Agent Code authorization on the backend for property create/update/delete (must be exactly `050702`); keep all public property queries accessible without any agent code.
- Update the frontend data layer so create/update/delete mutations always send the agent code to the backend, and show clear English errors when rejected due to missing/invalid code (guiding users back to `/agent`).

**User-visible outcome:** Users enter agent code `050702` at `/agent` to access the Agent Arena dashboard and manage listings; unauthorized users see Access Denied, and logging out clears access until the code is entered again. Public listing browsing remains available without any login/code.
