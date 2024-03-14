import * as GeoLib from 'geolib';
import { LatLng } from 'react-native-maps';
import { GeolibInputCoordinates } from 'geolib/es/types';

function toCoordinate(value: unknown): LatLng | null {
    if (!value) {
        return null;
    }

    const latKey = GeoLib.getCoordinateKey(value as GeolibInputCoordinates, GeoLib.latitudeKeys) as keyof typeof value;
    const lngKey = GeoLib.getCoordinateKey(value as GeolibInputCoordinates, GeoLib.longitudeKeys) as keyof typeof value;

    if (latKey !== undefined && lngKey !== undefined) {
        return {
            latitude: +value[latKey],
            longitude: +value[lngKey],
        };
    }

    return null;
}


export default {
    toCoordinate,
};
