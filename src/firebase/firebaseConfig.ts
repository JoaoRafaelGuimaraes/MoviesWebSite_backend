import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import dotenv from 'dotenv';
dotenv.config();

const admin = require('firebase-admin');

const serviceAccount = {
    "type": "service_account",
    "project_id": "projetotraineegrupob",
    "private_key_id": "3cf2f69b9b7f06f7bb9c30361b842f0d545d8a9f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdjwAmzd2Rk6dR\n5am6I2uovnPhQLng+VU9ZmoHrGA+JJ0kQ0UDzoAUg5x+Fqx+N5SL5PAnb+nhEgIY\nYsN6tBWiDiXx+mm4UMfWU2ubZNo1cai+IV3Msm6093fvds36jXuX+/74FUlcaPSC\nqjlEjqfnMSNf8Lh6owLsP/kGkhFi7+Ecm4RFDtZq9nT80eFI3hUuDYec46AjUHFc\nMt9l+lPgoFdwPromvEc/C5aTAx5vtZijfRfPy+8H3d8LiRZt8yDzL3/DXvfBDyVy\nXlFN4r0ov4UWn2w6nCHh+En/+dRPrLN38cz5MHn3h0a0gRBXq+UUKxhqEF2o7NR7\ncBl038RFAgMBAAECggEAE9Pabwev1GbCbaSl4U4dJD/OEWYLKOv3oCHH7MNH2/TQ\n7wP60WnROxj86UPX3TeyspAoRgOSvnIntViTGllDR6uEIZl5ExWHWx9lsUkrH1f4\nUO+eAD6MKVXjJU12ymBiUf6yWBdFriK/HRpoLop38rjU/M6Bngfu5uV+Dyeelyvq\nQ3sp/aVLc4TQ2lnkg7ITS1KL2FIoY4Mj5x/OhNqXUxZYwXbwAV0UL1MZ6ISNHFuH\nNyxj8cNTcYxBRbc9h8sReSJ84FfltRJcybhVPQFW7eQxX1s1IYDrdoJhldsDW2oc\n90w8RBknSAXRo7BQaQ0LRa63+hXCUlZNdo9BYnTkGQKBgQDLlZCx4jUmx5f284GF\nNPa7u7H3rdA+CIi4/u6cWTFpjl6HCmJuKMEgg7UsfkWmfbguOO/vQbj4ngr4SdDt\namLO0bVrfSX+c+gc8X+63wwuVYMSWyne25O54YfkRyViOiZDTb01HsxSXh6C1iHv\n76SlCLyc8xp63VRmMoH63yb2qwKBgQDGH9cv5Vhrt6P4QfhtNEAILl0T+SdEtZUk\ngCo9kPtxhbYjLZAZUy8lxHG2WT4B/AbyrqU7UbvOIyTdIpc4AV9SD/ipTeA3tCmv\ntGx5a6IkplEk1cNteydgDWszSNFYaSoM3/C7WlY5+uIUy7Ua8TkMrm9cqx3P1kZN\n5LWrT1rwzwKBgBdEVq8dzTlLYmDE366bqP83qlVGNiCA1S9fY2HXB8Cqlr8UPr+c\nRMY0h0Y4gDlQ8PXHaBSODFfNqC9MMGaR3A0LBpLsUKVOFd8I8rImv7uj5kD4zkY8\nDhwWXHOIdgtN3gWfItqpVGyteQs28dX8K3L5FqVRW1tjZDvx1c0YJ9nVAoGAXAOL\nqAXm49gdAf55hxY+Ks6FkfIkB6ghhRs1AvTjolyMM5hElU5p1it++EZIIxnOjEUK\nHhuekmUGCOG4w1z3zR/3x4GQga5dsemke1u+qTDI/Md+hMkuh1CUGfRWra3hxqr2\nnbyd0T2wZCIbkVC4wyf8NliOduk4K5LtwIsRXEcCgYEAoB4FvVOpyXUoNhDYMU/f\n0Nd7WzGVsvWUejdCi5Ib/Lm0NNL9BwJBSb5OG9BGDRjHFAfDR/kYdqXjlVoH5w7T\nYIxH1VjQ1wTXtoKnnl1P6fedwMHt05ywmyHflRXbjySZRCpAstdn1Bg29bFDciTz\nS+LPsixv0xMtnKisr6KzROc=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-4rj4w@projetotraineegrupob.iam.gserviceaccount.com",
    "client_id": "105529219700699653926",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4rj4w%40projetotraineegrupob.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}  ;

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