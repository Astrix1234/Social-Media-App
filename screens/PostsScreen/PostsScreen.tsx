import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../components/AppContextProvider";
import { styles } from "./PostsScreen.styles";

export const PostsScreen = () => {
  const navigation = useNavigation();
  const { logoutUser } = useAppContext();

  const handleLogOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogOut}>
          <Feather
            name="log-out"
            size={30}
            color="#FF6C00"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.containerProfile}>
        <View style={styles.containerImage}></View>
        <View>
          <Text style={styles.login}>Profile</Text>
          <Text style={styles.email}>Profile</Text>
        </View>
      </View>
    </View>
  );
};
