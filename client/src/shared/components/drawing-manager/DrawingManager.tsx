import React from 'react';
import { MapViewContext } from '@/shared/components/map-view/MapViewContext.ts';

type DrawingManagerPropType = {
    onMarkerComplete?: (marker: google.maps.Marker) => void;
};

export function DrawingManager({ onMarkerComplete }: DrawingManagerPropType) {
    const { mapObject } = React.useContext(MapViewContext);
    const [drawingManager, setDrawingManager] = React.useState<google.maps.drawing.DrawingManager | null>(null);

    React.useEffect(() => {
        (async () => {
            if (!mapObject || drawingManager) return;

            const { DrawingManager } = (await google.maps.importLibrary('drawing')) as google.maps.DrawingLibrary;
            const manager = new DrawingManager({
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.INLINE_END_BLOCK_CENTER,
                    drawingModes: [google.maps.drawing.OverlayType.MARKER],
                },
            });

            if (onMarkerComplete) {
                manager.addListener('markercomplete', onMarkerComplete);
            }

            manager.setMap(mapObject);
            setDrawingManager(manager);
        })();

        return () => {
            drawingManager && drawingManager.setMap(null);
        };

    }, []);

    return null;
}
