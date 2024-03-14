import WebSocket from 'ws';
import { BridgeController } from '../modules/bridge/bridge.controller';

const PORT = process.env.WS_PORT as unknown as number;
if (!PORT) {
    throw new Error('PORT is not defined');
}

const wss = new WebSocket.Server({
    port: PORT,
});

const bridgeController = new BridgeController(wss);
wss.on('connection', (ws, req) => bridgeController.subscribe(ws, req));

console.log(`[ws] Server is running at ws://localhost:${PORT}`)
