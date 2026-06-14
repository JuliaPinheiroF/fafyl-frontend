declare module 'expo-location' {
  export interface LocationObject {
    coords: {
      latitude: number;
      longitude: number;
    };
  }
  export interface LocationPermissionResponse {
    status: 'granted' | 'denied' | 'undetermined';
  }
  export const Accuracy: { High: number };
  export function getForegroundPermissionsAsync(): Promise<LocationPermissionResponse>;
  export function requestForegroundPermissionsAsync(): Promise<LocationPermissionResponse>;
  export function hasServicesEnabledAsync(): Promise<boolean>;
  export function getCurrentPositionAsync(options?: { accuracy?: number }): Promise<LocationObject>;
}
