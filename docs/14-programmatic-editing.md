---
title: "Programmatic Editing ⭐"
description: "Undoable geometry and attribute operations, validation, grid snapping, buffering, and WKT."
---

# Programmatic Editing

Pro 0.11 lets your own UI drive `gm.edit`. In-place edits record history and
emit `gm:edit`, then `gm:editend`, so the same persistence handler can cover
interactive and programmatic changes.

```typescript
gm.edit.setGeometry(featureId, geometry);
gm.edit.setProperties(featureId, properties);
gm.edit.repairGeometry(featureId);
gm.edit.snapToGrid(featureId, 0.00001);
gm.edit.buffer(featureId, 10, { units: 'meters' });
```

Inspect operation results and listen for rejection events before presenting an
edit as successful. Repair/snap operations that change nothing do not add an
unnecessary history entry. Buffering in place requires a polygon and rejects
collapsed results.

## Pure geometry utilities

Import these from `@geoman-io/maplibre-geoman-pro`:

| Utility | Purpose |
| --- | --- |
| `validateFeatureGeometry(geometry)` | Report too few vertices and polygon self-intersections |
| `repairFeatureGeometry(geometry)` | Remove duplicate vertices and split self-intersections into valid parts |
| `snapGeometryToGrid(geometry, size, origin?)` | Round geometry coordinates |
| `snapLngLatToGrid(lngLat, size, origin?)` | Round one coordinate |
| `bufferGeometry(geometry, distance, options?)` | Produce a Polygon/MultiPolygon area, or null if it collapses |
| `geometryToWkt(geometry)` | Serialize geometry as WKT |
| `wktToGeometry(wkt)` | Parse WKT, returning null for malformed input |

Grid size and origin use coordinate units (degrees), not metres. Interactive
grid snapping is enabled with `settings.gridSnap = { size, origin? }`.
Buffer distance defaults to metres; negative values shrink. Use the pure buffer
utility for points/lines, then explicitly add its resulting area to your app.
WKT uses `@terraformer/wkt`, including its supported empty geometry behavior.

## Merge and explode attributes

```typescript
const gm = new Geoman(map, {
  settings: { mergeAttributeStrategy: 'union' },
});
gm.edit.merge(featureIds, { attributes: 'primary' });
```

`primary` (default) keeps the first feature's properties. `union` combines
properties with the primary feature winning collisions. `none` starts with no
custom properties. Explode copies source attributes onto every part; generated
features always receive fresh identities.

## Persist compound operations once

Explode, merge-parts, and split emit granular create/remove events plus lineage
events. Lineage payloads always use `originalFeatures` and `features` arrays.
Choose one persistence channel to avoid double-counting; set
`settings.compoundLineageEvents: false` for granular events only.
