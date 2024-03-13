import React from 'react';

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

export function useWebSocket(url: string) {
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

    function removeSubscription(type: string, handler: SubscriptionHandlerType) {
        setSubscriptions((prev) => {
            return prev.filter(i => i[0] !== type && i[1] !== handler);
        });
    }

    React.useEffect(() => {
        if (!url) {
            return;
        }
        const ws = new WebSocket(url);

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
    }, [url]);

    return {
        addSubscription,
        removeSubscription,
    };
}
