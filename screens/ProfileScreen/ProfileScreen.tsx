import React, { useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
  Linking,
} from "react-native";
import { styles } from "./ProfileScreen.styles";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppContext } from "../../components/AppContextProvider";
import { RootStackParamList } from "../../components/AppNavigator";
import * as ImagePicker from "expo-image-picker";

type commentsScreenProp = StackNavigationProp<RootStackParamList, "Comments">;

export const ProfileScreen = () => {
  const navigationComments = useNavigation<commentsScreenProp>();

  const {
    userData,
    userPosts,
    toggleLikePost,
    userId,
    scrollPosition,
    setScrollPosition,
    uploadImageAndGetUrl,
    uploadAndUpdateProfilePicture,
    getDataFromFirestore,
    deletePost,
    getAllPostsFirestore,
    getUserPostsFirestore,
  } = useAppContext();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  const handlePressDelete = (postId: string) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            (async () => {
              try {
                await deletePost(postId);
                await getAllPostsFirestore();
                await getUserPostsFirestore(userId as string);
              } catch (error) {
                console.error("Error during deletion process:", error);
              }
            })();
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const openGoogleMaps = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const handleLikePost = (postId: string, userId: string) => {
    toggleLikePost(postId, userId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: scrollPosition,
        animated: false,
      });
    }
  };

  const handleUpdateImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const photo = await uploadImageAndGetUrl(
        result.assets[0].uri,
        userId as string
      );
      await uploadAndUpdateProfilePicture(userId as string, photo);
      await getDataFromFirestore();
    }
  };

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
        <TouchableOpacity
          style={styles.btnEditPhoto}
          onPress={handleUpdateImage}
        >
          <Feather name="edit-2" size={24} color="#FF6C00" />
        </TouchableOpacity>
        {userData.length > 0 ? (
          <Text style={styles.title}>{userData[0].login}</Text>
        ) : (
          <Text style={styles.title}>Hello</Text>
        )}
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                y: scrollPosition,
                animated: false,
              });
            }
          }}
          scrollEventThrottle={16}
        >
          {userPosts.length > 0 ? (
            userPosts
              .sort(
                (a, b) =>
                  b.createdAt.toDate().getTime() -
                  a.createdAt.toDate().getTime()
              )
              .map((post) => (
                <View key={post.id} style={styles.postContainer}>
                  <Text style={styles.createdAt}>
                    {post.createdAt.toDate().toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: post.imageUri }}
                      style={styles.postPhoto}
                    />
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.linksContainer}>
                    <View style={styles.comLikiesContainer}>
                      <View style={styles.comContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigationComments.navigate("Comments", {
                              postId: post.id,
                            })
                          }
                        >
                          <FontAwesome
                            name="comment"
                            size={24}
                            color="#FF6C00"
                          />
                        </TouchableOpacity>
                        <Text style={styles.counter}>
                          {post.commentsNumber}
                        </Text>
                      </View>
                      <View style={styles.likesContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            handleLikePost(post.id, userId as string)
                          }
                        >
                          <AntDesign name="like2" size={24} color="#FF6C00" />
                        </TouchableOpacity>
                        <Text style={styles.counter}>{post.likes}</Text>
                      </View>
                      <TouchableOpacity
                        style={{ marginLeft: 26 }}
                        onPress={() => handlePressDelete(post.id as string)}
                      >
                        <FontAwesome name="trash" size={24} color="#FF6C00" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.locationContainer}>
                      <FontAwesome6
                        name="location-dot"
                        size={24}
                        color="#BDBDBD"
                      />
                      <TouchableOpacity
                        onPress={() => openGoogleMaps(post.location)}
                      >
                        <Text style={styles.place}>{post.location}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
          ) : (
            <Text style={styles.noPosts}>No posts yet</Text>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
