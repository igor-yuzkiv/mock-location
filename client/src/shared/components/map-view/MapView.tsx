import React from 'react';
import { DEFAULT_MAP_OPTIONS } from '@/shared/constants/GoogleMapConstants.ts';
import { MapViewContext } from './MapViewContext.ts';

import MapOptions = google.maps.MapOptions;

async function initializeMap(mapElement: HTMLDivElement, options: Partial<MapOptions>) {
    return new google.maps.Map(mapElement, {
        ...DEFAULT_MAP_OPTIONS,
        ...options,
    });
}

type MapViewPropsTypes = {
    children?: React.ReactNode;
    onMapReady?: (map: google.maps.Map) => void;
    onMapClick?: (event: google.maps.MapMouseEvent) => void;
    mapOptions?: Partial<MapOptions>;
};

export function MapView({ children, mapOptions, onMapReady, onMapClick }: MapViewPropsTypes) {
    const mapElementRef = React.useRef<Nullable<HTMLDivElement>>(null);
    const [mapObject, setMapObject] = React.useState<google.maps.Map | null>(null);

    React.useEffect(() => {
        if (mapElementRef.current) {
            initializeMap(mapElementRef.current, mapOptions ?? {})
                .then((obj) => {
                    if (!obj) return;
                    setMapObject(obj);
                    if (typeof onMapReady === 'function') {
                        onMapReady(obj);
                    }
                })
                .catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (mapObject && mapOptions) {
            mapObject.setOptions(mapOptions);
        }
    }, [mapObject, mapOptions]);

    React.useEffect(() => {
        if (mapObject && onMapClick) {
            mapObject.addListener('click', onMapClick);
        }
    }, [mapObject, onMapClick]);

    return (
        <MapViewContext.Provider value={{ mapObject }}>
            <div className="flex w-full h-full" ref={mapElementRef} />
            {mapObject && children}
        </MapViewContext.Provider>
    );
}
