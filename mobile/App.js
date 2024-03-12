import React, {useEffect} from 'react';
import {SafeAreaView, NativeModules, Button, StyleSheet, View} from 'react-native';
import {checkBackgroundLocationPermission, checkLocationPermission} from './src/utils/permissionsUtil';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useMapRegion, HOME_COORDINATE} from './src/hooks/useMapRegion';

const {MockLocationModule} = NativeModules;

const coordinates = [
    {latitude: 49.44396538247, longitude: 25.586237857383},
    {latitude: 49.444546986119, longitude: 25.586511442713},
    {latitude: 49.445005689723, longitude: 25.586762754978},
    {latitude: 49.446117467267, longitude: 25.587627727822},
    {latitude: 49.445549963094, longitude: 25.58247882068},
    {latitude: 49.445790623507, longitude: 25.581281925762},
    {latitude: 49.447867576893, longitude: 25.57167311194},
    {latitude: 49.45063033541, longitude: 25.554929314553},
    {latitude: 49.453318489441, longitude: 25.538583974125},
    {latitude: 49.454386467772, longitude: 25.53862150849},
];

function App() {
    const {mapRegion} = useMapRegion();
    const mapRef = React.useRef(null);
    const [currentCoordinate, setCurrentCoordinate] = React.useState(0);

    function onMapReady() {
        animateCamera(HOME_COORDINATE);
    }

    function animateCamera(center, options = {}) {
        if (!mapRef.current) {
            return;
        }

        mapRef.current.animateCamera(
            {
                zoom: 16,
                center,
                heading: 0,
                pitch: 0,
                ...options,
            },
            1000,
        );
    }

    function setMockLocation() {
        if (currentCoordinate >= coordinates.length) {
            setCurrentCoordinate(0);
            return;
        }
        setCurrentCoordinate((prev) => {
            if (prev >= coordinates.length - 1) {
                return 0;
            }
            return  prev + 1;
        });
    }

    useEffect(() => {
        const coordinate = coordinates[currentCoordinate];
        if (!coordinate) {
            return;
        }

        MockLocationModule.setMockLocation({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentCoordinate]);

    async function checkPermissions() {
        if (!(await checkLocationPermission()) || !(await checkBackgroundLocationPermission())) {
            console.log('Permissions not granted');
            return false;
        }
        console.log('Permissions granted');
        return true;
    }

    function onUserLocationChange(event) {
        const {coordinate} = event.nativeEvent;
        if (coordinate?.isFromMockProvider) {
            const center = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            };

            animateCamera(center, {
                zoom: 18,
                heading: coordinate?.heading || 0,
            });
        }
    }

    // React.useEffect(() => {
    //     const ws = new WebSocket('ws://192.168.88.17:3000');
    //
    //     // ws.onopen = () => {
    //     //     ws.send('Hello from client');
    //     // };
    //     ws.onmessage = (event) => {
    //         console.log('received: %s', event.data);
    //     };
    // }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMockLocation();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapContainer}
                initialRegion={mapRegion}
                ref={mapRef}
                onMapReady={onMapReady}
                showsUserLocation={true}
                mapType={'satellite'}
                onUserLocationChange={onUserLocationChange}
            />
            <View style={styles.buttonsContainer}>
                <Button title={'Permission'} onPress={checkPermissions}/>
                <Button title={'Mock'} onPress={setMockLocation}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    buttonsContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        bottom: 0,
        width: '100%',
        height: 100,
        backgroundColor: 'white',
        padding: 5,
        gap: 5,
    },
});

export default App;
