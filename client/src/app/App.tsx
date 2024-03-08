import './App.css';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from '@/pages/home.tsx';

function App() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('position:', position);
            });
        }
    });
    return (
        <ThemeProvider theme={darkTheme}>
            <main className="dark flex relative w-full h-screen overflow-hidden text-black dark:text-white">
                <HomePage />
            </main>
        </ThemeProvider>
    );
}

export default App;
