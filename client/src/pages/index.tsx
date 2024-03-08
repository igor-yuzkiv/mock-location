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

type FlyoutActionsProps = {
    onClickBuild: () => void;
    onClickPlay: () => void;
    isPlaying: boolean;
};

function FlyoutActions({ onClickBuild, onClickPlay, isPlaying }: FlyoutActionsProps) {
    return (
        <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-x-1">
                <Button size="small" onClick={onClickBuild}>
                    Build
                </Button>
            </div>
            <div className="flex items-center gap-x-1">
                <Button onClick={onClickPlay} size="small">
                    {isPlaying ? <Pause sx={{ fontSize: 20 }} /> : <PlayArrow sx={{ fontSize: 20 }} />}
                </Button>
            </div>
        </div>
    );
}

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

    function handleResetRoute() {
        routeEmulator.resetRoute();
        routeDirection.resetRoute();
        if (mapObject) {
            mapObject.setZoom(15);
            mapObject.setTilt(0);
            mapObject.setHeading(0);
        }
        setCurrentPosition(null);
    }

    function handleBuildRoute() {
        handleResetRoute();
        routeDirection.buildRoute([...waypoints], mapObject);
    }

    function onClickPlay() {
        if (!routeDirection.directionsResult) {
            return;
        }

        if (routeEmulator.isPlaying) {
            routeEmulator.setIsPlaying(false);
            return;
        }

        routeEmulator.startRoute(routeDirection.directionsResult.routes[0]);
    }

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView mapOptions={mapOptions} onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={onDrawMangerMarkerComplete} />
                    {currentPosition && <Marker position={currentPosition.latLng} />}
                </MapView>

                <Flyout
                    actions={
                        <FlyoutActions
                            onClickBuild={handleBuildRoute}
                            onClickPlay={onClickPlay}
                            isPlaying={routeEmulator.isPlaying}
                        />
                    }
                >
                    <WaypointsList items={waypoints} onDelete={removeWaypoint} />
                </Flyout>
            </div>
        </Wrapper>
    );
}
