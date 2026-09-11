---
title: "Keyboard Shortcuts ⭐"
description: "Container-scoped keyboard shortcuts for undo, redo, delete-selection, and cancel."
---

# Keyboard Shortcuts

Geoman ships with container-scoped keyboard shortcuts for the most common editing actions. They are configured through `settings.keyboard` and exposed on the instance as `gm.keyboardControls`.

Handlers are scoped to the map container and ignore events that originate from form inputs, so they never hijack your application's own shortcuts.

## Settings

```typescript
// Editor keyboard actions that can be bound to key combinations.
type KeyboardAction = 'undo' | 'redo' | 'deleteSelected' | 'cancel' | 'nudge' | 'finishShape';

interface KeyboardSettings {
  enabled: boolean;                        // default: true
  bindings: Partial<Record<KeyboardAction, string[]>>;
  nudgeStepPx: number;                     // default: 2
}
```

### Default bindings

| Action | Default bindings | Description |
|:-------|:-----------------|:------------|
| `undo` | `['mod+z']` | Undo the last transaction (see [History](/history)). |
| `redo` | `['mod+shift+z', 'mod+y']` | Redo the last undone transaction. |
| `deleteSelected` | `['Delete', 'Backspace']` | Delete the currently selected features. |
| `cancel` | `['Escape']` | Cancel the current draw/edit operation. |
| `nudge` | Arrow keys, with optional Shift | Move selection 2 pixels; Shift multiplies by 10. |
| `finishShape` | `['Enter']` | Complete a valid in-progress line/polygon. |

## Binding syntax

Bindings are combo strings like `'mod+shift+z'`:

- `mod` resolves to **⌘ (Cmd)** on macOS and **Ctrl** elsewhere.
- The final token is the `KeyboardEvent.key` value (case-insensitive), e.g. `'Escape'`, `'Delete'`, `'z'`.
- Each action accepts an **array** of bindings, so you can map several key combos to the same action.

## Example

```typescript
const gm = new Geoman(map, {
  settings: {
    keyboard: {
      enabled: true,
      bindings: {
        undo: ['mod+z'],
        redo: ['mod+shift+z', 'mod+y'],
        deleteSelected: ['Delete', 'Backspace'],
        cancel: ['Escape'],
      },
    },
  },
});
```

To disable all shortcuts, set `settings.keyboard.enabled` to `false`. To remove a single action, set its bindings to an empty array, e.g. `cancel: []`.
