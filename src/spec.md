# Specification

## Summary
**Goal:** Update the public listings search Location autocomplete so it suggests and returns only location text (not property titles).

**Planned changes:**
- Adjust backend autocomplete logic (`getBackendAutocompleteSuggestions(input, maxResults)`) to search/match only against stored `property.location` values while preserving case-insensitive matching, de-duplication, and `maxResults` limiting.
- Update the frontend Location autocomplete rendering/selection behavior so the dropdown displays only location strings and selecting a suggestion fills the Location input with the exact location text.
- Update any frontend comments/docs that currently indicate the autocomplete searches property titles to reflect location-only behavior.

**User-visible outcome:** When typing in the Location field on public listings search, the autocomplete dropdown shows only location suggestions, and selecting one fills the input with that location text exactly.
