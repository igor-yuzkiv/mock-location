export default {
    toString(latLng: google.maps.LatLngLiteral): string {
        if (!latLng) {
            return '';
        }

        return `${latLng.lat.toFixed(6)},${latLng.lng.toFixed(6)}`;
    },
};
