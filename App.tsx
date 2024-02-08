import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";
import { Loader } from "./components/Loader";
import { AppProvider } from "./components/AppContextProvider";
import AppNavigator from "./components/AppNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Thin": require("./assets/fonts/Roboto-Thin.ttf"),
  });

  if (!fontsLoaded) {
    return <Loader />;
  }

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
