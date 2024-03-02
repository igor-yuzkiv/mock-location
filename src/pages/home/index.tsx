import React from 'react';
import MapView from '../../shared/components/map-view/MapView.tsx';
import { GOOGLE_MAP_API_KEY, HOME_COORDINATES } from '../../shared/constants/GoogleMapTypes.ts';
import { Wrapper } from '@googlemaps/react-wrapper';
import { DrawingManager } from '../../shared/components/drawing-manager/DrawingManager.tsx';
import { Flyout } from '../../shared/components/flyout/Flyout.tsx';

export default function HomePage() {
    const [mapOptions] = React.useState<google.maps.MapOptions>({
        center: HOME_COORDINATES,
        zoom: 15,
        tilt: 0,
    });

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView mapOptions={mapOptions}>
                    <DrawingManager />
                </MapView>
                <Flyout title={'Route Emulator'}>
                    asdsa

                </Flyout>
            </div>
        </Wrapper>
    );
}
