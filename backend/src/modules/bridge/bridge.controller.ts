import WebSocket from 'ws';
import { IncomingMessage } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

interface ClientInterface {
    id: string;
    ws: WebSocket;
    type: ClientTypeEnum;
}

interface MessageInterface {
    type: string;
    payload: unknown;
}

enum ClientTypeEnum {
    MANAGER = 'manager',
    EXECUTOR = 'executor',
}

enum MessageTypeEnum {
    devices = 'devices'
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

        ws.on('close', () => this.onClose(client));
        ws.on('message', (message) => this.onMessage(client, message));
        ws.on('error', (error) => console.error(`[bridge] Error: ${error}`));

        this.sendDevicesToManager();
    }

    initClient(ws: WebSocket, req: IncomingMessage): ClientInterface | undefined {
        const query = new URLSearchParams(req.url?.split('?')[1]);
        const type = query.get('type') as ClientTypeEnum;

        if (!this.isValidClientType(type)) {
            ws.close(4000, 'type is required');
            return;

        }

        const client: ClientInterface = { id: uuidv4(), ws, type };
        if (client.type === ClientTypeEnum.MANAGER) {
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

    onClose(client: ClientInterface) {
        if (client.type === ClientTypeEnum.MANAGER) {
            this.manager = null;
        } else {
            this.devices.delete(client.id);
        }
        this.sendDevicesToManager();
    }

    onMessage(client: ClientInterface, rawMessage: WebSocket.RawData) {
        const message = JSON.parse(rawMessage.toString());
        if (!this.isValidMessage(message)) {
            return;
        }

        this.sendMessageToDevices(message);
    }

    sendMessageToDevices(message: MessageInterface) {
        this.devices.forEach(device => device.ws.send(JSON.stringify(message)));
    }

    sendDevicesToManager() {
        if (!this.manager) return;

        const devices = Array.from(this.devices.values()).map((device) => ({
            id: device.id,
            type: device.type,
        }));

        this.manager.ws.send(JSON.stringify({
            type: MessageTypeEnum.devices,
            payload: devices,
        }));
    }

    isValidMessage(message: unknown): message is MessageInterface {
        return (
            typeof message === 'object' &&
            message !== null &&
            'type' in message &&
            'payload' in message
        );
    }

    isValidClientType(type: string | undefined): type is ClientTypeEnum {
        return Boolean(typeof type === 'string' && type.toUpperCase() in ClientTypeEnum);
    }
}
