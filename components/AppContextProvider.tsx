import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  UserProfile,
  getAuth,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  Timestamp,
  getDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import * as Location from "expo-location";

export interface UserCredentials {
  email: string;
  login: string;
  password: string;
  imageUri?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  login: string;
  profilePicture?: string;
}

export interface UserPosts {
  id: string;
  userId: string;
  imageUri: string;
  title: string;
  location: string;
  likes: number;
  commentsNumber: number;
  createdAt: Timestamp;
}

export interface AllPosts {
  id: string;
  userId: string;
  profilePicture: string;
  login: string;
  imageUri: string;
  title: string;
  location: string;
  likes: number;
  commentsNumber: number;
  createdAt: Timestamp;
}

export interface UserComments {
  id: string;
  userId: string;
  postId: string;
  imageUri?: string;
  comment: string;
  createdAt: Timestamp;
}

export interface Comments {
  id: string;
  userId: string;
  postId: string;
  imageUri?: string;
  comment: string;
  createdAt: Timestamp;
}

export interface UserPostData {
  imageUri: string;
  title: string;
  location: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface AppContextState {
  user: User | null;
  isLoading: boolean;
  registerUser: (credentials: UserCredentials) => Promise<User>;
  loginUser: ({ email, password }: LoginCredentials) => Promise<User>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (update: UserProfile) => Promise<User | undefined>;
  uploadAndUpdateProfilePicture: (
    userId: string,
    imageUri: string
  ) => Promise<void>;
  uploadImageAndGetUrl: (imageUri: string, userId: string) => Promise<string>;
  uploadPostImageAndGetUrl: (
    imageUri: string,
    userId: string
  ) => Promise<string>;
  getDataFromFirestore: () => Promise<void>;
  userId: string | null;
  userData: UserData[];
  // setUserData: (data: UserData[]) => void;
  userPosts: UserPosts[];
  allPosts: AllPosts[];
  comments: Comments[];
  location: LocationData | null;
  setLocation: (latitude: number, longitude: number) => void;
  fetchAddress: (latitude: number, longitude: number) => Promise<string>;
  toggleLikePost: (postId: string, userId: string) => Promise<void>;
  getAllPostsFirestore: () => Promise<void>;
  getUserPostsFirestore: (userId: string) => Promise<void>;
  getAllCommentsFirestore: () => Promise<void>;
  addPostForUser: (
    userId: string,
    imageUri: string,
    profilePicture: string,
    login: string,
    title: string,
    location: string,
    likes: number,
    commentsNumber: number
  ) => Promise<string>;
  addComment: (
    postId: string,
    userId: string,
    comment: string,
    imageUri: string
  ) => Promise<string>;
  deletePost: (postId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [userPosts, setUserPosts] = useState<UserPosts[]>([]);
  const [allPosts, setAllPosts] = useState<AllPosts[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [comments, setComments] = useState<Comments[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      getAllPostsFirestore();
      getUserPostsFirestore(user.uid);
    }
  }, [user]);

  const uploadImageAndGetUrl = async (
    imageUri: string,
    userId: string
  ): Promise<string> => {
    try {
      const storage = getStorage();
      const imageRef = storageRef(storage, `profilePictures/${userId}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error("Error");
    }
  };

  const uploadPostImageAndGetUrl = async (
    imageUri: string,
    userId: string
  ): Promise<string> => {
    try {
      const uniqueFileName = `post_${Date.now()}`;
      const storagePath = `postPictures/${userId}/${uniqueFileName}`;

      const storage = getStorage();
      const imageRef = storageRef(storage, storagePath);
      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error("Error");
    }
  };
  const uploadAndUpdateProfilePicture = async (
    userId: string,
    imageUri: string
  ) => {
    setIsLoading(true);

    try {
      const db = getFirestore();
      const userDocRef = doc(db, "Users", userId);

      await updateDoc(userDocRef, {
        profilePicture: imageUri,
      });
    } catch (error) {
      console.error("Error updating profile picture URL in Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async ({
    email,
    password,
    imageUri,
    login,
  }: UserCredentials) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      let photoURL = "";
      if (imageUri) {
        photoURL = await uploadImageAndGetUrl(imageUri, userId);
      }

      const db = getFirestore();
      await setDoc(doc(db, "Users", userId), {
        email,
        login,
        profilePicture: photoURL,
        createdAt: new Date(),
        userId: userId,
      });
      await getDataFromFirestore();
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsLoading(false);
      await getDataFromFirestore();
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      let errorMessage = "Wrong email or password";
      Alert.alert("Login Failed", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    await signOut(auth);
    setUser(null);
    setUserData([]);
    setIsLoading(false);
  };

  const updateUserProfile = async (update: UserProfile) => {
    if (!user) return;
    setIsLoading(true);
    await updateProfile(user, update);
    setIsLoading(false);
    setUser({ ...user, ...update });
    return user;
  };

  const getDataFromFirestore = async () => {
    setIsLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setUserData([]);
      setIsLoading(false);
      return;
    }

    try {
      const snapshot = await getDocs(
        query(collection(db, "Users"), where("userId", "==", uid))
      );
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getDataFromFirestore();
    }
  }, [user]);

  const getAllPostsFirestore = async () => {
    setIsLoading(true);
    try {
      const postsSnapshot = await getDocs(collection(db, "AllPosts"));
      const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AllPosts[];
      setAllPosts(posts);
    } catch (error) {
      console.error("Error fetching all posts: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPostsFirestore = async (userId: string | null) => {
    setIsLoading(true);
    try {
      const postsSnapshot = await getDocs(
        query(collection(db, "AllPosts"), where("userId", "==", userId))
      );
      const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserPosts[];
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCommentsFirestore = async () => {
    setIsLoading(true);
    try {
      const allComments = [];
      const postsSnapshot = await getDocs(collection(db, "AllPosts"));

      for (const postDoc of postsSnapshot.docs) {
        const postId = postDoc.id;
        const commentsSnapshot = await getDocs(
          collection(db, "AllPosts", postId, "Comments")
        );

        const comments = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          postId,
          ...doc.data(),
        })) as unknown as UserComments[];

        allComments.push(...comments);
      }
      setComments(allComments);
    } catch (error) {
      console.error("Error fetching all comments: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllCommentsFirestore();
    }
  }, [user]);

  const toggleLikePost = async (postId: string, userId: string) => {
    const likeRefGlobal = doc(db, "AllPosts", postId, "Likes", userId);

    try {
      const docSnapGlobal = await getDoc(likeRefGlobal);
      if (docSnapGlobal.exists()) {
        await deleteDoc(likeRefGlobal);
        await updateDoc(doc(db, "AllPosts", postId), {
          likes: increment(-1),
        });
      } else {
        await setDoc(likeRefGlobal, { userId: userId });
        await updateDoc(doc(db, "AllPosts", postId), {
          likes: increment(1),
        });
      }
      await getAllPostsFirestore();
      await getUserPostsFirestore(userId);
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  const addPostForUser = async (
    userId: string,
    imageUri: string,
    profilePicture: string,
    login: string,
    title: string,
    location: string,
    likes: number,
    commentsNumber: number
  ): Promise<string> => {
    try {
      let photoURL = "";
      if (imageUri) {
        photoURL = await uploadPostImageAndGetUrl(imageUri, userId);
      }

      const globalPostsRef = collection(db, "AllPosts");

      const PostGlobalRef = await addDoc(globalPostsRef, {
        imageUri: photoURL,
        profilePicture,
        login,
        title,
        location,
        likes,
        commentsNumber,
        userId: userId,
        createdAt: serverTimestamp(),
      });

      await getAllPostsFirestore();
      await getUserPostsFirestore(userId);
      return PostGlobalRef.id;
    } catch (error) {
      console.error("Error adding post:", error);
      throw new Error("Failed to add post");
    }
  };

  const addComment = async (
    postId: string,
    userId: string,
    comment: string,
    imageUri: string
  ): Promise<string> => {
    try {
      const globalCommentsRef = collection(db, "AllPosts", postId, "Comments");

      const CommentGlobalRef = await addDoc(globalCommentsRef, {
        imageUri,
        comment,
        userId: userId,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "AllPosts", postId), {
        commentsNumber: increment(1),
      });
      await getAllCommentsFirestore();
      await getAllPostsFirestore();
      await getUserPostsFirestore(userId);
      return CommentGlobalRef.id;
    } catch (error) {
      console.error("Error comment:", error);
      throw error;
    }
  };

  const deleteCommentsForPost = async (postId: string) => {
    try {
      const commentsRef = collection(db, "AllPosts", postId, "Comments");
      const snapshot = await getDocs(commentsRef);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting comments for post", postId, ":", error);
      throw new Error("Failed to delete comments.");
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const commentRef = doc(db, "AllPosts", postId, "Comments", commentId);
      await deleteDoc(commentRef);
      await updateDoc(doc(db, "AllPosts", postId), {
        commentsNumber: increment(-1),
      });
      await getAllPostsFirestore();
      await getUserPostsFirestore(userId);
    } catch (error) {
      console.error("Error deleting comment", commentId, ":", error);
      throw new Error("Failed to delete comment.");
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await deleteCommentsForPost(postId);
      await deleteDoc(doc(db, "AllPosts", postId));
    } catch (error) {
      console.error("Error deleting post", postId, ":", error);
      throw new Error("Failed to delete post.");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coords);
    })();
  }, []);

  const updateLocation = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (results.length > 0) {
        const { city, country } = results[0];
        const address = `${city ? city + ", " : ""}${country}`;
        return address;
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
    return "";
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        uploadImageAndGetUrl,
        uploadPostImageAndGetUrl,
        uploadAndUpdateProfilePicture,
        getDataFromFirestore,
        getAllPostsFirestore,
        getUserPostsFirestore,
        getAllCommentsFirestore,
        userId,
        toggleLikePost,
        addPostForUser,
        addComment,
        deletePost,
        deleteComment,
        userData,
        userPosts,
        allPosts,
        comments,
        location,
        setLocation: updateLocation,
        fetchAddress,
        scrollPosition,
        setScrollPosition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
