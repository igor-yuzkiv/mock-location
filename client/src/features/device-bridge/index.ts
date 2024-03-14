export { DevicesList } from './ui/DevicesList.tsx';
export { useDeviceBridge } from './lib/useDeviceBridge.ts';

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
