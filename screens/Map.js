import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import LottieView from 'lottie-react-native';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/ApiKey';
if (firebase.app.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}
export default function Map({ navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userData, setUserData] = useState([]);

    const ref = firebase.firestore().collection('Trainer');
    // function getTrainerData() {
    //     ref.onSnapshot((querySnapshot) => {
    //         const items = [];
    //         querySnapshot.forEach((doc) => {
    //             items.push(doc.data());
    //         });
    //         console.log(items);
    //     });
    // }

    const email = navigation.getParam('email');
    console.log('EMAIL -->', email);
    function getTrainerData() {
        ref.where('email', '==', email).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setUserData(items);
            console.log('ITEMS ', items);
        });
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
        getTrainerData();
        console.log(userData);
    }, []);
    let text = `waiting..`;
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    if (location === null || location === undefined) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                }}
            >
                <LottieView
                    source={require('../assets/trainer.json')}
                    autoPlay
                    loop={true}
                    speed={1}
                    onAnimationFinish={() => {
                        console.log('Animation Finished!');
                        // this.props.navigation.replace('Home');
                    }}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 1 / 300,
                        longitudeDelta: 2 / 300,
                    }}
                    style={styles.mapStyle}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
