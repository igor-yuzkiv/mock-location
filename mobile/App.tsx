import React from 'react';
import { NativeModules, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import { useMapRegion } from './src/hooks/useMapRegion';
import { useDeviceBridge } from './src/hooks/useDeviceBridge';
import GeoUtil from './src/uitls/GeoUtil';

const { MockLocationModule } = NativeModules;

function App() {
    const mapRef = React.useRef<MapView>(null);
    const mapRegion = useMapRegion();
    const deviceBridge = useDeviceBridge();

    function animateCamera(coordinate: LatLng) {
        mapRef.current?.animateCamera({
            center: coordinate,
            zoom: 20,
        });
    }

    React.useEffect(() => {
        deviceBridge.addSubscription('position', (payload: unknown) => {
            if (!payload || typeof payload !== 'object' || !('latLng' in payload)) {
                return;
            }
            const coordinate = GeoUtil.toCoordinate(payload.latLng);
            if (!coordinate) {
                return;
            }

            MockLocationModule.setMockLocation(coordinate);
            animateCamera(coordinate);
        });
    }, []);

    return (
        <SafeAreaView>
            <MapView
                ref={mapRef}
                style={styles.mapContainer}
                provider={PROVIDER_GOOGLE}
                region={mapRegion.region}
                showsUserLocation={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        display: 'flex',
        width: '100%',
        height: '100%',
    },
});

export default App;
