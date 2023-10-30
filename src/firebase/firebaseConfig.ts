import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import dotenv from 'dotenv';
dotenv.config();

const admin = require('firebase-admin');

console.log(process.env.PRIVATE_KEY);

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
}

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

const auth = app.auth();
const firestore = app.firestore();

export { admin, auth, serviceAccount };