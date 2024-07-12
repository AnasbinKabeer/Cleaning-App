import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCcKS1r5TtO5TTqxJqpv2HliK6L73IBHiw",
    authDomain: "cleaning-management-sysem.firebaseapp.com",
    projectId: "cleaning-management-sysem",
    storageBucket: "cleaning-management-sysem.appspot.com",
    messagingSenderId: "915335062561",
    appId: "1:915335062561:web:294c0b7fc361bdd58a2f60",
    measurementId: "G-HLGQ4ZTRTM"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  export { db,app,auth };

