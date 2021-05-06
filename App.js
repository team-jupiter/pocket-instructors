import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions } from 'react-native';
import FirebaseConfig from './constants/ApiKey';
import Navigator from './routes/homeStack';
import firebase from 'firebase/app';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
    console.log(FirebaseConfig);
}
export default function App() {
    return <Navigator />;
}
