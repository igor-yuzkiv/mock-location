import React from 'react';
import { uid } from 'uid';
import { geocodeCoordinate } from '../../shared/api/googleMaps.ts';

export interface Waypoint {
    id: string;
    marker: google.maps.Marker,
    location: google.maps.LatLngLiteral;
    stopover: boolean;
    address: string | null;
}

export function useWaypointsList() {
    const [waypoints, setWaypoints] = React.useState<Waypoint[]>([]);

    async function addWaypoint(marker: google.maps.Marker) {
        const location = marker.getPosition()?.toJSON();
        if (!location) {
            return;
        }

        const geocoderResponse = await geocodeCoordinate(location);
        const { formatted_address } = geocoderResponse?.length ? geocoderResponse[0] : { formatted_address: null };

        setWaypoints(prev => {
            return [
                ...prev,
                {
                    id: uid(),
                    marker,
                    location,
                    stopover: true,
                    address: formatted_address,
                },
            ];
        });
    }

    function removeWaypoint(item: Waypoint) {
        if (item.marker) {
            item.marker.setMap(null);
        }

        setWaypoints(prev => {
            return prev.filter(waypoint => waypoint.id !== item.id);
        });
    }

    return {
        waypoints,
        addWaypoint,
        removeWaypoint,
    };
}
