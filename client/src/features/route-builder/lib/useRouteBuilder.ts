import * as React from 'react';
import { WaypointInterface } from '@/widgets/waypoints-list';
import { RouteInterface } from '@/entities/route';
import * as routeApi from '@/entities/route/api/routeApi.ts';
import GeoUtil from '@/shared/lib/GeoUtil.ts';
import { toast } from 'react-toastify';

export function useRouteBuilder() {
    const [route, setRoute] = React.useState<RouteInterface | null>(null);
    const [routePolyline, setRoutePolyline] = React.useState<google.maps.Polyline | null>(null);

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
            .catch(e => console.error(e));

        if (!response) {
            toast.error('Failed to build route')
            return;
        }

        const decodedPath = response.encoded_path.flatMap(i => GeoUtil.decodePolyline(i));

        setRoute({
            ...response,
            decoded_path: decodedPath,
        });

        mapObject && renderPolyline(decodedPath, mapObject);
    }

    function renderPolyline(path: google.maps.LatLngLiteral[], mapObject: google.maps.Map) {
        if (routePolyline) {
            routePolyline.setMap(null);
        }

        const polyline = new google.maps.Polyline({
            path: path,
            strokeColor: '#0a66eb',
            strokeOpacity: 0.8,
            strokeWeight: 8,
        });

        polyline.setMap(mapObject);
        setRoutePolyline(polyline);
    }

    function resetRoute() {
        if (routePolyline) {
            routePolyline.setMap(null);
            setRoutePolyline(null);
        }
        setRoute(null);
    }

    return {
        buildRoute,
        route,
        resetRoute,
    };
}
