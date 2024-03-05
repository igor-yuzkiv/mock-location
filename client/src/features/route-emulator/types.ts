export interface PositionInterface {
    latLng: google.maps.LatLngLiteral;
    heading: number;
}
export type PositionChangedCallback = (position: PositionInterface | null) => void;
