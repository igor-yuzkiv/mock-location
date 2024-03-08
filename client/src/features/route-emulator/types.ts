export interface PositionInterface {
    latLng: google.maps.LatLngLiteral;
    heading: number;
    expired: boolean,
}
export type PositionChangedCallback = (position: PositionInterface | null) => void;
