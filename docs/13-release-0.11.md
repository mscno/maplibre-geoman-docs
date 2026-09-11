---
title: "Upgrading to Pro 0.11"
description: "Stable release notes and migration guide for Geoman Pro 0.11."
---

# Geoman Pro 0.11.0

This stable release promotes the editor-platform work from the 0.9.2 and 0.10.0
prereleases, including all changes through 0.10.0-alpha.2. The summary below covers
the upgrade from the previous stable release, 0.9.1; the [repository changelog](https://github.com/geoman-io/maplibre-geoman-pro/blob/master/CHANGELOG.md) retains the detailed prerelease history.

### Breaking changes and migration

- **MapLibre GL JS 6 is required** (`>=6.0.0 <7.0.0`); this release is tested with
  6.7.0. Configure `setWorkerUrl()` before constructing a map. With Vite:

  ```typescript
  import * as maplibregl from 'maplibre-gl';
  import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
  maplibregl.setWorkerUrl(workerUrl);
  ```

- **MapLibre Pro is ESM-only.** Replace CommonJS/UMD loading with ESM imports.
  MapLibre 6 has no default export; replace default imports with namespace or
  named imports. See [Basics](/basics) for worker setup.
  The Mapbox Pro variant continues to ship ESM and UMD.
- Compound lineage events `gm:explode`, `gm:merge_parts`, and `gm:split` always
  use `originalFeatures` / `features` arrays. Migrate handlers that read the
  singular payload. These events accompany granular create/remove events;
  subscribe to one persistence channel, or set `compoundLineageEvents: false`.
- For prerelease consumers: data layers support editable, display, and adopted
  external layers; the experimental `interactive` kind was removed.
  `dataLayers.setData()` is awaitable. Layer specs are shallow copies with
  host-owned metadata retained by reference. The unused schema `default` field
  was removed; presentation metadata does not generate UI or styling.

### Added

- **Named data layers** through `geoman.dataLayers`: add/remove/list/get,
  replace data, update styles and visibility, select the active draw target,
  switch editable/display state, adopt host-owned map layers, and reorder owned
  layers. Each layer can restrict geometry types and define a feature schema.
- **Thematic styling** with `get`, `categorical`, `step`, and `interpolate`,
  plus raw renderer-expression arrays. Fill, line, point opacity, and optional
  attribute labels update at runtime. Labels require glyphs in the map style;
  raw expressions are renderer-specific.
- **Programmatic undoable editing**: `geoman.edit.setGeometry()`,
  `setProperties()`, `repairGeometry()`, `snapToGrid()`, and `buffer()`.
  In-place edits emit `gm:edit` followed by `gm:editend`.
- **Geometry utilities**: validation, repair of duplicate vertices and
  self-intersecting polygons, coordinate-grid snapping, positive/negative
  buffering, and WKT import/export backed by `@terraformer/wkt`.
  Geometry and schema enforcement are opt-in via `validateGeometry` and
  `validateSchema`. Grid size/origin use coordinate units (degrees).
- **Public geofencing API**: containment and intersection-restriction setters,
  getters, and clear. Constraints reference live features; rejected operations
  emit `gm:geofencing_violation`.
- **Keyboard editing**: arrow-key nudging (2 pixels by default, tenfold with
  Shift) and Enter to finish line/polygon drawing. Shortcuts are map-container
  scoped and guard form inputs; bindings can be configured partially.
- **Accessibility and localisation**: polite screen-reader announcements for
  selection changes and rejected operations, `announcementResolver`, and
  `selectionMessageResolver` for disabled-control guidance. Announcements can
  be disabled with `announceActions: false`.
- **Merge attribute policy**: `mergeAttributeStrategy` supports `primary`
  (default), `union`, and `none`; override per call with
  `geoman.edit.merge(ids, { attributes })`. Exported policy types, constants,
  and `mergeFeatureProperties` support host integrations.
- **Lifecycle event** `gm:unloaded` on destruction.
- Source-only draft Mapbox React bindings mirror the MapLibre hooks and controls,
  with generated-source drift checks. These wrappers are not newly published
  packages in this release.

### Fixed

- Features retain their home data layer across draw, drag, rotate, scale,
  vertex editing, copy, split, union/difference, merge/explode, and undo/redo.
  Removing a layer during editing no longer lets its features escape to main.
- Copy creates a fresh feature identity. Explode preserves source attributes on
  every part; merge preserves attributes according to the selected policy.
  Compound history remains atomic.
- Data replacement and display-to-editable conversion validate before mutation.
  Geometry restrictions and opt-in schema checks apply across API entry points.
  Undo/redo can restore historical data after constraints change.
- Runtime styles reset omitted properties, reconcile label layers, filter paint
  by geometry type, sort numeric stops, and handle empty thematic expressions.
  Categorical styling correctly matches numeric values and numeric-looking keys.
- Source teardown cleans pending updates and timers; transactions cover dynamic
  data-layer sources; disabling the active editable layer clears the draw target.
- Multi-feature events await all affected data sources. Host listener exceptions
  are isolated; right-click vertex deletion emits a complete edit lifecycle.
- Keyboard nudges account for each feature's Mercator location. Tiny grid sizes
  retain precision, Enter reports invalid incomplete shapes as a no-op, and
  repeated announcer startup does not duplicate live regions.
- MapLibre 6 source updates use the current promise API. Layer property setters
  and the event bridge support stricter types while retaining custom event
  payloads and listener identity.

### Dependencies, builds, and release tooling

- Update MapLibre GL JS to 6.7.0, Mapbox GL JS to 3.30.0, Turf to 7.4.0, and
  compatible build/test dependencies under the seven-day dependency cooldown.
- Retain TypeScript 6.0.3 and tsc-alias 1.8.17 for working preprocessing and
  declaration output. Refresh security fixes and transitive resolutions.
- Build/typecheck cache keys include shared core sources and root TypeScript
  configuration. CI runs on master pushes and verifies variant-specific bundle
  formats; MapLibre artifact validation no longer expects a UMD bundle.
- React binding synchronisation detects nested changes and stale generated
  files. Browser tests wait for rendered features before dragging data layers.

[Full comparison with 0.9.1](https://github.com/geoman-io/maplibre-geoman-pro/compare/v0.9.1...v0.11.0)

