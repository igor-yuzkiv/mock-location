import { Router } from 'express';

import RouteController from './modules/route/controllers/route.controller';


const routes = Router()
    .use('/route', RouteController);


export default Router().use(routes);
