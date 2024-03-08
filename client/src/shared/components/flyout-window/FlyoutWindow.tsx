import React from 'react';

const DEFAULT_SIZE = { width: '30vw', height: '50vh' };
const FULL_SCREEN_SIZE = { width: '100vw', height: '100vh' };

type FlyoutProps = {
    actions?: React.ReactNode;
    children?: React.ReactNode;
    title?: string;
};

export function FlyoutWindow({ children, title, actions }: FlyoutProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [dragState, setDragState] = React.useState({
        isDragging: false,
        x: 0,
        y: 0,
    });
    const [lastPosition, setLastPosition] = React.useState({
        x: 0,
        y: 0,
    });
    const [containerSize, setContainerSize] = React.useState(DEFAULT_SIZE);

    const mouseMoveListenerRef = React.useRef<((e: MouseEvent) => void) | null>(null);
    mouseMoveListenerRef.current = (e: MouseEvent) => {
        if (dragState.isDragging && containerRef.current) {
            e.preventDefault();
            const { clientX, clientY } = e;
            const newPosition = {
                x: clientX - dragState.x,
                y: clientY - dragState.y,
            };

            containerRef.current.style.left = `${newPosition.x}px`;
            containerRef.current.style.top = `${newPosition.y}px`;
            setLastPosition(newPosition);
        }
    };

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
        if (containerSize.width === '100vw') {
            return;
        }

        if (containerRef.current) {
            setDragState({
                isDragging: true,
                x: e.clientX - containerRef.current.getBoundingClientRect().left,
                y: e.clientY - containerRef.current.getBoundingClientRect().top,
            });
        }
    }

    function onMouseUp(): void {
        setDragState({ isDragging: false, x: 0, y: 0 });
    }

    function toggleFullScreen(): void {
        if (!containerRef.current) return;

        if (containerSize.width === '100vw') {
            setContainerSize(DEFAULT_SIZE);
            containerRef.current.style.left = `${lastPosition.x}px`;
            containerRef.current.style.top = `${lastPosition.y}px`;
        } else {
            setContainerSize(FULL_SCREEN_SIZE);
            containerRef.current.style.left = '0';
            containerRef.current.style.top = '0';
        }
    }

    React.useEffect(() => {
        const eventListeners = (e: MouseEvent) => mouseMoveListenerRef.current?.(e);
        window.addEventListener('mousemove', eventListeners);
        return () => window.removeEventListener('mousemove', eventListeners);
    }, []);

    return (
        <section
            className="fixed z-10 bottom-2 left-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden"
            ref={containerRef}
            style={containerSize}
        >
            <div className="flex flex-col w-full h-full overflow-hidden relative">
                <div
                    className="flex items-center justify-between w-full bg-gray-100 dark:bg-gray-800 py-1 px-2 cursor-grabbing"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onDoubleClick={toggleFullScreen}
                >
                    {Boolean(title) && <h1 className="text-lg font-bold">{title}</h1>}
                    {actions}
                </div>

                <div className="flex flex-col w-full h-full overflow-y-auto bg-white dark:bg-gray-700">{children}</div>
            </div>
        </section>
    );
}
