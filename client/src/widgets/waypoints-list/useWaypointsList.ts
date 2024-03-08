import React from 'react';
import { uid } from 'uid';
import { geocodeCoordinate } from '@/shared/api/googleMaps.ts';
import { WaypointInterface } from '@/widgets/waypoints-list/types.ts';

export function useWaypointsList() {
    const [waypoints, setWaypoints] = React.useState<WaypointInterface[]>([]);

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

    function removeWaypoint(item: WaypointInterface) {
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
