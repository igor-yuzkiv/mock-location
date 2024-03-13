import React from 'react';
import GeoUtil from '@/shared/lib/GeoUtil.ts';
import { getGreatCircleBearing } from 'geolib';
import { EmulatorOptionsInterface, PositionInterface } from '@/features/route-emulator';
import { DEFAULT_MAP_OPTIONS } from '@/shared/constants/GoogleMapConstants.ts';
import { useCurrentPositionMarker } from '@/features/route-emulator/lib/useCurrentPositionMarker.ts';
import { RouteInterface } from '@/entities/route';

const UPDATE_LOCATION_INTERVAL = 1000;
const INTERPOLATION_FRACTION = 3;
const MAP_ZOOM = 30;
const MAP_TILT = 90;

export function useRouteEmulator(mapObject: Nullable<google.maps.Map>, options?: EmulatorOptionsInterface, onPositionChange?: (position: PositionInterface) => void) {
    const [routePath, setRoutePath] = React.useState<PositionInterface[]>([]);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const currentPosition = React.useMemo<PositionInterface | null>(() => {
        return routePath[currentIndex] || null;
    }, [currentIndex, routePath]);

    function startRoute(route: RouteInterface) {
        prepareRoutePath(route);
        setIsPlaying(true);
    }

    useCurrentPositionMarker(currentPosition, mapObject);

    function resetRoute() {
        setRoutePath([]);
        setCurrentIndex(0);
        setIsPlaying(false);

        if (mapObject) {
            mapObject.setZoom(DEFAULT_MAP_OPTIONS.zoom);
            mapObject.setTilt(DEFAULT_MAP_OPTIONS.tilt);
        }
    }

    function prepareRoutePath(route: RouteInterface) {
        if (!route.decoded_path || !route.decoded_path.length) {
            return;
        }

        const interpolated = GeoUtil.interpolatePolyline(route.decoded_path, options?.speed || INTERPOLATION_FRACTION);
        const path = interpolated.map((latLng, index) => {
            const nextLatLng = interpolated[index + 1];
            const heading = nextLatLng ? getGreatCircleBearing(latLng, nextLatLng) : 0;
            return { latLng, heading, expired: false };
        });

        setRoutePath(path);
    }

    const changePositionHandler = React.useCallback(
        (index: number) => {
            if (!isPlaying || !mapObject) return;

            const position = routePath[index];
            if (position && !position.expired && options?.follow) {
                mapObject?.panTo(position.latLng);
                mapObject?.setZoom(options ? options.zoom : MAP_ZOOM);
                mapObject?.setTilt(options ? options.tilt : MAP_TILT);
                mapObject?.setHeading(position.heading);

                onPositionChange && onPositionChange(position);
            }
        },
        [isPlaying, routePath, mapObject, options, onPositionChange],
    );

    React.useEffect(() => {
        let intervalId: number | null = null;
        if (isPlaying) {
            intervalId = setInterval(() => setCurrentIndex((prev) => prev + 1), UPDATE_LOCATION_INTERVAL);
        }

        return () => {
            intervalId && clearInterval(intervalId);
        };
    }, [isPlaying]);

    React.useEffect(() => {
        changePositionHandler(currentIndex);
    }, [currentIndex, changePositionHandler]);

    return {
        routePath,
        startRoute,
        isPlaying,
        setIsPlaying,
        resetEmulator: resetRoute,
        currentPosition,
    };
}
