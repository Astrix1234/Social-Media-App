import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9KalDVgvoll0azyykd3wxgvxuKhGT8n4",
  authDomain: "socialmedia-app-b63cc.firebaseapp.com",
  projectId: "socialmedia-app-b63cc",
  storageBucket: "socialmedia-app-b63cc.appspot.com",
  messagingSenderId: "913391936235",
  appId: "1:913391936235:web:29f6de192effb520f894ae",
  measurementId: "G-GW7MV1J60V",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let auth = getAuth(app);
if (!auth) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app);

export { auth };
