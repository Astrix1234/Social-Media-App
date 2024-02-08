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

interface UserCredentials {
  email: string;
  password: string;
}

interface AppContextState {
  user: User | null;
  isLoading: boolean;
  registerUser: ({ email, password }: UserCredentials) => Promise<User>;
  loginUser: ({ email, password }: UserCredentials) => Promise<User>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (update: UserProfile) => Promise<User | undefined>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const registerUser = async ({ email, password }: UserCredentials) => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setIsLoading(false);
    setUser(userCredential.user);
    return userCredential.user;
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

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
