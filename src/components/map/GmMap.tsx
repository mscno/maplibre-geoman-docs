import useBaseUrl from '@docusaurus/useBaseUrl';
import { type GeoJsonImportFeature, Geoman, type GmOptionsData } from '@geoman-io/maplibre-geoman-pro';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@geoman-io/maplibre-geoman-pro/dist/maplibre-geoman.css';
import { getDisabledByDefaultOptions } from '@site/src/components/map/default-options';
import mapLibreStyle from '@site/src/components/map/map-libre-style';
import { merge } from 'lodash-es';
import * as ml from 'maplibre-gl';
import type { MapOptions } from 'maplibre-gl';
import React, { useEffect, useRef } from 'react';
import type { PartialDeep } from 'type-fest';

interface ComponentProps {
  gmOptions?: PartialDeep<GmOptionsData>;
  features?: Array<GeoJsonImportFeature>;
}


const Component: React.FC<ComponentProps> = ({
  gmOptions: gmOptionsOverride,
  features,
}) => {
  const workerUrl = useBaseUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ml.Map & { gm: Geoman } | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const mapOptions: MapOptions = {
        container: mapContainerRef.current,
        style: mapLibreStyle,
        center: [0, 51],
        zoom: 6,
        fadeDuration: 50,
      };

      ml.setWorkerUrl(workerUrl);

      const map = new ml.Map(mapOptions) as ml.Map & { gm: Geoman };

      const gmOptions = getDisabledByDefaultOptions();
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
    <div id="dev-map"
         ref={mapContainerRef}
         style={{ height: '400px', width: '100%' }} />);
};

export default Component;
