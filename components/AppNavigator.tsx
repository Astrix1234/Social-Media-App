import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegistrationScreen } from "../screens/RegistrationScreen/RegistrationScreen";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";
import { MainTabNavigator } from "../components/MainTabNavigator";
import { Loader } from "../components/Loader";
import { useAppContext } from "../components/AppContextProvider";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export default function AppNavigator() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { isLoading, user } = useAppContext();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
