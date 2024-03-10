import { useState } from 'react';
import { EmulatorOptionsInterface } from '@/features/route-emulator';

export function useRouteEmulatorSettings() {
    const [settings, setSettings] = useState<EmulatorOptionsInterface>({
        speed: 3,
        tilt: 0,
        zoom: 19,
    });

    return {
        settings,
        setSettings,
    };
}
