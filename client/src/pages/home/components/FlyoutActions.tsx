import { Button, Stack } from '@mui/material';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';

type FlyoutActionsProps = {
    onClickBuild: () => void;
    onClickReset: () => void;
    onClickPlay: () => void;
    isPlaying: boolean;
};

export function FlyoutActions({ onClickBuild, onClickPlay, onClickReset, isPlaying }: FlyoutActionsProps) {
    return (
        <div className="flex items-center w-full justify-between">
            <Stack direction="row">
                <Button size="small" onClick={onClickBuild}>
                    Build
                </Button>
                <Button size="small" onClick={onClickReset}>
                    Rest
                </Button>
            </Stack>
            <Stack direction="row">
                <Button onClick={onClickPlay} size="small">
                    {isPlaying ? <Pause sx={{ fontSize: 20 }} /> : <PlayArrow sx={{ fontSize: 20 }} />}
                </Button>
            </Stack>
        </div>
    );
}
