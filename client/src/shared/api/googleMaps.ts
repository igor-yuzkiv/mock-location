export async function geocoderInstance(): Promise<google.maps.Geocoder> {
    const { Geocoder } = await google.maps.importLibrary('geocoding') as google.maps.GeocodingLibrary;
    return new Geocoder();
}

export async function geocodeCoordinate(latLng: google.maps.LatLngLiteral): Promise<google.maps.GeocoderResult[] | null> {
    const geocoder = await geocoderInstance();
    return new Promise((resolve) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results?.length) {
                resolve(results);
            } else {
                resolve(null);
            }
        });
    });
}
