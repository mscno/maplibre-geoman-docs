---
title: "Data Layers ⭐"
description: "Named editable and display layers, thematic styles, schemas, and source ownership."
---

# Data Layers

Pro 0.11 exposes `gm.dataLayers` for named feature collections. The host owns its
UI and persistence; Geoman owns editing and rendering for layers it creates.

| Kind | Data ownership | Editing |
| --- | --- | --- |
| Editable | Geoman feature store and source | Full editing; eligible as active draw target |
| Display | Lightweight Geoman source | No feature editing |
| External, via `adopt()` | Existing host map layers | Never owned, restyled, or removed by Geoman |

There is no separate `interactive` kind.

## Create and populate an editable layer

Run this after `gm:loaded`:

```typescript
gm.dataLayers.add({
  id: 'parcels',
  name: 'Parcels',
  editable: true,
  geometryTypes: ['polygon'],
  style: {
    polygon: { fillColor: '#2563eb', fillOpacity: 0.3, strokeWidth: 2 },
  },
});
await gm.dataLayers.setData('parcels', featureCollection);
gm.dataLayers.setActive('parcels');
```

New draws go to the active layer. Features retain their home layer across
editing, copy, compound geometry operations, and undo/redo.

## Manage layers

| Method | Purpose |
| --- | --- |
| `add(spec)`, `remove(id)` | Create or remove an owned layer |
| `get(id)`, `list()` | Read resolved layer specs |
| `setData(id, geojson)` | Await replacement of a layer's data |
| `setStyle(id, style)` | Replace style and reset omitted paint properties |
| `setVisibility(id, visible)` | Show or hide |
| `setActive(id)`, `getActive()` | Select or read the editable draw target |
| `setEditable(id, editable)` | Convert display/editable state |
| `reorder(ids)` | First ID is frontmost; unknown/external layers are skipped |
| `setSchema(id, schema)`, `validate(id, properties)` | Configure/check attributes |

`get()` and `list()` return shallow spec copies; nested metadata remains
host-owned. Keep application state changes explicit through the API.

## Attribute-driven styles

```typescript
gm.dataLayers.setStyle('parcels', {
  polygon: {
    fillColor: {
      categorical: {
        field: 'status',
        categories: { available: '#22c55e', reserved: '#f59e0b' },
        fallback: '#94a3b8',
      },
    },
    fillOpacity: 0.4,
  },
  label: { field: 'name', size: 12, color: '#111827' },
});
```

Labels require `glyphs` in the map style. The portable DSL supports
`get`, `categorical`, `step`, and `interpolate`; numeric stops are sorted.
Raw MapLibre/Mapbox expression arrays are accepted but make that style
renderer-specific. Schema labels/descriptions/option colours are presentation
metadata for your application; Geoman does not generate an attribute editor or
automatically turn schema option colours into paint.

## Integrity and history

`geometryTypes` restricts accepted geometry. Enable `settings.validateSchema`
for schema enforcement and `settings.validateGeometry` for geometry checks.
Bulk `setData()` and display-to-editable conversion validate before mutation.
History replay restores prior data even if constraints have since changed.

Removing a layer also removes its features parked in editing scratch sources.
Disabling the active layer's editability clears that active target.
