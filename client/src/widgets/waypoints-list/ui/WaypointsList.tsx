import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemSecondaryAction } from '@mui/material';
import LatLngUtil from '@/shared/lib/GeoUtil.ts';
import { WaypointInterface } from '@/widgets/waypoints-list';

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
            <div className="truncate">
                <div className="dark:text-gray-200 truncate">
                    {item.address || 'Unknown address'}
                </div>
                <div className="text-sm text-gray-500">
                    {LatLngUtil.toString(item.location)}
                </div>
            </div>
            <ListItemSecondaryAction onClick={() => onDelete && onDelete(item)}>
                <DeleteIcon className={'dark:text-gray-200'}/>
            </ListItemSecondaryAction>
        </ListItemButton>
    );
}

export function WaypointsList({ items, onClick, onDelete }: WaypointsListPropTypes) {
    return <div className="flex flex-col overflow-auto p-1">
        <List dense>
            {items?.map((item) => (
                <WaypointListItem key={item.id} item={item} onClick={onClick} onDelete={onDelete} />
            ))}
        </List>
    </div>;
}
