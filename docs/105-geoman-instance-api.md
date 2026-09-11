---
title: "Geoman Instance API"
description: "Complete API reference for the Geoman instance: initialization, mode management, global controls, and feature operations."
---

# Geoman Instance API

The Geoman instance provides the main interface for interacting with the map editing functionality. This documentation covers all public methods available on the Geoman instance.

## Installation & Initialization

```typescript
import { Geoman, GmOptionsPartial } from '@geoman-io/maplibre-geoman-pro'; // or '@geoman-io/maplibre-geoman-free', '@geoman-io/mapbox-geoman-pro', '@geoman-io/mapbox-geoman-free'


const options: GmOptionsPartial = {
  // configuration options
};

const gm = new Geoman(map, options);
```

## Core Properties

### `features`
Access to the Features API for managing map features.
```typescript
const features = gm.features;
```

### `mapAdapter`
Access to the underlying map adapter instance.
```typescript
const mapAdapter = gm.mapAdapter;
```

## Mode Management Methods

### Draw Modes

Mode-changing methods are asynchronous and return a `Promise`. You can `await` them when you need to be sure the mode change has completed, or call them fire-and-forget.

#### `enableDraw`
Enables drawing mode for a specific shape.
```typescript
gm.enableDraw(shape: DrawModeName): Promise<void>;
```

#### `disableDraw`
Disables any active drawing mode.
```typescript
gm.disableDraw(): Promise<void>;
```

#### `toggleDraw`
Toggles drawing mode for a specific shape.
```typescript
gm.toggleDraw(shape: DrawModeName): Promise<void>;
```

#### `drawEnabled`
Checks if drawing mode is enabled for a specific shape.
```typescript
gm.drawEnabled(shape: DrawModeName): boolean;
```

### Edit Modes

#### Global Edit Mode
```typescript
gm.enableGlobalEditMode(): Promise<void>;
gm.disableGlobalEditMode(): Promise<void>;
gm.toggleGlobalEditMode(): Promise<void>;
gm.globalEditModeEnabled(): boolean;
```

#### Global Drag Mode
```typescript
gm.enableGlobalDragMode(): Promise<void>;
gm.disableGlobalDragMode(): Promise<void>;
gm.toggleGlobalDragMode(): Promise<void>;
gm.globalDragModeEnabled(): boolean;
```

#### Global Rotate Mode
```typescript
gm.enableGlobalRotateMode(): Promise<void>;
gm.disableGlobalRotateMode(): Promise<void>;
gm.toggleGlobalRotateMode(): Promise<void>;
gm.globalRotateModeEnabled(): boolean;
```

#### Global Cut Mode
```typescript
gm.enableGlobalCutMode(): Promise<void>;
gm.disableGlobalCutMode(): Promise<void>;
gm.toggleGlobalCutMode(): Promise<void>;
gm.globalCutModeEnabled(): boolean;
```

#### Global Removal Mode
```typescript
gm.enableGlobalRemovalMode(): Promise<void>;
gm.disableGlobalRemovalMode(): Promise<void>;
gm.toggleGlobalRemovalMode(): Promise<void>;
gm.globalRemovalModeEnabled(): boolean;
```

#### Other Edit Modes

For edit modes without dedicated helper methods (select, scale, copy, split, union, difference, line_simplification, lasso, add_hole, add_part, remove_ring, explode, merge_parts), use the generic mode management methods:

```typescript
// Example: Scale mode
gm.enableMode('edit', 'scale');
gm.disableMode('edit', 'scale');
gm.toggleMode('edit', 'scale');
gm.isModeEnabled('edit', 'scale');

// Example: Copy mode
gm.enableMode('edit', 'copy');
// ... and so on for other edit modes
```

### Generic Mode Management

#### `enableMode`
Enables a specific mode for a given mode type.
```typescript
gm.enableMode(modeType: ModeType, modeName: ModeName): Promise<void>;
```

#### `disableMode`
Disables a specific mode for a given mode type.
```typescript
gm.disableMode(modeType: ModeType, modeName: ModeName): Promise<void>;
```

#### `toggleMode`
Toggles a specific mode for a given mode type.
```typescript
gm.toggleMode(modeType: ModeType, modeName: ModeName): Promise<void>;
```

#### `isModeEnabled`
Checks if a specific mode is enabled.
```typescript
gm.isModeEnabled(modeType: ModeType, modeName: ModeName): boolean;
```

#### `disableAllModes`
Disables all active modes.
```typescript
gm.disableAllModes(): Promise<void>;
```

## Mode Status Methods

#### `getActiveDrawModes`
Gets array of currently active draw modes.
```typescript
gm.getActiveDrawModes(): Array<DrawModeName>;
```

#### `getActiveEditModes`
Gets array of currently active edit modes.
```typescript
gm.getActiveEditModes(): Array<EditModeName>;
```

