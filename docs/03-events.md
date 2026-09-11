---
title: "Geoman Events"
description: "Event system reference for listening to draw, edit, drag, cut, rotate, and other geometry interactions."
---

# Geoman Events

Geoman provides a rich event system that allows you to listen to various interactions with the map. Events can be listened to either individually or globally.

## Event Listening Methods

### Individual Event Listening

With MapLibre GL JS 6, subscribe through `geoman.mapAdapter` for typed
`gm:*` events. MapLibre's native event-name overloads cover its own events.
The raw map event API still works at runtime, but TypeScript callers should use
this adapter rather than casting custom event names to native MapLibre names.
The examples below assume an initialized `geoman` instance.


You can listen to specific events using the Geoman map adapter's typed `on` method:

```typescript
geoman.mapAdapter.on('gm:create', (event) => {
  console.log('Feature created:', event);
});
```

### Global Event Listening

To listen to all Geoman events, use the global events listener:

```typescript
geoman.setGlobalEventsListener((event) => {
  console.log('Event:', event);
});

// Remove the global listener
geoman.setGlobalEventsListener(null);
```

## Event Categories

### Mode Toggle Events

These events fire when different modes are toggled on/off:

```typescript
// Drawing mode
geoman.mapAdapter.on('gm:globaldrawmodetoggled', (event) => {
  console.log('Draw mode toggled:', event.enabled);
});

// Edit mode
geoman.mapAdapter.on('gm:globaleditmodetoggled', (event) => {
  console.log('Edit mode toggled:', event.enabled);
});

// Remove mode
geoman.mapAdapter.on('gm:globaldeletemodetoggled', (event) => {
  console.log('Remove mode toggled:', event.enabled);
});

// Rotate mode
geoman.mapAdapter.on('gm:globalrotatemodetoggled', (event) => {
  console.log('Rotate mode toggled:', event.enabled);
});

// Drag mode
geoman.mapAdapter.on('gm:globaldragmodetoggled', (event) => {
  console.log('Drag mode toggled:', event.enabled);
});

// Cut mode
geoman.mapAdapter.on('gm:globalcutmodetoggled', (event) => {
  console.log('Cut mode toggled:', event.enabled);
});

// Snapping mode
geoman.mapAdapter.on('gm:globalsnappingmodetoggled', (event) => {
  console.log('Snapping mode toggled:', event.enabled);
});
```

### Drawing Events

Events related to drawing features:

```typescript
// Listen to all draw events
// Use setGlobalEventsListener() for internal drawing notifications.

// Feature creation
geoman.mapAdapter.on('gm:create', (event: FeatureCreatedFwdEvent) => {
  console.log('Feature created:', event);
});
```

### Edit Events

Events related to editing features:

```typescript
// Listen to all edit events
// Use setGlobalEventsListener() for internal editing notifications.

// Edit start
geoman.mapAdapter.on('gm:editstart', (event: FeatureEditStartFwdEvent) => {
  console.log('Edit started:', event);
});

// Edit end
geoman.mapAdapter.on('gm:editend', (event: FeatureEditEndFwdEvent) => {
  console.log('Edit ended:', event);
});
```

### Remove Events

Events for feature removal:

```typescript
geoman.mapAdapter.on('gm:remove', (event: FeatureRemovedFwdEvent) => {
  console.log('Feature removed:', event);
});
```

### Rotate Events

Events for rotating features:

```typescript
// Listen to all rotate events
geoman.mapAdapter.on('gm:rotate', (event: FeatureUpdatedFwdEvent) => {
  console.log('Rotate event:', event);
});

// Rotation start
geoman.mapAdapter.on('gm:rotatestart', (event: FeatureEditStartFwdEvent) => {
  console.log('Rotation started:', event);
});

// Rotation end
geoman.mapAdapter.on('gm:rotateend', (event: FeatureEditEndFwdEvent) => {
  console.log('Rotation ended:', event);
});
```

### Drag Events

Events for dragging features:

```typescript
// Listen to all drag events
geoman.mapAdapter.on('gm:drag', (event: FeatureUpdatedFwdEvent) => {
  console.log('Drag event:', event);
});

// Drag start
geoman.mapAdapter.on('gm:dragstart', (event: FeatureEditStartFwdEvent) => {
  console.log('Drag started:', event);
});

// Drag end
geoman.mapAdapter.on('gm:dragend', (event: FeatureEditEndFwdEvent) => {
  console.log('Drag ended:', event);
});
```

### Cut Events

Events for cutting features:

```typescript
geoman.mapAdapter.on('gm:cut', (event: FeatureUpdatedFwdEvent) => {
  console.log('Feature cut:', event);
});
```

### Helper Events

Use `gm:globalsnappingmodetoggled` for snapping and
`gm:geofencing_violation` for rejected containment/keep-out edits. Internal
helper notifications are available through the global listener; avoid relying
on private `_gm:*` names.

