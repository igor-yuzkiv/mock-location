export { DevicesList } from './ui/DevicesList.tsx';
export { useDeviceBridge } from './lib/useDeviceBridge.ts';

export enum MessageTypeEnum {
    devices = 'devices',
    position = 'position'
}

export interface IncomingMessageInterface {
    type: string,
    payload: unknown,
}

export interface DeviceInterface {
    id: string;
    type: string;
}
