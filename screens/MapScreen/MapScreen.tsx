import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Region, LatLng } from "react-native-maps";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../components/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Location from "expo-location";

type MapScreenRouteProp = RouteProp<RootStackParamList, "MapScreen">;

export const MapScreen = () => {
  const route = useRoute<MapScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [location, setLocation] = useState<Region | undefined>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleMapPress = (event: { nativeEvent: { coordinate: LatLng } }) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && route.params?.onLocationSelect) {
      route.params.onLocationSelect(
        `${selectedLocation.latitude}, ${selectedLocation.longitude}`
      );
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={
          location || {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker title="Selected location" coordinate={selectedLocation} />
        )}
      </MapView>
      <TouchableOpacity
        onPress={handleConfirmLocation}
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <Text>Confirm location</Text>
      </TouchableOpacity>
    </View>
  );
};
