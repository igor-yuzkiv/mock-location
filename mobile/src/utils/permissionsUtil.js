import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export async function checkLocationPermission() {
    return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(checkStatus => {
            if (checkStatus === RESULTS.GRANTED) {
                return true;
            }
            return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                .then(requestStatus => requestStatus === RESULTS.GRANTED)
                .catch(() => false);
        })
        .catch(() => false);
}

export async function checkBackgroundLocationPermission() {
    return check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
        .then(checkStatus => {
            if (checkStatus === RESULTS.GRANTED) {
                return true;
            }
            return request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
                .then(requestStatus => requestStatus === RESULTS.GRANTED)
                .catch(() => false);
        })
        .catch(() => false);
}
