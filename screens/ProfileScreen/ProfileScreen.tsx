import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { styles } from "./ProfileScreen.styles";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useAppContext } from "../../components/AppContextProvider";

export const ProfileScreen = () => {
  const { userData } = useAppContext();

  return (
    <ImageBackground
      source={require("../../assets/images/Photo BG.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          {userData.length > 0 && userData[0].profilePicture ? (
            <Image
              source={{ uri: userData[0].profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.photoContainer}></View>
          )}
        </View>
        {userData.length > 0 ? (
          <Text style={styles.title}>{userData[0].login}</Text>
        ) : (
          <Text style={styles.title}>Hello</Text>
        )}
        <View style={styles.postContainer}>
          <View style={styles.imageContainer}></View>
          <Text style={styles.postTitle}>Title</Text>
          <View style={styles.linksContainer}>
            <View style={styles.comLikiesContainer}>
              <View style={styles.comContainer}>
                <TouchableOpacity onPress={() => console.log("press")}>
                  <FontAwesome name="comment" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.counter}>8</Text>
              </View>
              <View style={styles.likesContainer}>
                <TouchableOpacity onPress={() => console.log("press")}>
                  <AntDesign name="like2" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.counter}>153</Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <TouchableOpacity onPress={() => console.log("press")}>
                <FontAwesome6 name="location-dot" size={24} color="#FF6C00" />
              </TouchableOpacity>
              <Text style={styles.place}>Poland</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
