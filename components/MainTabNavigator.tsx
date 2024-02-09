import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { PostsScreen } from "../screens/PostsScreen/PostsScreen";
import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";
import { CreatePostsScreen } from "../screens/CreatePostsScreen/CreatePostsScreen";

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        tabBarIcon: ({ focused, color }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];

          if (route.name === "Posts") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CreatePosts") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "alert";
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: "#FF6C00",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="CreatePosts" component={CreatePostsScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
