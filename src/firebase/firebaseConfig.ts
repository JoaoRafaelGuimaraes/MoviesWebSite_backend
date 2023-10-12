import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const admin = require('firebase-admin');

export const serviceAccount = require('./projetotraineegrupob-firebase-adminsdk-4rj4w-a9a25d85b4.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projetotraineegrupob.firebaseio.com'
});

const firebaseConfig = {
  apiKey: "AIzaSyAozyBpHjJtY9HW6-qdoqPM0QhmYshNzTg",
  authDomain: "projetotraineegrupob.firebaseapp.com",
  projectId: "projetotraineegrupob",
  storageBucket: "projetotraineegrupob.appspot.com",
  messagingSenderId: "987574682106",
  appId: "1:987574682106:web:e024be2a6c964e390ce443",
  measurementId: "G-QDLDKTDEH3"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
const firestore = app.firestore();