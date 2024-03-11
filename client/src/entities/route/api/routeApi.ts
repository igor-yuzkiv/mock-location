import { apiClient } from '@/app/apiClient.ts';
import { RouteInterface } from '@/entities/route';
import { AxiosResponse } from 'axios';

export async function buildRoute(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    waypoints?: google.maps.LatLngLiteral[],
): Promise<AxiosResponse<RouteInterface>> {
    return await apiClient.post('route', { origin, destination, waypoints: waypoints || [] });
}
