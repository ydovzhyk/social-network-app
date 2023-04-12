import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {getReactNativePersistence, initializeAuth} from 'firebase/auth/react-native';

const firebaseConfig = {
    apiKey: "AIzaSyCtYwAJ1gfz9gjjYo_yfqs8aZ9wg-EJZSI",
    authDomain: "goit-react-native-yd.firebaseapp.com",
    projectId: "goit-react-native-yd",
    storageBucket: "goit-react-native-yd.appspot.com",
    messagingSenderId: "928534194260",
    appId: "1:928534194260:web:717817a530e0984a0e25c1",
    measurementId: "G-V8B5LWK14Q"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});