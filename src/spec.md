# Specification

## Summary
**Goal:** Restore Agent Arena add/edit/delete property functionality by allowing authorized mutations using the Agent Code “050702” without Internet Identity, and improve UI error messaging to show the backend’s reason in English.

**Planned changes:**
- Update backend property create/update/delete authorization to accept the Agent Code (“050702”) for `createPropertyWithCode`, `updatePropertyWithCode`, and `deletePropertyWithCode` even when the caller is not authenticated.
- Return a clear English error containing the phrase “Invalid agent code” when the agent code is missing or incorrect for create/update/delete.
- Ensure public property browsing (`getAllProperties`, `getPropertyById`, search/filter queries) remains publicly accessible without requiring an agent code.
- Update Agent Arena UI to surface backend-provided failure reasons in English (especially invalid/missing agent code), including guidance to return to `/agent` and re-enter the code.
- Ensure successful add/edit flows navigate back to `/agent/properties` without showing an error.

**User-visible outcome:** Agents can add, edit, and delete properties in Agent Arena using the Agent Code “050702” without Internet Identity login, and any failures show clear English messages explaining the reason and next steps.
