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
} from "react-native";
import { styles } from "./ProfileScreen.styles";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { useAppContext } from "../../components/AppContextProvider";

export const ProfileScreen = () => {
  const {
    userData,
    userPosts,
    toggleLikePost,
    userId,
    scrollPosition,
    setScrollPosition,
  } = useAppContext();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
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
                        <TouchableOpacity onPress={() => console.log("press")}>
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
                    </View>
                    <View style={styles.locationContainer}>
                      <TouchableOpacity onPress={() => console.log("press")}>
                        <FontAwesome6
                          name="location-dot"
                          size={24}
                          color="#FF6C00"
                        />
                      </TouchableOpacity>
                      <Text style={styles.place}>{post.location}</Text>
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
