import React from 'react';
import FirebaseConfig from './constants/ApiKey';
import Navigator from './routes/homeStack';
import firebase from 'firebase/app';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
}
console.ignoredYellowBox = ['Warning:'];
export default function App() {
    return <Navigator />;
}
