import { createSlice } from '@reduxjs/toolkit';
import { DARK_THEME, LIGHT_THEME } from '@/app/theme.ts';

export interface SettingsState {
    theme: 'dark' | 'light';
}

const initialState: SettingsState = {
    theme: localStorage.getItem('theme') === DARK_THEME ? DARK_THEME : LIGHT_THEME,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleTheme: store => {
            store.theme = store.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
            localStorage.setItem('theme', store.theme);
        },
    },
});


export const { toggleTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
