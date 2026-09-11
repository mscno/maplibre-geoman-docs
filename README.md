# Geoman Documentation Website

This website is built with [Docusaurus](https://docusaurus.io/) and deployed to `https://geoman.io/docs/maplibre`.

It documents both adapter families:

- `@geoman-io/maplibre-geoman-*`
- `@geoman-io/mapbox-geoman-*`

The docs are aligned with the current workspace structure in sibling repositories:

- `../maplibre-geoman` (free): `packages/core`, `packages/maplibre`, `packages/mapbox`
- `../maplibre-geoman-pro` (pro): `packages/core`, `packages/maplibre`, `packages/mapbox`, `packages/maplibre-pro`, `packages/mapbox-pro`

## Contributing

PRs that improve documentation are welcome.

## Working Locally

### Installation

```shell
pnpm install
```

### Local Development

```shell
pnpm start
```

Starts a local development server with live reload.

### Build

```shell
pnpm build
```

Generates static content into the `build` directory.

## Geoman Pro 0.11

Embedded demos use Geoman Pro 0.11.0 and MapLibre GL JS 6.7.0.
The prebuild/prestart hook copies both MapLibre module-worker files into
static assets; worker URLs respect the Docusaurus base URL.
