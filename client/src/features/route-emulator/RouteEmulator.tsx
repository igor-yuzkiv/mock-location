import React from "react";
import {useWaypointsList} from "@/widgets/waypoints-list/useWaypointsList.ts";
import {useRouteDirection} from "@/shared/hooks/useRouteDirection.ts";
import {PositionInterface} from "@/features/route-emulator/types.ts";
import {useRouteEmulator} from "@/features/route-emulator/useRouteEmulator.ts";
import {Wrapper} from "@googlemaps/react-wrapper";
import {GOOGLE_MAP_API_KEY} from "@/shared/constants/GoogleMapConstants.ts";
import MapView from "@/shared/components/map-view/MapView.tsx";
import {DrawingManager} from "@/shared/components/drawing-manager/DrawingManager.tsx";
import {Marker} from "@/shared/components/marker/Marker.tsx";
import {FlyoutWindow} from "@/shared/components/flyout-window/FlyoutWindow.tsx";
import {WaypointsList} from "@/widgets/waypoints-list/WaypointsList.tsx";
import {FlyoutActions} from "@/features/route-emulator/components/FlyoutActions.tsx";

export function RouteEmulator() {
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
                <MapView onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={(marker) => marker && addWaypoint(marker)} />
                    {currentPosition && <Marker position={currentPosition.latLng} />}
                </MapView>

                <FlyoutWindow
                    actions={
                        <FlyoutActions
                            onClickBuild={handleBuildRoute}
                            onClickReset={handleResetRoute}
                            onClickPlay={onClickPlay}
                            isPlaying={routeEmulator.isPlaying}
                        />
                    }
                >
                    <WaypointsList items={waypoints} onDelete={removeWaypoint} />
                </FlyoutWindow>
            </div>
        </Wrapper>
    );
}
