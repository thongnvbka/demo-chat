import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLln03vsiGTEpkKfPqmjjVI0PcIq71Qv0",
  authDomain: "demochat-474fc.firebaseapp.com",
  projectId: "demochat-474fc",
  storageBucket: "demochat-474fc.appspot.com",
  messagingSenderId: "643213553823",
  appId: "1:643213553823:web:2ac4a1d5831682a82972aa"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectStorageEmulator(storage, "localhost", 9199);
// }

export { auth, db, storage };
