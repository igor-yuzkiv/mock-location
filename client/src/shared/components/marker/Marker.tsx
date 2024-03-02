import React from 'react';
import { MapViewContext } from '../map-view/MapViewContext.ts';

type MarkerProps = {
    position: google.maps.LatLngLiteral;
    onDragEnd?: (event: google.maps.MapMouseEvent) => void;
};

export default function Marker({ position, onDragEnd }: MarkerProps) {
    const { mapObject } = React.useContext(MapViewContext);
    const [markerObject, setMarkerObject] = React.useState<google.maps.marker.AdvancedMarkerElement | null>(null);

    React.useEffect(() => {
        if (mapObject && !markerObject) {
            (async () => {
                const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                    'marker',
                )) as google.maps.MarkerLibrary;

                setMarkerObject(new AdvancedMarkerElement({ map: mapObject }));
            })();
        }

        return () => {
            if (markerObject) {
                markerObject.map = null;
            }
        };
    }, [mapObject, markerObject]);

    React.useEffect(() => {
        if (markerObject) {
            markerObject.position = position;
        }
    }, [markerObject, position]);

    React.useEffect(() => {
        if (onDragEnd && markerObject && !markerObject.gmpDraggable) {
            markerObject.gmpDraggable = true;
            markerObject.addListener('dragend', onDragEnd);
        }
    }, [markerObject, onDragEnd]);

    return null;
}
