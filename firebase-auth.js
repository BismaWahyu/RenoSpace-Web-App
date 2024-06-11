import React from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

import {
  getAuth,
  browserSessionPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxORkYaYTTl68kBHacnDIQWfmjgpgSE3c",
  authDomain: "share-economy-f0c14.firebaseapp.com",
  databaseURL:
    "https://share-economy-f0c14-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "share-economy-f0c14",
  storageBucket: "share-economy-f0c14.appspot.com",
  messagingSenderId: "119034655597",
  appId: "1:119034655597:web:cd77c98227dadfaa5a6064",
  measurementId: "G-MPFCC1YZHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analyticsMock = {
//   logEvent: () => {},
//   setCurrentScreen: () => {},
//   setUserId: () => {},
// }
// const analytics = isSupported(````) ? getAnalytics(app) : analyticsMock;
// logEvent(analytics, 'select_content', {
//   content_type: 'button',
//   content_id: 'home-contact'
// });
// logEvent(analytics, 'select_content', {
//   content_type: 'button',
//   content_id: 'business-contact'
// });

export const auth = getAuth(app);
