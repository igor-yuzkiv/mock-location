import { createContext } from 'react';

type MapViewContextType = {
    mapObject: google.maps.Map | null;
};

export const MapViewContext = createContext<MapViewContextType>({ mapObject: null });
