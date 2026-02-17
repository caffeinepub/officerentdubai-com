# Specification

## Summary
**Goal:** Replace the public search Location autocomplete with listing-based suggestions from stored property data to avoid Google Places API charges.

**Planned changes:**
- Update the frontend Location typeahead to fetch and display autocomplete suggestions sourced from backend stored properties (location + title), and ensure it never loads/queries Google Places Autocomplete (even if an API key exists).
- Preserve existing typeahead interaction behavior (mouse selection, arrow keys, enter to select, escape to close) and keep all user-facing text in English.
- Add/adjust a backend public autocomplete query that matches input case-insensitively against both `property.location` and `property.title`, deduplicates suggestions case-insensitively, and respects `maxResults` (default 10 when null).

**User-visible outcome:** When typing in the Location field on the public search, users see a dropdown of suggested locations/building names derived from existing listings, can select them with keyboard or mouse, and the app does not use Google Places for this autocomplete.
