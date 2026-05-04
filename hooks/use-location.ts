import * as Location from 'expo-location';

export const getCurrentCoordinates = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission was denied');
  }

  const result = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: result.coords.latitude,
    longitude: result.coords.longitude,
  };
};
