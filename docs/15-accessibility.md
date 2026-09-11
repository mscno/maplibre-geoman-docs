---
title: "Accessibility and Localisation ⭐"
description: "Screen-reader announcements and localisation hooks in Geoman Pro 0.11."
---

# Accessibility and Localisation

Geoman adds a polite `aria-live` region to the map container for selection
changes and rejected operations. Set `settings.announceActions: false` to
disable it.

`settings.announcementResolver` receives the announcement kind, contextual
data, and `defaultMessage`. Return translated text, `undefined` to use the
default English message, or an empty string to remain silent. A throwing
resolver falls back to the default.

```typescript
const gm = new Geoman(map, {
  settings: {
    announcementResolver: ({ defaultMessage }) => translate(defaultMessage),
    selectionMessageResolver: ({ defaultMessage }) => translate(defaultMessage),
  },
});
```

The selection resolver controls guidance on disabled controls that require a
selection. A per-control `requiresSelection.message` takes precedence.

Keyboard actions are scoped to the map container and ignore form inputs.
Arrow keys nudge the selected features by `keyboard.nudgeStepPx` (default 2);
Shift multiplies the distance by ten. Enter completes a valid line/polygon
draw. See [Keyboard Shortcuts](/keyboard-shortcuts).

Live announcements are not a claim of complete keyboard accessibility:
toolbar roving focus and keyboard vertex navigation remain future work.
