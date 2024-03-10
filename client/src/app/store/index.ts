import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '@/features/settings/settings.store.ts';

export const index = configureStore({
    reducer: {
        settings: settingsReducer,
    },
});

export type AppStore = typeof index;
export type RootState = ReturnType<typeof index.getState>
export type AppDispatch = typeof index.dispatch
