import React, { useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../components/AppContextProvider";
import { styles } from "./PostsScreen.styles";

export const PostsScreen = () => {
  const navigation = useNavigation();

  const {
    logoutUser,
    userData,
    allPosts,
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
      <ScrollView
        style={{ flex: 1, paddingBottom: 550, flexGrow: 1 }}
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
        {allPosts.length > 0 ? (
          allPosts
            .sort(
              (a, b) =>
                b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
            )
            .map((post) => (
              <View key={post.id}>
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
                        <FontAwesome name="comment" size={24} color="#FF6C00" />
                      </TouchableOpacity>
                      <Text style={styles.counter}>{post.commentsNumber}</Text>
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
  );
};
