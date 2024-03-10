import HomePage from '@/pages/home/HomePage.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppSelector } from '@/app/store/hooks.ts';
import { DARK_THEME } from '@/app/theme.ts';

export function DefaultLayout() {
    const themeState = useAppSelector((state) => state.settings.theme);
    const theme = createTheme({
        palette: {
            mode: themeState,
        },
    });

    return <ThemeProvider theme={theme}>
        <main
            className={`${themeState === DARK_THEME && 'dark'} flex relative w-full h-screen overflow-hidden text-black dark:text-white`}>
            <HomePage />
        </main>
    </ThemeProvider>;
}
