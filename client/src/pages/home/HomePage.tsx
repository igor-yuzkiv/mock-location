import React from 'react';
import { useWaypointsList } from '@/widgets/waypoints-list/lib/useWaypointsList.ts';
import { useRouteBuilder } from '@/features/route-builder/lib/useRouteBuilder.ts';
import { useRouteEmulator } from '@/features/route-emulator/lib/useRouteEmulator.ts';
import { Wrapper } from '@googlemaps/react-wrapper';
import { GOOGLE_MAP_API_KEY } from '@/shared/constants/GoogleMapConstants.ts';
import MapView from '@/shared/components/map-view/MapView.tsx';
import { DrawingManager } from '@/shared/components/drawing-manager/DrawingManager.tsx';
import { FlyoutWindow } from '@/shared/components/flyout-window/FlyoutWindow.tsx';
import { WaypointsList } from '@/widgets/waypoints-list';
import { FlyoutActions } from '@/pages/home/components/FlyoutActions.tsx';
import GeoUtil from '@/shared/lib/GeoUtil.ts';
import { Tab, Tabs } from '@mui/material';
import { RouteEmulatorSettings } from '@/features/route-emulator';
import { useRouteEmulatorSettings } from '@/features/route-emulator/lib/useRouteEmulatorSettings.ts';


export default function HomePage() {
    const [mapObject, setMapObject] = React.useState<google.maps.Map | null>(null);
    const [tabIndex, setTabIndex] = React.useState(0);
    const { waypoints, addWaypoint, removeWaypoint } = useWaypointsList();
    const routeDirection = useRouteBuilder();
    const emulatorSettings = useRouteEmulatorSettings();
    const routeEmulator = useRouteEmulator(mapObject, emulatorSettings.settings);

    function handleResetRoute() {
        routeEmulator.resetRoute();
        routeDirection.resetRoute();
    }

    function onClickBuild() {
        handleResetRoute();
        routeDirection.buildRoute([...waypoints], mapObject)
            .then(() => {
                if (mapObject) {
                    const bound = GeoUtil.coordinatesToBoundLiteral(waypoints.map((waypoint) => waypoint.location));
                    mapObject.fitBounds(bound, 200);
                }
            });
    }

    function onClickPlay() {
        if (!routeDirection.route) return;

        if (routeEmulator.routePath.length) {
            routeEmulator.setIsPlaying(prev => !prev);
            return;
        }

        routeEmulator.startRoute(routeDirection.route);
    }

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={(marker) => marker && addWaypoint(marker)} />
                </MapView>

                <FlyoutWindow
                    actions={
                        <FlyoutActions
                            onClickBuild={onClickBuild}
                            onClickReset={handleResetRoute}
                            onClickPlay={onClickPlay}
                            isPlaying={routeEmulator.isPlaying}
                        />
                    }
                >
                    <Tabs value={tabIndex}>
                        <Tab label="Waypoints" onClick={() => setTabIndex(0)} />
                        <Tab label="Settings" onClick={() => setTabIndex(1)} />
                    </Tabs>

                    {tabIndex === 0 && (<WaypointsList items={waypoints} onDelete={removeWaypoint} />)}

                    {tabIndex === 1 && (<div className="flex flex-col overflow-y-auto overflow-x-hidden p-1">
                        <RouteEmulatorSettings
                            model={emulatorSettings.settings}
                            onChange={emulatorSettings.setSettings}
                        />
                    </div>)}
                </FlyoutWindow>
            </div>
        </Wrapper>
    );
}
