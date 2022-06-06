// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7cVwcASzhp3MTlxZ91PzV4FSCCJG_k_o",
    authDomain: "dev-ritik.firebaseapp.com",
    projectId: "dev-ritik",
    storageBucket: "dev-ritik.appspot.com",
    messagingSenderId: "497790559662",
    appId: "1:497790559662:web:96f17b76fe2058c03ed43f",
    measurementId: "G-59HWCZK9ZH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();