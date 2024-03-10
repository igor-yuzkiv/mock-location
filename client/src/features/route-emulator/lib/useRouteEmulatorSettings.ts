import { useState } from 'react';
import { EmulatorOptionsInterface } from '@/features/route-emulator';

export function useRouteEmulatorSettings() {
    const [settings, setSettings] = useState<EmulatorOptionsInterface>({
        speed: 3,
        tilt: 45,
        zoom: 20,
        follow: true,
    });

    return {
        settings,
        setSettings,
    };
}
