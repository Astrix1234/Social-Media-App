import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegistrationScreen } from "../screens/RegistrationScreen/RegistrationScreen";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";
import { MainTabNavigator } from "../components/MainTabNavigator";
import { Loader } from "./Loader";
import { useAppContext } from "../components/AppContextProvider";
import { MapScreen } from "../screens/MapScreen/MapScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Map: {
    onLocationSelect?: (location: string) => void;
  };
};

export default function AppNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { isLoading, user, setScrollPosition } = useAppContext();
  const [navState, setNavState] = useState<NavigationState | undefined>();

  const getCurrentRouteName = (
    state: NavigationState | undefined
  ): string | undefined => {
    const route = state?.routes[state?.index ?? 0];

    if (route?.state) {
      return getCurrentRouteName(route.state as NavigationState | undefined);
    }

    return route?.name;
  };

  useEffect(() => {
    const currentRouteName = getCurrentRouteName(navState);
    if (currentRouteName) {
      setScrollPosition(0);
    }
  }, [navState, setScrollPosition]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer
      initialState={navState}
      onStateChange={(state) => setNavState(state)}
    >
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShown: true, title: "Select a location" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
