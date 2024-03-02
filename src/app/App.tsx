import './App.css';
import React from 'react';
import HomePage from '../pages/home';

function App() {
    React.useEffect(() => {
        if (navigator.geolocation) {
            //TODO: install store
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('position:', position);
            });
        }
    });
    return (
        <main className="dark flex relative w-full h-screen overflow-hidden text-black dark:text-white">
            <HomePage />
        </main>
    );
}

export default App;
