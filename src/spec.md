# Specification

## Summary
**Goal:** Add Google Places Autocomplete to the public search Location input to provide live Dubai/UAE location and building suggestions, with a safe fallback to existing backend autocomplete.

**Planned changes:**
- Integrate Google Places Autocomplete API for the public Location input, restricting results to UAE (`components=country:AE`) and biasing suggestions toward Dubai.
- Display Google suggestions in the existing typeahead dropdown with current mouse/keyboard selection behavior, and populate the input on selection.
- Add a configurable frontend Google Places API key (not hardcoded) and implement clear English behavior when the key is missing to avoid failing requests.
- Keep and use backend `getAutocompleteSuggestions(input, maxResults)` as a fallback when Google is unavailable (missing key, errors, or no results), without changing existing search submission/filter behavior.

**User-visible outcome:** Users typing in the Location field see live Google-powered Dubai/UAE suggestions when configured, and otherwise still get the existing backend suggestions (or a clear English message), while search continues to work the same way.
