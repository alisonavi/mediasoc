import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDkXVNt3Ora3mnZhelLMz0Q51FviXvmKyc",
  authDomain: "igclone-6041c.firebaseapp.com",
  projectId: "igclone-6041c",
  storageBucket: "gs://igclone-6041c.appspot.com",
  messagingSenderId: "66339361455",
  appId: "1:66339361455:web:bc941d1c0826d35f163a5a"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

