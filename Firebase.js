import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyB6pzibRO7S6iFAOmGjPjqsDva5oUlyL7A",

	authDomain: "monke-21406.firebaseapp.com",

	projectId: "monke-21406",

	storageBucket: "monke-21406.appspot.com",

	messagingSenderId: "605300240131",

	appId: "1:605300240131:web:dd735f5bc0d7226b70c336",

	measurementId: "G-57LV39LXJS",
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
