import { Router } from 'express';

import RouteController from './modules/route/route.controller';


const routes = Router()
    .use('/route', RouteController);

export default Router().use(routes);
