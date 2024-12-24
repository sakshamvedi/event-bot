// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9pvWKq8W26UzFk_wjqRSp_tLh8JnkSgw",
    authDomain: "ecom-project-5b6f8.firebaseapp.com",
    projectId: "ecom-project-5b6f8",
    storageBucket: "ecom-project-5b6f8.firebasestorage.app",
    messagingSenderId: "383140090253",
    appId: "1:383140090253:web:492f88b6db8eabd6976dc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };