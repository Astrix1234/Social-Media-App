import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../components/AppContextProvider";
import { styles } from "./PostsScreen.styles";
import { Loader } from "../../components/Loader";

export const PostsScreen = () => {
  const navigation = useNavigation();
  const { logoutUser, userData } = useAppContext();

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
            color="#BDBDBD"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.containerProfile}>
        <View style={styles.containerImage}>
          {userData.length > 0 && userData[0].profilePicture ? (
            <Image
              source={{ uri: userData[0].profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.containerImage}></View>
          )}
        </View>
        <View>
          {userData.length > 0 ? (
            <>
              <Text style={styles.login}>{userData[0].login}</Text>
              <Text style={styles.email}>{userData[0].email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.login}>Hello</Text>
              <Text style={styles.email}></Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
