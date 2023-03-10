import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeMfp8srsuIl8JcSo3b7b4tM9ab2EXB34",
  authDomain: "fir-e8c83.firebaseapp.com",
  projectId: "fir-e8c83",
  storageBucket: "fir-e8c83.appspot.com",
  messagingSenderId: "72484656511",
  appId: "1:72484656511:web:c36cd9e67ea1e7a9b3764a"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 6000);
//   connectStorageEmulator(storage, "localhost", 9199);
// }

export { auth, db, storage };
