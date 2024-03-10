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
            <label>Speed (m/s)</label>
            <Slider
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
            <label>Tilt</label>
            <Slider
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
            <label>Zoom</label>
            <Slider
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