#### `getActiveHelperModes`
Gets array of currently active helper modes.
```typescript
gm.getActiveHelperModes(): Array<HelperModeName>;
```

## Control Management

#### `addControls`
Adds the Geoman controls to the map.
```typescript
gm.addControls(controlsElement?: HTMLElement): Promise<void>;
```

#### `removeControls`
Removes the Geoman controls from the map.
```typescript
gm.removeControls(): Promise<void>;
```

## Lifecycle Methods

#### `waitForGeomanLoaded`
Waits for Geoman to be fully loaded and ready.
```typescript
gm.waitForGeomanLoaded(): Promise<Geoman | undefined>;
```

#### `destroy`
Destroys the Geoman instance and cleans up resources.
```typescript
gm.destroy(options?: { removeSources: boolean }): Promise<void>;
```

## Event Handling

#### `setGlobalEventsListener`
Sets a global event listener for all Geoman events. Pass `null` (or call with no argument) to remove the listener.
```typescript
gm.setGlobalEventsListener(callback?: GlobalEventsListener | null): void;
```

## Types

### ModeName Types
```typescript
type DrawModeName = 'marker' | 'circle' | 'circle_marker' | 'ellipse' | 'text_marker' |
                    'line' | 'rectangle' | 'polygon' | 'freehand' | 'custom_shape';

type EditModeName = 'select' | 'drag' | 'change' | 'rotate' | 'scale' | 'copy' |
                    'cut' | 'split' | 'union' | 'difference' | 'line_simplification' |
                    'lasso' | 'add_hole' | 'add_part' | 'remove_ring' | 'explode' |
                    'merge_parts' | 'delete';

type HelperModeName = 'shape_markers' | 'pin' | 'snapping' | 'snap_guides' | 
                      'measurements' | 'auto_trace' | 'geofencing' | 
                      'zoom_to_features' | 'click_to_edit';

// The mode type accepted by enableMode / disableMode / toggleMode / isModeEnabled
type ModeType = 'draw' | 'edit' | 'helper';
```

### Event Types
```typescript
// The global events listener receives a single event object
type GlobalEventsListener = (event: GmSystemEvent | GmEvent) => void;
```

## Example Usage

```typescript
// Initialize Geoman
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://maps.geoman.io/styles/basic/style.json'
});

const gm = new Geoman(map);

// Add controls
await gm.addControls();

// Enable drawing mode
gm.enableDraw('polygon');

// Listen to events
gm.setGlobalEventsListener((event) => {
  if (event.name === 'gm:create') {
    console.log('Feature created:', event);
  }
});

// Enable various edit modes
gm.enableGlobalEditMode();
gm.enableGlobalRotateMode();

// Check active modes
const activeModes = gm.getActiveEditModes();
console.log('Active edit modes:', activeModes);

// Disable all modes
gm.disableAllModes();
```

## Available Draw Shapes

- `marker`: Single point marker
- `circle`: Circle with radius
- `circle_marker`: Fixed-size circle marker
- `ellipse`: Ellipse with x and y semi-axes
- `text_marker`: Text label
- `line`: Linear feature
- `rectangle`: Rectangular polygon
- `polygon`: Free-form polygon
- `freehand`: Freehand drawing
- `custom_shape`: Custom shape drawing

## Available Edit Modes

- `select`: Select features
- `drag`: Move features
- `change`: Modify vertices
- `rotate`: Rotate features
- `scale`: Scale features
- `copy`: Copy features
- `cut`: Cut features
- `split`: Split features
- `union`: Combine features
- `difference`: Subtract features
- `line_simplification`: Simplify lines
- `lasso`: Lasso selection
- `add_hole`: Add a hole to a polygon
- `add_part`: Add a part to a (multi)polygon
- `remove_ring`: Remove a ring (hole or part) from a polygon
- `explode`: Explode a multi-part feature into separate features
- `merge_parts`: Merge selected features into a single multi-part feature
- `delete`: Remove features

## Available Helper Modes

- `shape_markers`: Show shape markers
- `pin`: Pin mode
- `snapping`: Enable snapping
- `snap_guides`: Show snap guides
- `measurements`: Show measurements
- `auto_trace`: Auto-trace features
- `geofencing`: Geofencing mode
- `zoom_to_features`: Zoom to features
- `click_to_edit`: Click to edit mode

## Editor-platform APIs (Pro 0.11)

- `gm.dataLayers`: [named layers, styles and schemas](/data-layers).
- `gm.edit`: [undoable programmatic editing and geometry utilities](/programmatic-editing).
- `gm.geofencing`: [live containment and keep-out constraints](/helper-modes/helper-geofencing).
- [Accessibility and localisation](/accessibility).
- [0.11 migration and full release notes](/release-0.11).

The lifecycle emits `gm:unloaded` when Geoman is destroyed.
