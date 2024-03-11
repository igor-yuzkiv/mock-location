import * as React from 'react';
import { WaypointInterface } from '@/widgets/waypoints-list';
import * as routeApi from '@/entities/route/api/routeApi.ts';
import { RouteInterface } from '@/entities/route';
import GeoUtil from '@/shared/lib/GeoUtil.ts';

export function useRouteDirection() {
    const [directionRoute, setDirectionRoute] = React.useState<RouteInterface | null>(null);
    const [directionPolyline, setDirectionPolyline] = React.useState<google.maps.Polyline | null>(null);

    async function buildRoute(waypoints: WaypointInterface[], mapObject: google.maps.Map | null): Promise<void> {
        if (waypoints.length < 2) return;
        resetRoute();

        const origin = waypoints.shift();
        const destination = waypoints.pop();
        if (!origin || !destination) return;

        const response = await routeApi
            .buildRoute(
                origin.location,
                destination.location,
                waypoints.map((waypoint) => waypoint.location),
            )
            .then(response => response.data)
            .catch(console.error);

        if (!response) {
            return response;
        }

        const decodedPath = response.encoded_path.flatMap(i => GeoUtil.decodePolyline(i));

        setDirectionRoute({
            ...response,
            decoded_path: decodedPath,
        });

        mapObject && renderPolyline(decodedPath, mapObject);
    }

    function renderPolyline(path: google.maps.LatLngLiteral[], mapObject: google.maps.Map) {
        if (directionPolyline) {
            directionPolyline.setMap(null);
        }

        const polyline = new google.maps.Polyline({
            path: path,
            strokeColor: '#0a66eb',
            strokeOpacity: 0.8,
            strokeWeight: 8,
        });

        polyline.setMap(mapObject);
        setDirectionPolyline(polyline);
    }

    function resetRoute() {
        if (directionPolyline) {
            directionPolyline.setMap(null);
            setDirectionPolyline(null);
        }
        setDirectionRoute(null);
    }

    return {
        buildRoute,
        directionRoute,
        resetRoute,
    };
}
