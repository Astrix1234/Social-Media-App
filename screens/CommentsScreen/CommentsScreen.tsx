import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Loader } from "../../components/Loader";
import { useAppContext } from "../../components/AppContextProvider";
import { RootStackParamList } from "../../components/AppNavigator";
import { styles } from "./CommentsScreen.styles";
import { AntDesign } from "@expo/vector-icons";

type CommentsScreenRouteParams = {
  postId: string;
};

type Post = {
  id: string;
  imageUri: string;
};

export const CommentScreen = () => {
  const { userId, allPosts, addComment, userData, comments } = useAppContext();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Comments">>();
  const { postId } = route.params as CommentsScreenRouteParams;
  const [post, setPost] = useState<Post | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [inputHeight, setInputHeight] = useState(50);
  const [inputText, setInputText] = useState<string | null>("");

  useEffect(() => {
    const foundPost = allPosts.find((post) => post.id === postId);
    setPost(foundPost || null);
  }, [allPosts, postId]);

  if (!userId) {
    return <Loader />;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
    });
  }, []);

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };
  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleAddComment = async (
    postId: string,
    userId: string,
    comment: string,
    imageUri: string
  ) => {
    try {
      await addComment(postId, userId, comment, imageUri);
      setInputText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flexGrow: 1,
              paddingLeft: 16,
              paddingRight: 16,
              alignItems: "center",
            }}
          >
            {post ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: post.imageUri }}
                  style={styles.postPhoto}
                />
              </View>
            ) : (
              <Text>Loading post image...</Text>
            )}
            <View>
              {comments.length > 0 ? (
                comments
                  .filter((comment) => comment.postId === postId)
                  .sort(
                    (a, b) =>
                      b.createdAt.toDate().getTime() -
                      a.createdAt.toDate().getTime()
                  )
                  .map((comment, index) => (
                    <View
                      key={comment.id}
                      style={[
                        styles.commentContainer,
                        index % 2 === 0 && styles.rowReverse,
                      ]}
                    >
                      <View style={styles.imageProfileContainer}>
                        <Image
                          source={{ uri: comment.imageUri }}
                          style={styles.profilePhoto}
                        />
                      </View>
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.commentText}>
                          {comment.comment}
                        </Text>
                        <Text style={styles.time}>
                          {comment.createdAt
                            .toDate()
                            .toLocaleDateString("pl-PL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                        </Text>
                      </View>
                    </View>
                  ))
              ) : (
                <Text style={styles.noComments}>No comments yet</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "comment" && styles.focused,
                  { height: Math.max(50, inputHeight) },
                ]}
                id="comment"
                placeholder="comment"
                placeholderTextColor="#BDBDBD"
                onBlur={handleBlur}
                onFocus={() => handleFocus("comment")}
                multiline={true}
                onChangeText={setInputText}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="center"
              />

              <TouchableOpacity
                style={styles.bthSend}
                onPress={() =>
                  handleAddComment(
                    postId,
                    userId,
                    inputText as string,
                    userData[0]?.profilePicture as string
                  )
                }
              >
                <AntDesign name="arrowup" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
