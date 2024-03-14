import React from 'react';
import useWebSocket from 'react-use-websocket';
import { DeviceInterface, IncomingMessageInterface, MessageTypeEnum } from '@/features/device-bridge';

type MessageHandlerType = (message: IncomingMessageInterface) => void;

export function useDeviceBridge(onMessage?: MessageHandlerType) {
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(import.meta.env.VITE_WS_URL as string);
    const [devices, setDevices] = React.useState<DeviceInterface[]>([]);

    const handlersRef = React.useRef<{ [key: string]: MessageHandlerType }>({});
    handlersRef.current = {
        [MessageTypeEnum.devices]: (message: IncomingMessageInterface) => {
            if (message.payload && Array.isArray(message.payload)) {
                console.log('devices', message.payload);
                setDevices(message.payload as DeviceInterface[]);
            }
        },
    };

    React.useEffect(() => {
        if (!lastJsonMessage) return;

        const { type, payload } = lastJsonMessage as IncomingMessageInterface;
        if (!type || !payload) return;

        if (handlersRef.current[type]) {
            handlersRef.current[type](lastJsonMessage);
        }

        onMessage && onMessage(lastJsonMessage);
    }, [lastJsonMessage, onMessage]);

    function sendMessage(type: string, payload: object) {
        sendJsonMessage({ type, payload });
    }

    return { devices, sendMessage };
}
