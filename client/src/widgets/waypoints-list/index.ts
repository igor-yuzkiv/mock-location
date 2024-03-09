export { WaypointsList } from './ui/WaypointsList';

export interface WaypointInterface {
    id: string;
    marker: google.maps.Marker,
    location: google.maps.LatLngLiteral;
    stopover: boolean;
    address: string | null;
}
