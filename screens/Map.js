import React, { useState, useEffect } from 'react';
import {
    Platform,
    Text,
    View,
    StyleSheet,
    Dimensions,
    Button,
} from 'react-native';
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
    const [userData, setUserData] = useState();
    const [instructors, setInstructors] = useState([]);
    const ref = firebase.firestore().collection('Trainer');

    const email = navigation.getParam('email');

    //pulling trainer data
    async function getTrainerData() {
        await ref.where('email', '==', email).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            return setUserData(items);
        });
    }

    const newInstructor = {
        instructorDexID: 2,
        instructorName: 'Jon Dagdagan',
        description:
            'Jon is a legendary instructor. His voice is said to bring peace to world wars and calamities',
        maxAttack: 200,
        maxDefense: 50,
        maxHP: 500,
        moveSet: [
            {
                move: 'Provides pictures for student projects',
                attack: 200,
                type: 'Built Different',
            },
            {
                move: 'Closes HELP ticket',
                attack: 150,
                type: 'Educational',
            },
        ],
        type: 'Educational',
    };
    function addInstructor(newInstructor) {
        if (instructors.length) {
            console.log('DATA FROM ADD INSTRUCTOR -->', instructors);
            ref.doc('trainer1').update({
                instructors: [...instructors, newInstructor],
            });
        }
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
    }, []);

    useEffect(() => {
        if (userData) {
            setInstructors(userData[0].instructors);
        }
    }, [userData]);

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
