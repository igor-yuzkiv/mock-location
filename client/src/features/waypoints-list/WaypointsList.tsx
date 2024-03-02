import { WaypointInterface } from './useWaypointsList.ts';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemSecondaryAction } from '@mui/material';
import LatLngUtil from '../../shared/utils/LatLngUtil.ts';

type WaypointsListPropTypes = {
    items?: WaypointInterface[];
    onClick?: (waypoint: WaypointInterface) => void;
    onDelete?: (waypoint: WaypointInterface) => void;
};

type WaypointListItemPropTypes = {
    item: WaypointInterface;
    onClick?: (waypoint: WaypointInterface) => void;
    onDelete?: (waypoint: WaypointInterface) => void;
};

function WaypointListItem({ item, onClick, onDelete }: WaypointListItemPropTypes) {
    return (
        <ListItemButton onClick={() => onClick && onClick(item)}>
            <ListItemAvatar>
                <Avatar>
                    <PlaceIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                className="truncate"
                primary={item.address || 'Unknown address'}
                secondary={LatLngUtil.toString(item.location)}
            />
            <ListItemSecondaryAction onClick={() => onDelete && onDelete(item)}>
                <DeleteIcon></DeleteIcon>
            </ListItemSecondaryAction>
        </ListItemButton>
    );
}

export function WaypointsList({ items, onClick, onDelete }: WaypointsListPropTypes) {
    return (
        <List component="nav" dense>
            {items?.map((item) => (
                <WaypointListItem key={item.id} item={item} onClick={onClick} onDelete={onDelete} />
            ))}
        </List>
    );
}
