# Specification

## Summary
**Goal:** Reduce the site theme to a softer light/pale yellow palette across the entire app.

**Planned changes:**
- Update site-wide Tailwind OKLCH theme CSS variables in `frontend/src/index.css` to use a less saturated, less intense light yellow palette for `background/foreground/card/popover/primary/secondary/muted/accent/border/input/ring` and corresponding `*-foreground` tokens.
- Ensure the updated palette applies consistently in both default and dark mode without reverting to the previous stronger yellow values.

**User-visible outcome:** The public portal and Agent Arena display a calmer light/yellow theme with readable text and softer interactive colors (buttons/links) while keeping the same functionality and layout.
