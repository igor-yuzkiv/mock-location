import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker, LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import { HOME_COORDINATE, useMapRegion } from './src/shared/hooks/useMapRegion';

function App() {
    const mapRegion = useMapRegion();
    const [position, setPosition] = React.useState<LatLng>(HOME_COORDINATE);

    function test() {
        console.log('connecting...');
        const ws = new WebSocket('ws://192.168.88.17:3000/?type=executor');

        ws.onopen = () => {
            // ws.send('Hello from client');
            console.log('connected');
        };
        ws.onmessage = (event) => {
            console.log('received: %s', event.data);
        };
        ws.onerror = (event) => {
            console.log('error: %s', event);
        };
    }

    React.useEffect(() => {
        test();
    }, []);

    return (
        <SafeAreaView>
            <MapView
                style={styles.mapContainer}
                provider={PROVIDER_GOOGLE}
                region={mapRegion.region}
            >
                <Marker coordinate={position} />
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
