import WebSocket from 'ws';
import { BridgeController } from '../modules/bridge/bridge.controller';

const wss = new WebSocket.Server({
    port: process.env.WS_PORT as unknown as number,
});

const bridgeController = new BridgeController(wss);
wss.on('connection', (ws, req) => bridgeController.subscribe(ws, req));