### Control Events

The global listener includes control notifications as well as draw, edit, and
helper events. Register one global listener and route the notifications in your
application; calling `setGlobalEventsListener()` again replaces it.

## Complete Example

This Vite example bundles MapLibre 6's module worker. See [Basics](/basics) for
other bundlers and self-hosted worker assets.

```typescript
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { Geoman } from '@geoman-io/maplibre-geoman-pro';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@geoman-io/maplibre-geoman-pro/dist/maplibre-geoman.css';

maplibregl.setWorkerUrl(workerUrl);
const map = new maplibregl.Map({
  container: 'map',
  style: 'your-style-url',
});
const geoman = new Geoman(map);

geoman.mapAdapter.once('gm:loaded', () => {
  console.log('Geoman loaded');
});
geoman.mapAdapter.on('gm:create', (event) => {
  console.log('Created feature:', event.feature);
});
geoman.mapAdapter.on('gm:editend', (event) => {
  console.log('Committed edit:', event.feature);
});
geoman.setGlobalEventsListener((notification) => {
  console.log('Global notification:', notification);
});
```

### Pro 0.11 lifecycle and compound edits

- `gm:unloaded` fires when Geoman is destroyed.
- `gm:geofencing_violation` exposes containment and intersection violations;
  `event.action` identifies the violation.
- In-place programmatic operations on `geoman.edit` emit `gm:edit`, then
  `gm:editend`, so the same persistence handler can cover interactive edits.
- `gm:explode`, `gm:merge_parts`, and `gm:split` always carry
  `originalFeatures` and `features` arrays. They accompany granular
  create/remove events: choose one persistence channel to avoid counting an
  operation twice. Set `settings.compoundLineageEvents: false` for a
  granular-only stream.
- Multi-feature events honor `awaitDataUpdatesOnEvents` for every affected
  source. Errors thrown by one host listener are isolated from sibling
  listeners.

## Event Handler Details

The event handler demonstrates how to extract and store useful information from Geoman events:

1. **Event History**: Events are stored in an array (`gmEvents`) for tracking and analysis
2. **Feature Information**:
   - `id`: Extracts the feature ID if present
   - `shape`: Captures the type of shape involved
   - `geojson`: Safely extracts the GeoJSON representation of features
3. **Event Metadata**:
   - `timestamp`: Adds a timestamp to each event
   - `type`: Records the event type
   - `enabled`: Tracks mode state for toggle events

The `getGeoJson` helper function safely extracts GeoJSON data from features:
- Uses try/catch to handle potential errors
- Formats the JSON for readability using `JSON.stringify` with spacing
- Returns a fallback message if extraction fails

Example event data stored using the above event handler:
```typescript
const event = {
  id: "feature-123",
  enabled: true,
  timestamp: "14:30:45",
  type: "gm:create",
  shape: "polygon",
  geojson: {
    "type": "Feature",
    "properties": {
      "shape": "polygon"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [/* ... */]
    }
  }
}
```


# Event Types

Here are some common event payload types:

```typescript
interface FeatureCreatedFwdEvent {
  name: 'gm:create';
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

interface FeatureUpdatedFwdEvent {
  name: `gm:${FwdEditModeName}`;
  map: AnyMapInstance;
  shape?: FeatureShape;
  feature?: FeatureData; // The feature being edited if a single feature is being edited (e.g., during edit mode)
  features?: Array<FeatureData>; // The features being edited if multiple features are involved (e.g., during cut mode/split mode)
  originalFeature?: FeatureData;
  originalFeatures?: Array<FeatureData>;
}

interface GlobalEditToggledFwdEvent {
  name: `gm:global${FwdEditModeName}modetoggled`;
  enabled: boolean;
  map: AnyMapInstance;
}
```

## Best Practices

1. **Event Handler Organization**: Keep event handlers organized by category
```typescript
const drawHandlers = {
  onCreate: (event) => { /* ... */ },
  onUpdate: (event) => { /* ... */ },
};

const editHandlers = {
  onEditStart: (event) => { /* ... */ },
  onEditEnd: (event) => { /* ... */ },
};
```

2. **Error Handling**: Always include error handling in event listeners
```typescript
geoman.mapAdapter.on('gm:create', (event) => {
  try {
    // Process event
  } catch (error) {
    console.error('Error processing create event:', error);
  }
});
```

3. **Cleanup**: Remove event listeners when they're no longer needed
```typescript
const handler = (event) => { /* ... */ };
geoman.mapAdapter.on('gm:create', handler);

// Later...
geoman.mapAdapter.off('gm:create', handler);
```

4. **Performance**: Be mindful of performance in high-frequency events
```typescript
import { debounce } from 'lodash';

const debouncedHandler = debounce((event) => {
  // Process event...
}, 100);

geoman.mapAdapter.on('gm:drag', debouncedHandler);
```
