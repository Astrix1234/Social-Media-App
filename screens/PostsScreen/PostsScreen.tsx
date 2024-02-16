import React, { useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
  Linking,
} from "react-native";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppContext } from "../../components/AppContextProvider";
import { RootStackParamList } from "../../components/AppNavigator";
import { styles } from "./PostsScreen.styles";

type commentsScreenProp = StackNavigationProp<RootStackParamList, "Comments">;

export const PostsScreen = () => {
  const navigation = useNavigation();
  const navigationComments = useNavigation<commentsScreenProp>();

  const {
    logoutUser,
    userData,
    allPosts,
    toggleLikePost,
    userId,
    scrollPosition,
    setScrollPosition,
    deletePost,
    getAllPostsFirestore,
    getUserPostsFirestore,
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
                <View style={styles.createdPost}>
                  <View style={styles.userPost}>
                    <View style={styles.imageProfileContainer}>
                      <Image
                        source={{ uri: post.profilePicture }}
                        style={styles.imageProfile}
                      />
                    </View>
                    <Text style={styles.userLogin}>{post.login}</Text>
                  </View>
                  <Text style={styles.createdAt}>
                    {post.createdAt.toDate().toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
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
                        onPress={() => {
                          navigationComments.navigate("Comments", {
                            postId: post.id,
                          });
                        }}
                      >
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
                    {userId === post.userId && (
                      <TouchableOpacity
                        style={{ marginLeft: 26 }}
                        onPress={() => handlePressDelete(post.id as string)}
                      >
                        <FontAwesome name="trash" size={24} color="#FF6C00" />
                      </TouchableOpacity>
                    )}
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
  );
};
