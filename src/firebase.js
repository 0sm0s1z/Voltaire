// src/firebase.js
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDw2GnErSEFs6mtjzBOLWVgvymR2s3L30E",
  authDomain: "public-key-da9b4.firebaseapp.com",
  databaseURL: "https://public-key-da9b4.firebaseio.com",
  projectId: "public-key-da9b4",
  storageBucket: "public-key-da9b4.appspot.com",
  messagingSenderId: "684409507310"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
