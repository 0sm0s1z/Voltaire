// src/firebase.js
import firebase from 'firebase';

const config = {
   apiKey: "...",
   authDomain: "...",
   databaseURL: "...",
   projectId: "...",
   storageBucket: "...",
   messagingSenderId: "..."
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
