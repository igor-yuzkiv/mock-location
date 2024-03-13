import React from 'react';
import { NativeModules, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useMapRegion } from './src/shared/hooks/useMapRegion';
import { useWebSocket } from './src/shared/hooks/useWebSocket';
import GeoUtil from './src/shared/uitls/GeoUtil';

const { MockLocationModule } = NativeModules;
const WS_URL = 'ws://192.168.88.17:3000/?type=executor';

function App() {
    const mapRegion = useMapRegion();
    const ws = useWebSocket(WS_URL);

    React.useEffect(() => {
        ws.addSubscription('position', (payload: unknown) => {
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
            >

            </MapView>
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
