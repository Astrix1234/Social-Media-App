import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9KalDVgvoll0azyykd3wxgvxuKhGT8n4",
  authDomain: "socialmedia-app-b63cc.firebaseapp.com",
  projectId: "socialmedia-app-b63cc",
  storageBucket: "socialmedia-app-b63cc.appspot.com",
  messagingSenderId: "913391936235",
  appId: "1:913391936235:web:29f6de192effb520f894ae",
  measurementId: "G-GW7MV1J60V",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export { auth };
