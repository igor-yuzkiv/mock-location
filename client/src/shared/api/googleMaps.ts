export async function geocodeCoordinate(latLng: google.maps.LatLngLiteral): Promise<google.maps.GeocoderResult[] | null> {
    const { Geocoder } = await google.maps.importLibrary('geocoding') as google.maps.GeocodingLibrary;
    const geocoder = new Geocoder();

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

export async function fetchDirections(origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, waypoints: google.maps.DirectionsWaypoint[]): Promise<google.maps.DirectionsResult | null> {
    const { DirectionsService } = await google.maps.importLibrary('routes') as google.maps.RoutesLibrary;
    const directionsService = new DirectionsService();

    return new Promise((resolve, reject) => {
        directionsService.route(
            {
                origin,
                destination,
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
                provideRouteAlternatives: false,
                language: 'en',
            },
            (result, status) => {
                status === google.maps.DirectionsStatus.OK
                    ? resolve(result)
                    : reject(result);
            },
        );
    });
}

export async function renderDirection(directionResult: google.maps.DirectionsResult, mapObject: google.maps.Map): Promise<google.maps.DirectionsRenderer> {
    const { DirectionsRenderer } = await google.maps.importLibrary('routes') as google.maps.RoutesLibrary;
    const renderer = new DirectionsRenderer();

    renderer.setMap(mapObject);
    renderer.setOptions({
        directions: directionResult,
        draggable: false,
        // hideRouteList: false,
        // routeIndex: 0,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
            strokeColor: '#0a66eb',
            strokeOpacity: 0.8,
            strokeWeight: 8,
        },
    });

    return renderer;
}
