export { DevicesList } from './ui/DevicesList.tsx';
export { useDeviceBridgeManager } from './lib/useDeviceBridgeManager.ts';

export enum MessageTypeEnum {
    devices = 'devices',
}

export interface IncomingMessageInterface {
    type: string,
    payload: unknown,
}

export interface OutgoingMessageInterface extends IncomingMessageInterface {
    device_id: string;
}


export interface DeviceInterface {
    id: string;
    type: string;
}
