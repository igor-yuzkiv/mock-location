declare module 'react-native-config' {
    export interface NativeConfig {
        WEB_SOCKET_URL?: string;
    }

    export const Config: NativeConfig;
    export default Config;
}
