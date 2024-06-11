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
  apiKey: "AIzaSyAP1IuNhESzFeYgxSJLS8QY4sRw5WNAs3c",
  authDomain: "renospace-website.firebaseapp.com",
  projectId: "renospace-website",
  storageBucket: "renospace-website.appspot.com",
  messagingSenderId: "319280933990",
  appId: "1:319280933990:web:702f6e2d7505ac286d51a7",
  measurementId: "G-GLMEV4HSV1",
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
