import React from 'react';
import GeoUtil from '../../shared/utils/GeoUtil.ts';
import { getGreatCircleBearing } from 'geolib';
import { PositionInterface, PositionChangedCallback } from './types.ts';

const UPDATE_LOCATION_INTERVAL = 1000;

export function useRouteEmulator(onPositionChanged: PositionChangedCallback | null) {
    const [routePath, setRoutePath] = React.useState<PositionInterface[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

    function startRoute(route: google.maps.DirectionsRoute) {
        if (isPlaying) {
            return;
        }

        prepareRoutePath(route);
        setIsPlaying(true);
    }

    function prepareRoutePath(route: google.maps.DirectionsRoute) {
        const coordinates = route.legs
            .flatMap(leg => leg.steps)
            .flatMap(step => step.path.map((latLng) => latLng.toJSON()))
            .filter(Boolean);

        const interpolated = GeoUtil.interpolatePolyline(coordinates, 3);

        const path = interpolated.map((latLng, index) => {
            const nextLatLng = interpolated[index + 1];
            const heading = nextLatLng ? getGreatCircleBearing(latLng, nextLatLng) : 0;
            return { latLng, heading };
        });

        setRoutePath(path);
    }

    React.useEffect(() => {
        let intervalId: number | null = null;
        if (isPlaying) {
            intervalId = setInterval(
                () => setCurrentIndex(prev => prev + 1),
                UPDATE_LOCATION_INTERVAL,
            );
        }

        return () => {
            intervalId && clearInterval(intervalId);
        };
    }, [isPlaying]);

    React.useEffect(() => {
        if (typeof onPositionChanged === 'function' && routePath.length) {
            onPositionChanged(routePath[currentIndex] || null);
        }
    }, [currentIndex, onPositionChanged, routePath]);

    return { startRoute, isPlaying, setIsPlaying };
}
