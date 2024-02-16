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
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Loader } from "../../components/Loader";
import { useAppContext } from "../../components/AppContextProvider";
import { RootStackParamList } from "../../components/AppNavigator";
import { styles } from "./CommentsScreen.styles";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";

type CommentsScreenRouteParams = {
  postId: string;
};

type Post = {
  id: string;
  imageUri: string;
  userId: string;
};
interface EditingComment {
  id: string | null;
  text: string;
}

export const CommentScreen = () => {
  const {
    userId,
    allPosts,
    addComment,
    userData,
    comments,
    getAllCommentsFirestore,
    deleteComment,
  } = useAppContext();
  const inputRef = useRef<TextInput | null>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Comments">>();
  const { postId } = route.params as CommentsScreenRouteParams;
  const [post, setPost] = useState<Post | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [inputHeight, setInputHeight] = useState(50);
  const [inputText, setInputText] = useState<string | undefined>("");
  const [editingComment, setEditingComment] = useState<EditingComment>({
    id: null,
    text: "",
  });

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

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };
  const handlePressDelete = (postId: string, commentId: string) => {
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
                await deleteComment(postId, commentId);
                await getAllCommentsFirestore();
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

  const startEditingComment = (commentId: string, commentText: string) => {
    setEditingComment({
      id: commentId,
      text: commentText,
    });
    setInputText(commentText);
    inputRef.current?.focus();
  };

  const handleAddOrUpdateComment = async () => {
    if (editingComment.id) {
      await deleteComment(postId, editingComment.id);
    }
    await addComment(
      postId,
      userId,
      inputText as string,
      userData[0]?.profilePicture as string
    );
    setInputText("");
    setEditingComment({ id: null, text: "" });
    await getAllCommentsFirestore();
  };

  const handleBlur = () => {
    setFocusedField(null);
    if (editingComment.id) {
      setInputText("");
      setEditingComment({ id: null, text: "" });
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
                      a.createdAt.toDate().getTime() -
                      b.createdAt.toDate().getTime()
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
                        <View style={styles.containerEdit}>
                          <View style={styles.containerEditIcons}>
                            {comment.userId === userId && (
                              <TouchableOpacity
                                onPress={() =>
                                  startEditingComment(
                                    comment.id,
                                    comment.comment
                                  )
                                }
                              >
                                <Feather
                                  name="edit-2"
                                  size={24}
                                  color="#FF6C00"
                                />
                              </TouchableOpacity>
                            )}
                            {(post?.userId === userId ||
                              comment.userId === userId) && (
                              <TouchableOpacity
                                style={{ marginLeft: 26 }}
                                onPress={() =>
                                  handlePressDelete(comment.postId, comment.id)
                                }
                              >
                                <FontAwesome
                                  name="trash"
                                  size={24}
                                  color="#FF6C00"
                                />
                              </TouchableOpacity>
                            )}
                          </View>

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
                    </View>
                  ))
              ) : (
                <Text style={styles.noComments}>No comments yet</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
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
                value={inputText}
                onChangeText={setInputText}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="center"
              />

              <TouchableOpacity
                style={[styles.bthSend, inputText ? {} : styles.disabledButton]}
                onPress={handleAddOrUpdateComment}
                disabled={!inputText}
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
