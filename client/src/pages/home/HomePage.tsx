import React from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { GOOGLE_MAP_API_KEY } from '@/shared/constants/GoogleMapConstants.ts';
import { MapView } from '@/shared/components/map-view/MapView.tsx';
import { DrawingManager } from '@/shared/components/drawing-manager/DrawingManager.tsx';
import { FlyoutWindow } from '@/shared/components/flyout-window/FlyoutWindow.tsx';
import { FlyoutActions } from '@/pages/home/components/FlyoutActions.tsx';
import { useWaypointsList, WaypointsList } from '@/widgets/waypoints-list';
import { useRouteBuilder, RouteDirectionPolyline } from '@/features/route-builder';
import {
    useRouteEmulator,
    useRouteEmulatorSettings,
    RouteEmulatorSettings,
    PositionInterface,
} from '@/features/route-emulator';
import { useDeviceBridgeManager, DevicesList } from '@/features/device-bridge';
import GeoUtil from '@/shared/lib/GeoUtil.ts';
import { Tab, Tabs } from '@mui/material';


export default function HomePage() {
    const [mapObject, setMapObject] = React.useState<google.maps.Map | null>(null);
    const [tabIndex, setTabIndex] = React.useState(0);
    const { waypoints, addWaypoint, removeWaypoint } = useWaypointsList();
    const emulatorSettings = useRouteEmulatorSettings();
    const routeBuilder = useRouteBuilder();
    const routeEmulator = useRouteEmulator(mapObject, emulatorSettings.settings, onPositionChange);
    const bridgeManager = useDeviceBridgeManager();

    function handleResetRoute() {
        routeEmulator.resetEmulator();
        routeBuilder.setRoute(null);
    }

    async function onClickBuild() {
        handleResetRoute();
        await routeBuilder.buildRoute([...waypoints]);

        if (mapObject) {
            const bound = GeoUtil.coordinatesToBoundLiteral(waypoints.map((waypoint) => waypoint.location));
            mapObject.fitBounds(bound, 200);
        }
    }

    function onClickPlay() {
        if (!routeBuilder.route) return;

        if (routeEmulator.routePath.length) {
            routeEmulator.setIsPlaying(prev => !prev);
            return;
        }

        routeEmulator.startRoute(routeBuilder.route);
    }

    function onPositionChange(position: PositionInterface) {
        bridgeManager.sendMessage('position', position);
    }

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={(marker) => marker && addWaypoint(marker)} />
                    <RouteDirectionPolyline route={routeBuilder.route} />
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
                        <Tab label={`Devices ${bridgeManager.devices.length ? '🟢' : '🔴'}`} onClick={() => setTabIndex(2)} />
                    </Tabs>

                    {tabIndex === 0 && (<WaypointsList items={waypoints} onDelete={removeWaypoint} />)}

                    {tabIndex === 1 && (<div className="flex flex-col overflow-y-auto overflow-x-hidden p-1">
                        <RouteEmulatorSettings
                            model={emulatorSettings.settings}
                            onChange={emulatorSettings.setSettings}
                        />
                    </div>)}

                    {tabIndex === 2 && (<div className="flex flex-col overflow-y-auto overflow-x-hidden p-1">
                        <DevicesList devices={bridgeManager.devices} />
                    </div>)}
                </FlyoutWindow>
            </div>
        </Wrapper>
    );
}
