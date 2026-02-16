# Specification

## Summary
**Goal:** Add Permit Number, Furnishing Status (Furnished / Semi-Furnished / Unfurnished), and Washrooms to property data, agent create/edit flow, public listings UI, and public search filtering.

**Planned changes:**
- Extend the backend Property model and create/update params to store permit number, furnishing status, and washrooms; ensure all public property query methods (including getPropertyById) return these fields.
- Update Agent Arena property create/edit forms to input Permit Number, select Furnishing Status (3 options), and enter Washrooms, and send/persist these values on create/update (with edit pre-fill).
- Update public listing card and listing details page to display Permit Number, Furnishing Status, and Washrooms with clear English labels and graceful handling of missing values.
- Add a Furnishing Status filter to the public PropertySearchBar (including an unset state) and make search results respect this filter when applied.

**User-visible outcome:** Agents can add/edit permit number, furnishing status, and washrooms for listings; users can see these fields on listing cards and details, and can filter search results by furnishing status.
