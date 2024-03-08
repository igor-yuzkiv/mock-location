import {Button} from "@mui/material";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";

type FlyoutActionsProps = {
    onClickBuild: () => void;
    onClickReset: () => void;
    onClickPlay: () => void;
    isPlaying: boolean;
};

export function FlyoutActions({ onClickBuild, onClickPlay, onClickReset, isPlaying }: FlyoutActionsProps) {
    return (
        <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-x-1">
                <Button size="small" onClick={onClickBuild}>
                    Build
                </Button>
                <Button size="small" onClick={onClickReset}>
                    Rest
                </Button>
            </div>
            <div className="flex items-center gap-x-1">
                <Button onClick={onClickPlay} size="small">
                    {isPlaying ? <Pause sx={{ fontSize: 20 }} /> : <PlayArrow sx={{ fontSize: 20 }} />}
                </Button>
            </div>
        </div>
    );
}
