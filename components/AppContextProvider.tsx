import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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

interface UserCredentials {
  email: string;
  login: string;
  password: string;
  imageUri?: string;
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
  imageUri: string;
  title: string;
  location: string;
  likes: number;
  commentsNumber: number;
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
  loginUser: ({ email, password }: UserCredentials) => Promise<User>;
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
  userId: string | null;
  userData: UserData[];
  userPosts: UserPosts[];
  allPosts: AllPosts[];
  location: LocationData | null;
  setLocation: (latitude: number, longitude: number) => void;
  fetchAddress: (latitude: number, longitude: number) => Promise<string>;
  toggleLikePost: (postId: string, userId: string) => Promise<void>;
  addPostForUser: (
    userId: string,
    imageUri: string,
    title: string,
    location: string,
    likes: number,
    commentsNumber: number
  ) => Promise<string>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

    const storage = getStorage();
    const db = getFirestore();
    const userStorageRef = storageRef(storage, `profilePictures/${userId}`);
    const userDocRef = doc(db, "Users", userId);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(userStorageRef, blob);
      const photoURL = await getDownloadURL(snapshot.ref);

      if (user) {
        await updateProfile(user, { photoURL });
      }
      await updateDoc(userDocRef, {
        profilePicture: photoURL,
      });

      if (user) {
        setUser({ ...user, photoURL } as User);
      }
    } catch (error) {
      console.error(error);
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

      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async ({ email, password }: UserCredentials) => {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setIsLoading(false);
    setUser(userCredential.user);
    return userCredential.user;
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

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      getAllPostsFirestore();
      getUserPostsFirestore(user.uid);
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
      // console.log("All posts: ", posts);
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
      // console.log("User posts: ", posts);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    title: string,
    location: string,
    likes: number,
    commentsNumber: number
  ): Promise<string> => {
    try {
      let photoURL = "";
      if (imageUri) {
        console.log(
          `Adding post for user: ${userId} with imageUri: ${imageUri}`
        );
        photoURL = await uploadPostImageAndGetUrl(imageUri, userId);
        console.log(`Uploaded image URL: ${photoURL}`);
      }

      const globalPostsRef = collection(db, "AllPosts");

      const PostGlobalRef = await addDoc(globalPostsRef, {
        imageUri: photoURL,
        title,
        location,
        likes,
        commentsNumber,
        userId: userId,
        createdAt: serverTimestamp(),
      });
      console.log("Global Post added with ID:", PostGlobalRef.id);

      await getAllPostsFirestore();
      await getUserPostsFirestore(userId);
      return PostGlobalRef.id;
    } catch (error) {
      console.error("Error adding post:", error);
      throw new Error("Failed to add post");
    }
  };

  useEffect(() => {
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
        // console.log("Data from Firestore: ", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      getDataFromFirestore();
    }
  }, [user]);

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
        userId,
        toggleLikePost,
        addPostForUser,
        userData,
        userPosts,
        allPosts,
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
