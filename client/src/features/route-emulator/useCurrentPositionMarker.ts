import {PositionInterface} from "@/features/route-emulator/types.ts";
import {useEffect, useState} from "react";

import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

async function initMarker(position: PositionInterface, mapObject: google.maps.Map): Promise<AdvancedMarkerElement> {
    console.log("initMarker");
    const {AdvancedMarkerElement} = (await google.maps.importLibrary(
        'marker',
    )) as google.maps.MarkerLibrary;

    const content = document.createElement("div");
    content.classList.add("current-position-marker");

    return new AdvancedMarkerElement({
        map: mapObject,
        position: position.latLng,
        content: content,
    });
}

export function useCurrentPositionMarker(postion: PositionInterface | null, mapObject: google.maps.Map | null) {
    const [markerObject, setMarkerObject] = useState<AdvancedMarkerElement>();

    useEffect(() => {
        if (!mapObject || !postion) return;

        if (!markerObject) {
            initMarker(postion, mapObject).then(marker => setMarkerObject(marker))
            return;
        }

        markerObject.position = postion.latLng;
    }, [postion, markerObject, mapObject])

    useEffect(() => {
        return () => {
            if (markerObject) {
                markerObject.map = null;
            }
        }
    }, [markerObject]);
}
