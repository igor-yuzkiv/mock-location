import * as React from 'react';
import { WaypointInterface } from '@/widgets/waypoints-list';
import { RouteInterface } from '@/entities/route';
import * as routeApi from '@/entities/route/api/routeApi.ts';
import GeoUtil from '@/shared/lib/GeoUtil.ts';
import { toast } from 'react-toastify';

export function useRouteBuilder() {
    const [route, setRoute] = React.useState<RouteInterface | null>(null);

    async function buildRoute(waypoints: WaypointInterface[]): Promise<void> {
        if (waypoints.length < 2) return;

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
    }

    return {
        buildRoute,
        route,
        setRoute,
    };
}
