import { Dimensions } from 'react-native';
import React from 'react';
import GeoUtil from '../uitls/GeoUtil';
import { Region } from 'react-native-maps';

const screen = Dimensions.get('window');

export const ASPECT_RATIO = screen.width / screen.height;
export const LATITUDE_DELTA = 0.04;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const HOME_COORDINATE = {
    latitude: 49.44344167971898,
    longitude: 25.58589595881716,
};

export const INITIAL_REGION = {
    latitude: HOME_COORDINATE.latitude,
    longitude: HOME_COORDINATE.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};

export function useMapRegion() {
    const [region, setRegion] = React.useState<Region>(INITIAL_REGION);

    function updateRegion(value: unknown) {
        const coords = GeoUtil.toCoordinate(value);
        if (!coords) {
            return;
        }
        setRegion({
            ...INITIAL_REGION,
            ...coords,
        });
    }

    return { region, updateRegion };
}
