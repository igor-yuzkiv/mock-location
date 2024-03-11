import { Client, DirectionsResponse, LatLng, TravelMode } from '@googlemaps/google-maps-services-js';
import { DirectionsRoute } from '@googlemaps/google-maps-services-js/src/common';
import { RouteInterface } from '../route.model';

async function fetchRoute(origin: LatLng, destination: LatLng, waypoints: LatLng[]): Promise<DirectionsRoute> {
    const client = new Client({});

    const requestParams = {
        key: process.env.GOOGLE_MAP_API_KEY as string,
        origin: origin,
        destination: destination,
        mode: TravelMode.driving,
        waypoints: waypoints,
        optimize: waypoints.length > 0,
        alternatives: false,
    };

    const response = await client
        .directions({ params: requestParams })
        .then((response: DirectionsResponse) => response.data);

    if (response?.routes?.length) {
        return response.routes[0];
    }

    const { status } = response;
    throw new Error('Failed to fetch route from Google Maps API. Status code: ' + status || 'unknown');
}

export default async function(origin: LatLng, destination: LatLng, waypoints: LatLng[]): Promise<RouteInterface> {
    const directionRoute = await fetchRoute(origin, destination, waypoints);

    const encodedPath = directionRoute.legs.flatMap(leg => leg.steps)
        .flatMap(step => step.polyline.points);

    return {
        encoded_path: encodedPath,
    };
}
