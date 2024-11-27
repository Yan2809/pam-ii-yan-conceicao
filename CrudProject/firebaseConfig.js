import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCYDXL61WMtVWSNZFQH0IwXsEJQDY62y6Q",
    authDomain: "crudproject-894cd.firebaseapp.com",
    projectId: "crudproject-894cd",
    storageBucket: "crudproject-894cd.firebasestorage.app",
    messagingSenderId: "790990004546",
    appId: "1:790990004546:web:34d3e8a72cfc782b5d68db",
    measurementId: "G-9RDKTQ23CJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
