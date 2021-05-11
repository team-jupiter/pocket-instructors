import React, { useState, useEffect, clearInterval } from 'react';
import {
    Platform,
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { generateRandomPoint } from '../Utilities/locationGenerator';
import LottieView from 'lottie-react-native';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/ApiKey';
import loading from '../screens/loading';
import io from 'socket.io-client';

if (firebase.app.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}

let instructorTracker = [];
let currentInsTriggerUseEffect = true;
let currentInsTriggerForLoop = true;

export default function Map({ navigation }) {
    //SOCKET STUFF
    socket = io.connect('https://55e15375c658.ngrok.io');

    const targetRadius = 250;
    const [location, setLocation] = useState(null);
    const [locationForIns, setLocationForIns] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userData, setUserData] = useState();
    const [allInstructors, setAllInstructors] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [friends, setFriends] = useState({});
    const ref = firebase.firestore().collection('Trainer');
    const ref4 = firebase.firestore().collection('Instructors');
    const email = navigation.getParam('email');

    const jakesDog = require('../imgs/jakedog.png');
    const onPress = (eachInstructor) => {
        navigation.navigate('Capture', {
            instructors,
            jakesDog,
            eachInstructor,
        });
    };

    function rng() {
        const randomInstructorNumber = Math.floor(Math.random() * 2) + 1;
        return randomInstructorNumber;
    }

    function getTrainerData() {
        ref.where('email', '==', email).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setUserData(items);
        });
    }
    function addInstructor(newInstructor) {
        if (instructors.length) {
            ref.doc('trainer1').update({
                instructors: [...instructors, newInstructor],
            });
        }
    }

    function getAllInstructorData() {
        const items2 = [];
        ref4.onSnapshot((querySnapshot) => {
            const items2 = [];
            querySnapshot.forEach((doc) => {
                items2.push(doc.data());
            });
            setAllInstructors(items2);
        });
    }

    async function getInstructorDataAsync() {
        const asyncOutput = [];
        const randomInstructorNumber = rng();
        const asyncResults = await ref4
            .where('instructorDexID', '==', randomInstructorNumber)
            .get();
        asyncResults.forEach((doc) => {
            asyncOutput.push(doc.data());
        });
        return asyncOutput;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                getAllInstructorData();
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let locationForIns = await Location.getCurrentPositionAsync({});
                setLocationForIns(locationForIns);
                if (currentInsTriggerUseEffect === true) {
                    currentInsTriggerUseEffect = false;
                } else {
                    currentInsTriggerUseEffect = true;
                }
            })();
        }, 10000);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                getTrainerData();
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                socket.emit('position', {
                    data: location,
                    id: email,
                });
                socket.on('otherPositions', (positionsData) => {
                    // console.log('positionsData from server broadcast')
                    console.log('test socket console log');
                    let tempFriends = { friends };
                    tempFriends[positionsData.id] = { ...positionsData };
                    console.log('tempFRIENDS----->', tempFriends);
                    setFriends({
                        friends: tempFriends,
                    });
                });
            })();
        }, 500);
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
    if (
        location === null ||
        location === undefined ||
        locationForIns === null ||
        locationForIns === undefined
    ) {
        return loading();
    } else {
        const userLocationForIns = {
            latitude: locationForIns.coords.latitude,
            longitude: locationForIns.coords.longitude,
            latitudeDelta: 1 / 300,
            longtitudeDelta: 2 / 300,
        };

        const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 1 / 300,
            longtitudeDelta: 2 / 300,
        };

        if (currentInsTriggerUseEffect !== currentInsTriggerForLoop) {
            if (currentInsTriggerForLoop === true) {
                currentInsTriggerForLoop = false;
            } else {
                currentInsTriggerForLoop = true;
            }
            while (instructorTracker.length > 0) {
                instructorTracker.pop();
            }
            for (let i = 0; i < 5; i++) {
                const randomInstructorNumber = Math.floor(Math.random() * 3);
                const instructorLocation = generateRandomPoint(
                    userLocationForIns,
                    targetRadius,
                    1
                );

                //temp image pin URLs to use due to exceeding quotas w/ Firebase
                let urlHolder = '';
                if (
                    allInstructors[randomInstructorNumber].instructorName ===
                    'Eric Katz'
                ) {
                    urlHolder =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_GqsPdrWQPOnJ8Ki-cNjmv6I9pEHg-b_NBg&usqp=CAU';
                } else if (
                    allInstructors[randomInstructorNumber].instructorName ===
                    'Jon Dagdagan'
                ) {
                    urlHolder =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaPuU8pvL4Imk_mdW3A9vjsshrEPHpdebKg&usqp=CAU';
                } else {
                    urlHolder =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9xZHk5MbSDC0uAAPWIEv7tBkcA5YhtT7nw&usqp=CAU';
                }

                let newObjToPush = {};

                newObjToPush.instructorDexID =
                    allInstructors[randomInstructorNumber].instructorDexID;
                newObjToPush.instructorName =
                    allInstructors[randomInstructorNumber].instructorName;

                //use 'urlHolder' to use static images not from Firebase (due to quota issues)
                newObjToPush.instructorUrl = urlHolder;
                // newObjToPush.instructorUrl = allInstructors[randomInstructorNumber].url;
                newObjToPush.longitude = instructorLocation.longitude;
                newObjToPush.latitude = instructorLocation.latitude;

                instructorTracker.push(newObjToPush);
            }
        }

        // console.log(instructorTracker);

        return (
            <View style={styles.container}>
                <MapView
                    //customMapStyle imports map designs from https://mapstyle.withgoogle.com/
                    //doesn't appear to work in conjunction w/ angled maps, buildings, etc.
                    customMapStyle={require('../assets/map-design.json')}
                    provider={PROVIDER_GOOGLE}
                    showsBuildings
                    ref={(ref) => {
                        this.map = ref;
                    }}
                    onLayout={() => {
                        this.map.animateToBearing(125);
                        this.map.animateToViewingAngle(45);
                    }}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 1 / 300,
                        longitudeDelta: 2 / 300,
                    }}
                    style={styles.mapStyle}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                    >
                        <Image
                            source={require('../imgs/pic.png')}
                            style={{ width: 40, height: 42 }}
                            resizeMode="contain"
                        />
                    </MapView.Marker>

                    {instructorTracker.map((eachInstructor) => (
                        <MapView.Marker
                            //modify props passed here to be RNG'ed
                            onPress={() => onPress(eachInstructor)}
                            key={`${eachInstructor.latitude}::${eachInstructor.longitude}`}
                            coordinate={{
                                latitude: eachInstructor.latitude,
                                longitude: eachInstructor.longitude,
                            }}
                        >
                            <Image
                                source={{
                                    uri: eachInstructor.instructorUrl,
                                }}
                                style={{ width: 40, height: 42 }}
                                resizeMode="contain"
                            />
                        </MapView.Marker>
                    ))}
                </MapView>
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
