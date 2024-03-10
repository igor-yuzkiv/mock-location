import { Slider } from '@mui/material';

export type SettingsType = {
    tilt: number;
    speed: number;
    zoom: number;
}

type SettingsPropTypes = {
    model: SettingsType;
    onChange: (settings: SettingsType) => void;
}

export function RouteEmulatorSettings({ model, onChange }: SettingsPropTypes) {
    function handleChange(key: keyof SettingsType, value: number | number[]) {
        onChange({ ...model, [key]: value });
    }

    return <section className="flex flex-col px-2">
        <div>
            <label className="text-gray-600 dark:text-gray-400 text-sm">Speed (m/s)</label>
            <Slider
                size={'small'}
                defaultValue={3}
                value={model.speed}
                aria-label="Speed (m/s)"
                valueLabelDisplay="auto"
                max={50}
                min={1}
                onChange={(_, value) => handleChange('speed', value)}
            />
        </div>
        <div>
            <label className="text-gray-600 dark:text-gray-400 text-sm">Tilt</label>
            <Slider
                size={'small'}
                defaultValue={0}
                value={model.tilt}
                aria-label="Small"
                valueLabelDisplay="auto"
                max={90}
                min={1}
                onChange={(_, value) => handleChange('tilt', value)}
            />
        </div>
        <div>
            <label className="text-gray-600 dark:text-gray-400 text-sm">Zoom</label>
            <Slider
                size={'small'}
                defaultValue={20}
                value={model.zoom}
                aria-label="Small"
                valueLabelDisplay="auto"
                max={30}
                min={1}
                onChange={(_, value) => handleChange('zoom', value)}
            />
        </div>
    </section>;
}
