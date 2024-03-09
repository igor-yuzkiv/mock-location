export const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY || '';

export const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || '';

export const DARK_GOOGLE_MAP_ID = import.meta.env.VITE_DARK_GOOGLE_MAP_ID || '';

export const HOME_COORDINATES: google.maps.LatLngLiteral = { lat: 35.8276787, lng: -80.9057157 };

export const MAP_TYPES = {
    ROADMAP: 'roadmap',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TERRAIN: 'terrain',
};

export const DEFAULT_MAP_OPTIONS = {
    center: HOME_COORDINATES,
    zoom: 15,
    mapTypeId: MAP_TYPES.ROADMAP,
    mapId: DARK_GOOGLE_MAP_ID,
    heading: 90,
    tilt: 0,
};

export const MARKER_ICON = {
    beachFlag: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
};
