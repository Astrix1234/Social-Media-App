import React, { useState, useLayoutEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";

import { useAppContext } from "../../components/AppContextProvider";

export const MapScreen = () => {
  const navigation = useNavigation();
  const { location } = useAppContext();
  const { setLocation } = useAppContext();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : null
  );

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : undefined;

  const handleMapPress = useCallback(
    (event: { nativeEvent: { coordinate: LatLng } }) => {
      setSelectedLocation(event.nativeEvent.coordinate);
    },
    []
  );

  const handleConfirmLocation = useCallback(() => {
    if (selectedLocation) {
      setLocation(selectedLocation.latitude, selectedLocation.longitude);
      navigation.goBack();
    }
  }, [selectedLocation, setLocation, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity onPress={handleConfirmLocation}>
          <Text>Confirm</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleConfirmLocation]);

  if (!location) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {selectedLocation && (
          <Marker title="Selected Location" coordinate={selectedLocation} />
        )}
      </MapView>
    </View>
  );
};
