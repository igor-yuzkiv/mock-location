import React from 'react';
import styles from './FlyoutWindow.module.css';

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
    const [isFullScreen, setIsFullScreen] = React.useState(false);
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
        if (isFullScreen) {
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
        setIsFullScreen(prev => {
            const tmp = !prev;

            if (containerRef.current) {
                containerRef.current.style.left = tmp ? '0' : `${lastPosition.x}px`;
                containerRef.current.style.top = tmp ? '0' : `${lastPosition.y}px`;
            }

            return tmp;
        });
    }

    React.useEffect(() => {
        const eventListeners = (e: MouseEvent) => mouseMoveListenerRef.current?.(e);
        window.addEventListener('mousemove', eventListeners);
        return () => window.removeEventListener('mousemove', eventListeners);
    }, []);

    return (
        <section
            className={`${styles.window} ${isFullScreen && styles.windowFull}`}
            ref={containerRef}
        >
            <div className={styles.container}>
                <div
                    className={styles.header}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onDoubleClick={toggleFullScreen}
                >
                    {Boolean(title) && <h1 className="text-lg font-bold">{title}</h1>}
                    {actions}
                </div>

                <div className={styles.content}>{children}</div>
            </div>
        </section>
    );
}
