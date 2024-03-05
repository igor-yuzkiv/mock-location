import * as React from 'react';
import { WaypointInterface } from '../waypoints-list/types.ts';
import { fetchDirections, renderDirection } from '../../shared/api/googleMaps.ts';

export function useRouteBuilder() {
    const [directionsResult, setDirectionsResult] = React.useState<google.maps.DirectionsResult | null>(null);
    const [directionRenderer, setDirectionRenderer] = React.useState<google.maps.DirectionsRenderer | null>(null);

    async function buildRoute(waypoints: WaypointInterface[], mapObject: google.maps.Map | null): Promise<void> {
        resetRoute();
        if (waypoints.length < 2) {
            return;
        }

        const origin = waypoints.shift();
        const destination = waypoints.pop();
        if (!origin || !destination) {
            return;
        }

        const response = await fetchDirections(
            origin.location,
            destination.location,
            waypoints.map(waypoint => {
                return {
                    location: waypoint.location,
                    stopover: waypoint.stopover,
                };
            }),
        );

        if (!response || !mapObject) {
            return;
        }

        setDirectionsResult(response);
        setDirectionRenderer(await renderDirection(response, mapObject));
    }

    function resetRoute() {
        if (directionRenderer) {
            directionRenderer.setMap(null);
            setDirectionRenderer(null);
        }

        setDirectionsResult(null);
    }

    return {
        buildRoute,
        directionsResult,
        resetRoute,
    };
}
