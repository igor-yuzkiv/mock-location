import { Router } from 'express';
import buildRouteDirection from './actions/build-route-direction';
import { LatLng } from '@googlemaps/google-maps-services-js';

const route = Router();

route.post('', async (req, res) => {
    try {
        const origin = req.body?.origin as LatLng;
        const destination = req.body?.destination as LatLng;
        if (!origin || !destination) {
            res.status(400).send('Invalid parameters');
            return;
        }
        const waypoints = req.body?.waypoints || [] as LatLng[];

        const response = await buildRouteDirection(origin, destination, waypoints);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

export default route;
