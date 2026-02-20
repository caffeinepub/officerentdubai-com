# Specification

## Summary
**Goal:** Fix Select.Item validation errors by ensuring all Select.Item components have non-empty value props.

**Planned changes:**
- Update Select.Item components in PropertyForm.tsx to use non-empty value props (e.g., 'none', 'unspecified') instead of empty strings
- Update Select.Item components in PropertySearchBar.tsx to use non-empty value props
- Ensure Select components can still be cleared and show placeholders using the Select component's built-in empty string handling

**User-visible outcome:** Users can continue to use property forms and search filters without encountering console validation errors, with all selection clearing and placeholder functionality working as before.
