import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { styles } from "./ProfileScreen.styles";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export const ProfileScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/Photo BG.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.photoContainer}></View>
        <Text style={styles.title}>Login</Text>
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
