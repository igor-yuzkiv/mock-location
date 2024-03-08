import React from 'react';
import MapView from '@/shared/components/map-view/MapView.tsx';
import { GOOGLE_MAP_API_KEY, HOME_COORDINATES } from '@/shared/constants/GoogleMapConstants.ts';
import { Wrapper } from '@googlemaps/react-wrapper';
import { DrawingManager } from '@/shared/components/drawing-manager/DrawingManager.tsx';
import { Flyout } from '@/shared/components/flyout/Flyout.tsx';
import { WaypointsList } from '@/widgets/waypoints-list/WaypointsList.tsx';
import { useWaypointsList } from '@/widgets/waypoints-list/useWaypointsList.ts';
import { Button } from '@mui/material';
import { useRouteDirection } from '@/shared/hooks/useRouteDirection.ts';
import { useRouteEmulator } from '@/features/route-emulator/useRouteEmulator.ts';
import { PositionInterface } from '@/features/route-emulator/types.ts';
import { Marker } from '@/shared/components/marker/Marker.tsx';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';

const ICONS_SX = { fontSize: 40 };

export default function HomePage() {
    const [mapOptions] = React.useState<google.maps.MapOptions>({ center: HOME_COORDINATES, zoom: 15 });
    const [mapObject, setMapObject] = React.useState<google.maps.Map | null>(null);
    const { waypoints, addWaypoint, removeWaypoint } = useWaypointsList();
    const routeDirection = useRouteDirection();
    const [currentPosition, setCurrentPosition] = React.useState<PositionInterface | null>(null);
    const onPositionChanged = React.useCallback(
        (position: PositionInterface | null) => {
            if (!position) return;

            setCurrentPosition(position);
            mapObject?.panTo(position.latLng);
            mapObject?.setZoom(30);
            mapObject?.setTilt(90);
            mapObject?.setHeading(position.heading || 0);
        },
        [mapObject],
    );
    const routeEmulator = useRouteEmulator(onPositionChanged);

    function onDrawMangerMarkerComplete(marker: google.maps.Marker) {
        marker && addWaypoint(marker);
    }

    function onClickCalculateRoute() {
        routeDirection.buildRoute([...waypoints], mapObject);
    }

    function onClickStart() {
        if (!routeDirection.directionsResult) {
            return;
        }

        if (routeEmulator.isPlaying) {
            routeEmulator.setIsPlaying(false);
            return;
        }

        routeEmulator.startRoute(routeDirection.directionsResult.routes[0]);
    }

    function onClickReset() {
        routeEmulator.resetRoute();
        routeDirection.resetRoute();
        if (mapObject) {
            mapObject.setZoom(15);
            mapObject.setTilt(0);
            mapObject.setHeading(0);
        }
        setCurrentPosition(null);
    }

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView mapOptions={mapOptions} onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={onDrawMangerMarkerComplete} />
                    {currentPosition && <Marker position={currentPosition.latLng} />}
                </MapView>

                <Flyout title={'Waypoints'}>
                    <div className="flex items-center gap-x-2 p-1 border-b border-gray-500">
                        <Button onClick={onClickCalculateRoute} variant="outlined">
                            Calculate Route
                        </Button>

                        <Button onClick={onClickReset} variant="outlined">
                            Reset Route
                        </Button>
                    </div>
                    <WaypointsList items={waypoints} onDelete={removeWaypoint} />
                </Flyout>

                <div
                    className="absolute inset-x-0 w-1/5 bottom-0 mx-auto rounded-lg rounded-b-none bg-white dark:bg-gray-700"
                >
                    <div className="flex items-center justify-center w-full">
                        <Button>
                            <NavigateBefore sx={ICONS_SX} />
                        </Button>
                        <Button onClick={onClickStart}>
                            {routeEmulator.isPlaying ? <Pause sx={ICONS_SX} /> : <PlayArrow sx={ICONS_SX} />}
                        </Button>
                        <Button>
                            <NavigateNext sx={ICONS_SX} />
                        </Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
