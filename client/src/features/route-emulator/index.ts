
export { RouteEmulatorSettings } from './ui/RouteEmulatorSettings.tsx';

export { useRouteEmulator } from './lib/useRouteEmulator.ts';

export { useRouteEmulatorSettings } from './lib/useRouteEmulatorSettings.ts';

export { useCurrentPositionMarker } from './lib/useCurrentPositionMarker.ts';

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
