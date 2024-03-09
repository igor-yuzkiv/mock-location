import * as GeoLib from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import { decode } from '@googlemaps/polyline-codec';

export default {
    toString(latLng: google.maps.LatLngLiteral): string {
        if (!latLng) {
            return '';
        }

        return `${latLng.lat.toFixed(6)},${latLng.lng.toFixed(6)}`;
    },

    toCoordinate(value: unknown): google.maps.LatLngLiteral | null {
        if (!value) {
            return null;
        }

        const latKey = GeoLib.getCoordinateKey(value as GeolibInputCoordinates, GeoLib.latitudeKeys) as keyof typeof value;
        const lngKey = GeoLib.getCoordinateKey(value as GeolibInputCoordinates, GeoLib.longitudeKeys) as keyof typeof value;

        if (latKey !== undefined && lngKey !== undefined) {
            return {
                lat: +value[latKey],
                lng: +value[lngKey],
            };
        }

        return null;
    },

    decodePolyline(encodedPath: string): google.maps.LatLngLiteral[] {
        return decode(encodedPath).map((latLng) => ({ lat: latLng[0], lng: latLng[1] }));
    },

    interpolatePoints(p1: google.maps.LatLngLiteral, p2: google.maps.LatLngLiteral, fraction: number = 10) {
        const distance = GeoLib.getDistance(p1, p2);
        if (distance <= fraction) return [];

        const numberOfSteps = Math.floor(distance / fraction);
        if (numberOfSteps <= 1) return [];

        const bearing = GeoLib.getGreatCircleBearing(p1, p2);
        const result = [p1];

        for (let i = 0; i < numberOfSteps; i++) {
            const point = this.toCoordinate(
                GeoLib.computeDestinationPoint(
                    result[result.length - 1],
                    fraction,
                    bearing,
                ));

            point && result.push(point);
        }

        return result;
    },

    interpolatePolyline(decodedPolyline: google.maps.LatLngLiteral[], fraction = 30): google.maps.LatLngLiteral[] {
        const points = [];
        for (let i = 0; i < decodedPolyline.length; i++) {
            if (!decodedPolyline[i + 1]) {
                points.push(decodedPolyline[i]);
                break;
            }
            const part = this.interpolatePoints(
                decodedPolyline[i],
                decodedPolyline[i + 1],
                fraction,
            );

            if (!part.length) {
                continue;
            }

            points.push(...part);
        }
        return points;
    },

    coordinatesToBoundLiteral(coordinates: google.maps.LatLngLiteral[]): google.maps.LatLngBoundsLiteral {
        const bounds = GeoLib.getBounds(coordinates);
        return {
            east: bounds.maxLng,
            north: bounds.maxLat,
            south: bounds.minLat,
            west: bounds.minLng,
        };
    },
};
