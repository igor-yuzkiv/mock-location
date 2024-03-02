import { WaypointInterface } from '../../shared/types/WaypointInterface.ts';
import { fetchDirections, renderDirection } from '../../shared/api/googleMaps.ts';

export function useRouteBuilder() {
    async function buildRoute(waypoints: WaypointInterface[], mapObject: google.maps.Map | null): Promise<void> {
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

        console.log([response, mapObject])
        if (response && mapObject) {
            await renderDirection(response, mapObject);
        }
    }

    return {
        buildRoute,
    };
}
