import * as GeoLib from 'geolib';

export function standardizeCoordinate(coordinate) {
    if (Array.isArray(coordinate)) {
        return {
            latitude: +coordinate[0],
            longitude: +coordinate[1],
        };
    }

    if (coordinate.latitude && coordinate.longitude) {
        return {
            latitude: +coordinate.latitude,
            longitude: +coordinate.longitude,
        };
    }

    return {
        latitude: +coordinate.lat,
        longitude: +coordinate.lng,
    };
}

export const toArcPolygon = (coordinate, initialBearing, finalBearing, radius) =>
{
    const d2r = Math.PI / 180;   // degrees to radians
    const r2d = 180 / Math.PI;   // radians to degrees
    const points = 32;
    let result = [];

    // find the radius in lat/lon
    //const rlat = (radius / EARTH_RADIUS_METERS) * r2d;
    //const rlng = rlat / Math.cos({coordinate.latitude * d2r);

    if (initialBearing > finalBearing) finalBearing += 360;
    let deltaBearing = finalBearing - initialBearing;
    deltaBearing = deltaBearing/points;

    for (let i=0; (i < points+1); i++)
    {
        result.push(GeoLib.computeDestinationPoint(coordinate, radius, initialBearing + i*deltaBearing));
    }

    return result;
};