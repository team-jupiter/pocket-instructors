import React, { useState, useEffect } from 'react';
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
//import { dummyData } from './startingdummy';
import LottieView from 'lottie-react-native';
// import firebase from 'firebase/app';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/ApiKey';
import loading from '../screens/loading';

if (firebase.app.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}

export default function Map({ navigation }) {
    const targetRadius = 150;
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userData, setUserData] = useState();
    const [userInstructors, setUserInstructors] = useState([]);
    const [allInstructors, setAllInstructors] = useState([]);
    const ref = firebase.firestore().collection('Trainer');
    const ref4 = firebase.firestore().collection('Instructors');

    const onPress = () => {
        navigation.navigate('CaptureInt');
    };

    const email = navigation.getParam('email');

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
                instructors: [...userInstructors, newInstructor],
            });
        }
    }

    function rng() {
        const randomInstructorNumber = Math.floor(Math.random() * 2) + 1;
        return randomInstructorNumber;
    }

    function getAllInstructorData() {
        const items2 = [];
        ref4.onSnapshot((querySnapshot) => {
            const items2 = [];
            querySnapshot.forEach((doc) => {
                items2.push(doc.data());
            });
            setAllInstructors(items2);
            console.log('instructor output is .... ', allInstructors);
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
            // need to refresh this entire thing frequently, e.g. something like below ---
            // let location = await Location.watchPositionAsync({timeInterval: 1000})
            setLocation(location);
        })();

        getTrainerData();
        getAllInstructorData();
    }, []);

    useEffect(() => {
        if (userData) {
            setUserInstructors(userData[0].instructors);
        }
    }, [userData]);

    let text = `waiting..`;

    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    if (location === null || location === undefined) {
        return loading();
    } else {
        //Going to make the call to firebase here ---- every ~5 seconds, I am going to destroy existing markers
        //and create ~5 new Pokemon using the images that we have stored in the DB for each Pokemon

        const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 1 / 300,
            longtitudeDelta: 2 / 300,
        };

        let instructorTracker = [];

        for (let i = 0; i < 5; i++) {
            // console.log('all instructors....   ', allInstructors);

            //generate random number btwn 1-10 ... or however many Pokemon there are .... eg Math.floor(Math.random() * 10)
            //make API call to grab object for that user (e.g. firebase/pokemon/id/1)

            const randomInstructorNumber = Math.floor(Math.random() * 2);
            const instructorLocation = generateRandomPoint(
                userLocation,
                targetRadius,
                1
            );
            console.log(randomInstructorNumber);
            console.log(
                'random instructor..... ',
                allInstructors[randomInstructorNumber]
            );
            // console.log('Instructor data is....', instructors);

            let newObjToPush = {};

            newObjToPush.longitude = instructorLocation.longitude;
            newObjToPush.latitude = instructorLocation.latitude;
            instructorTracker.push(newObjToPush);
        }

        return (
            // somewhere here, I will need to be able to have a button or trigger where we can redirect to the
            // battle/capture screen and pass in props where props is something like instructor ID .....

            <View style={styles.container}>
                <MapView
                    showsBuildings
                    ref={(ref) => {
                        this.map = ref;
                    }}
                    userInterfaceStyle="dark"
                    // customMapStyle = {mapStyle}
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
                    // provider={PROVIDER_GOOGLE}
                    // customMapStyle={MapStyle}
                    style={styles.mapStyle}
                >
                    {/* reate an array of randomly generated instuctors and then .map through each one */}

                    {/* <MapView.Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }}
            image={require('./imgs/pic.png')}
          /> */}

                    <MapView.Marker
                        // key={`${p.latitude}::${p.longitude}`}
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                    >
                        <Image
                            source={require('../imgs/jake.png')}
                            style={{ width: 40, height: 42 }}
                            resizeMode="contain"
                        />
                    </MapView.Marker>

                    {/* THE THING BELOW IS THE ONLY THING THAT WORKS DONT FORGET!!!! */}
                    {instructorTracker.map((eachInstructor) => (
                        <MapView.Marker
                            key={`${eachInstructor.latitude}::${eachInstructor.longitude}`}
                            coordinate={{
                                latitude: eachInstructor.latitude,
                                longitude: eachInstructor.longitude,
                            }}
                        >
                            <Image
                                source={{
                                    uri:
                                        'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/steel.png?alt=media&token=87f81123-d76e-4068-8104-e71c4199b6e7',
                                }}
                                // source={require('../imgs/jakedog.png')}
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
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete
