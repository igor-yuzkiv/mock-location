import React from 'react';
import Config from 'react-native-config';

type SubscriptionHandlerType = (payload: unknown) => void;
type SubscriptionType = [string, SubscriptionHandlerType][];

function isValidaMessage(message: unknown): boolean {
    return (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        'payload' in message
    );
}

export function useDeviceBridge() {
    const [subscriptions, setSubscriptions] = React.useState<SubscriptionType>([]);
    const messageHandlerRef = React.useRef<(event: WebSocketMessageEvent) => void>();

    messageHandlerRef.current = (event) => {
        const data = JSON.parse(event.data);
        if (!isValidaMessage(data)) {
            return;
        }
        const subs = subscriptions.filter(i => i[0] === data.type);
        if (subs.length) {
            subs.forEach(i => i[1](data.payload));
        }
    };


    function addSubscription(type: string, handler: SubscriptionHandlerType) {
        setSubscriptions((prev) => {
            return [...prev, [type, handler]];
        });
    }

    React.useEffect(() => {
        if (!Config.WEB_SOCKET_URL) {
            return;
        }

        const ws = new WebSocket(Config.WEB_SOCKET_URL);

        ws.onopen = () => {
            console.log('[ws] connected');
        };
        ws.onmessage = (event) => {
            messageHandlerRef.current?.(event);
        };
        ws.onerror = (event) => {
            console.log('[ws] error: %s', event);
        };

        return () => {
            ws?.close();
        };
    }, []);

    return {
        addSubscription,
    };
}
