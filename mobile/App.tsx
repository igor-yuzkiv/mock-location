import React from 'react';
import { Button, SafeAreaView } from 'react-native';
function App() {

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
            <Button title={'Click me'} onPress={test} />
        </SafeAreaView>
    );
}

export default App;
