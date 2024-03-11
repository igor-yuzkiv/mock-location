import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import routers from '../routes';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
