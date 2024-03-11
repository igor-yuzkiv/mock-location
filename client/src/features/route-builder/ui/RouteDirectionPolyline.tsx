import {RouteInterface} from "@/entities/route";
import {MapViewContext} from "@/shared/components/map-view/MapViewContext.ts";
import {useContext, useEffect} from "react";

type PropsType = {
    route: RouteInterface | null;
}

export function RouteDirectionPolyline({route}: PropsType) {
    const {mapObject} = useContext(MapViewContext);

    useEffect(() => {
        if (!route || !mapObject) return;
        const polyline = new google.maps.Polyline({
            path: route.decoded_path,
            strokeColor: '#0a66eb',
            strokeOpacity: 0.8,
            strokeWeight: 8,
        });

        polyline.setMap(mapObject);

        return () => {
            polyline.setMap(null);
        };
    }, [route, mapObject]);

    return null;
}
