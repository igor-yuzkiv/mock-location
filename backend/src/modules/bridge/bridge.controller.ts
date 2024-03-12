import WebSocket from 'ws';
import { IncomingMessage } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import { MANAGER, EXECUTOR } from './constants';

type ClientType = typeof MANAGER | typeof EXECUTOR;

interface ClientInterface {
    id: string;
    ws: WebSocket;
    type: ClientType;
}

export class BridgeController {
    wss: WebSocket.Server;
    manager: ClientInterface | null = null;
    devices = new Map<string, ClientInterface>();

    constructor(wss: WebSocket.Server) {
        this.wss = wss;
    }

    subscribe(ws: WebSocket, req: IncomingMessage) {
        const client = this.initClient(ws, req);
        if (!client) return;

        this.sendDevicesToManager();
    }

    initClient(ws: WebSocket, req: IncomingMessage): ClientInterface | undefined {
        const query = new URLSearchParams(req.url?.split('?')[1]);
        const type = query.get('type') as ClientType;

        if (!this.isValidClientType(type)) {
            ws.close(4000, 'type is required');
            return;
        }

        const client: ClientInterface = { id: uuidv4(), ws, type };

        if (client.type === MANAGER) {
            if (this.manager) {
                ws.close(4001, 'manager already exists');
                return;
            }
            this.manager = client;
        } else {
            this.devices.set(client.id, client);
        }

        return client;
    }

    isValidClientType(type: string | undefined): type is ClientType {
        return Boolean(type && [MANAGER, EXECUTOR].includes(type));
    }

    sendDevicesToManager() {
        if (!this.manager) return;

        const devices = Array.from(this.devices.values()).map((device) => ({
            id: device.id,
            type: device.type,
        }));

        this.manager.ws.send(JSON.stringify({
            type: 'devices',
            payload: devices,
        }));
    }
}
