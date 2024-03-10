import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '@/features/settings/settings.store.ts';

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
