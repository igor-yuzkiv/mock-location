import React from 'react';
import GeoUtil from '../../shared/utils/GeoUtil.ts';
import { getGreatCircleBearing } from 'geolib';
import { PathItemInterface } from './types.ts';

export function useRouteEmulator() {
    const [routePath, setRoutePath] = React.useState<PathItemInterface[]>([]);

    function playRoute(route: google.maps.DirectionsRoute) {
        prepareRoutePath(route);
    }

    function prepareRoutePath(route: google.maps.DirectionsRoute) {
        const coordinates = route.legs
            .flatMap((leg) => {
                return leg.steps.flatMap((step) => step.path.map((latLng) => latLng.toJSON()));
            })
            .filter(Boolean);
        const interpolated = GeoUtil.interpolatePolyline(coordinates, 3);

        const path = interpolated.map((latLng, index) => {
            const nextLatLng = interpolated[index + 1];
            const heading = nextLatLng ? getGreatCircleBearing(latLng, nextLatLng) : 0;
            return { latLng, heading };
        });
        console.log(path);
        setRoutePath(path);
    }

    return { playRoute };
}
