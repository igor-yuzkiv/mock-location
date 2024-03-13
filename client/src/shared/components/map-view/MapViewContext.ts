import { createContext } from 'react';

type MapViewContextType = {
    mapObject: Nullable<google.maps.Map>;
};

export const MapViewContext = createContext<MapViewContextType>({ mapObject: null });
