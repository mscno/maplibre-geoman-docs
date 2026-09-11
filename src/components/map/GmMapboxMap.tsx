import { type GeoJsonImportFeature, Geoman, type GmOptionsData } from '@geoman-io/mapbox-geoman-pro';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@geoman-io/mapbox-geoman-pro/dist/mapbox-geoman.css';
import { getDisabledByDefaultOptions } from '@site/src/components/map/default-options';
import mapLibreStyle from '@site/src/components/map/map-libre-style';
import { merge } from 'lodash-es';
import mapboxgl, { type MapboxOptions } from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import type { PartialDeep } from 'type-fest';

// The public Mapbox token (pk.*) is injected at build time via DefinePlugin in
// docusaurus.config.ts, sourced from the MAPBOX_ACCESS_TOKEN environment variable.
// The demos render OpenStreetMap raster tiles rather than Mapbox-hosted resources,
// so an empty token still produces a working map; a token is set here so Mapbox
// styles and APIs are available if a demo opts into them.
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || '';

interface ComponentProps {
  gmOptions?: PartialDeep<GmOptionsData>;
  features?: Array<GeoJsonImportFeature>;
}


const Component: React.FC<ComponentProps> = ({
  gmOptions: gmOptionsOverride,
  features,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<(mapboxgl.Map & { gm: Geoman }) | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const mapOptions: MapboxOptions = {
        container: mapContainerRef.current,
        // The OSM raster style is shared with the MapLibre pane; it is valid for
        // both renderers, so we reuse it here (cast to satisfy Mapbox's typings).
        style: mapLibreStyle as unknown as MapboxOptions['style'],
        center: [0, 51],
        zoom: 6,
        fadeDuration: 50,
      };

      const map = new mapboxgl.Map(mapOptions) as mapboxgl.Map & { gm: Geoman };

      // `getDisabledByDefaultOptions` is shared with the MapLibre pane and is
      // typed against the MapLibre build of Geoman. The option shape is identical
      // at runtime, but the two packages declare structurally-divergent
      // `layerStyles` types, so we cast to the Mapbox build's option type here.
      const gmOptions = getDisabledByDefaultOptions() as unknown as PartialDeep<GmOptionsData>;
      merge(gmOptions, gmOptionsOverride);

      const geoman = new Geoman(map, gmOptions);
      geoman.mapAdapter.on(`gm:loaded`, () => {
        features?.forEach((feature) => {
          geoman.features.importGeoJsonFeature(feature);
        });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainerRef}
         style={{ height: '400px', width: '100%' }} />);
};

export default Component;
