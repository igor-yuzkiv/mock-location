
export { RouteEmulatorSettings } from './ui/RouteEmulatorSettings.tsx';

export interface PositionInterface {
    latLng: google.maps.LatLngLiteral;
    heading: number;
    expired: boolean,
}

export interface EmulatorOptionsInterface {
    speed: number; // in m/s
    tilt: number;
    zoom: number;
    follow: boolean;
}
