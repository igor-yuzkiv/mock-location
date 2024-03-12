import { DeviceInterface } from '@/features/device-bridge';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

type PropsType = {
    devices: DeviceInterface[];
}

function ListItem({device}: {device: DeviceInterface}) {
    return (
        <ListItemButton>
            <ListItemAvatar>
                <Avatar>
                    <SmartphoneIcon />
                </Avatar>
            </ListItemAvatar>
            <div className="truncate">
                <div className="dark:text-gray-200 truncate">
                    {device.id}
                </div>
                <div className="text-sm text-gray-500">
                    {device.type}
                </div>
            </div>
        </ListItemButton>
    );
}

export function DevicesList({devices}: PropsType) {
    if (!devices.length) {
        return null;
    }

    return <List>
        {devices.map((device) => (
            <ListItem key={device.id} device={device} />
        ))}
    </List>;
}
