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
  getDataFromFirestore: () => Promise<UserData[]>;
  location: LocationData | null;
  setLocation: (latitude: number, longitude: number) => void;
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

  const getDataFromFirestore = async (): Promise<UserData[]> => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return [];
    }

    const snapshot = await getDocs(
      query(collection(db, "Users"), where("userId", "==", uid))
    );
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
    return data;
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
        uploadAndUpdateProfilePicture,
        getDataFromFirestore,
        location,
        setLocation: updateLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
