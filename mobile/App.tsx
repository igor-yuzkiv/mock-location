import React from 'react';
import { NativeModules, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useMapRegion } from './src/hooks/useMapRegion';
import { useDeviceBridge } from './src/hooks/useDeviceBridge';
import GeoUtil from './src/uitls/GeoUtil';

const { MockLocationModule } = NativeModules;

function App() {
    const mapRegion = useMapRegion();
    const deviceBridge = useDeviceBridge();

    React.useEffect(() => {
        deviceBridge.addSubscription('position', (payload: unknown) => {
            if (!payload || typeof payload !== 'object' || !('latLng' in payload)) {
                return;
            }
            const coordinate = GeoUtil.toCoordinate(payload.latLng);
            MockLocationModule.setMockLocation(coordinate);
        });
    }, []);

    return (
        <SafeAreaView>
            <MapView
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
