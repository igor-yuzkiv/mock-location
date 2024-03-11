import { Router } from 'express';

import RouteController from '../modules/route/controllers/route.controller';


const api = Router()
    .use('/route', RouteController);


export default Router().use('/api', api);
