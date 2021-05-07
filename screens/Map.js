import React, { useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { generateRandomPoint } from '../Utilities/locationGenerator';
import LottieView from 'lottie-react-native';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/ApiKey';

if (firebase.app.length === 0) {
  firebase.initializeApp(FirebaseConfig);
}

export default function Map({ navigation }) {
  const targetRadius = 150;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);

  const ref = firebase.firestore().collection('Trainer');
  const ref4 = firebase.firestore().collection('Instructors');
  const email = navigation.getParam('email');


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
          backgroundColor: '#ffffff'
        }}
      >
        <LottieView
          source={require('../assets/trainer.json')}
          autoPlay
          loop={true}
          speed={1}
          onAnimationFinish={() => {
            console.log('Animation Finished!');
          }}
        />
      </View>
    );
  } else {


    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 1 / 300,
      longtitudeDelta: 2 / 300
    };

    let instructorTracker = [];

    for (let i = 0; i < 15; i++) {
      const randomInstructorNumber = Math.floor(Math.random() * 3);
      const instructorLocation = generateRandomPoint(
        userLocation,
        targetRadius,
        1
      );


      //temp URLs due to exceeding quotas w/ firebase ... look into this further ...
      let urlHolder = '';
      if (
        allInstructors[randomInstructorNumber].instructorName === 'Eric Katz'
      ) {
        urlHolder =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_GqsPdrWQPOnJ8Ki-cNjmv6I9pEHg-b_NBg&usqp=CAU';
      } else if (
        allInstructors[randomInstructorNumber].instructorName === 'Jon Dagdagan'
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
    //   newObjToPush.instructorUrl = urlHolder;
      newObjToPush.instructorUrl = allInstructors[randomInstructorNumber].url;
      newObjToPush.longitude = instructorLocation.longitude;
      newObjToPush.latitude = instructorLocation.latitude;

      console.log('newObjToPush is...', newObjToPush)
      instructorTracker.push(newObjToPush);
    }

    return (

      <View style={styles.container}>
        <MapView
          showsBuildings
          ref={(ref) => {
            this.map = ref;
          }}
          userInterfaceStyle='dark'
          onLayout={() => {
            this.map.animateToBearing(125);
            this.map.animateToViewingAngle(45);
          }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 1 / 300,
            longitudeDelta: 2 / 300
          }}
          // provider={PROVIDER_GOOGLE}
          // customMapStyle={MapStyle}
          style={styles.mapStyle}
        >
          {/* Create an array of randomly generated instuctors and then .map through each one */}
          <MapView.Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }}
          >
            <Image
              source={require('../imgs/pic.png')}
              style={{ width: 40, height: 42 }}
              resizeMode='contain'
            />
          </MapView.Marker>

          {/* THE THING BELOW IS THE ONLY THING THAT WORKS DONT FORGET!!!! */}
          {instructorTracker.map((eachInstructor) => (
            <MapView.Marker
              key={`${eachInstructor.latitude}::${eachInstructor.longitude}`}
              coordinate={{
                latitude: eachInstructor.latitude,
                longitude: eachInstructor.longitude
              }}
            >
              <Image
                source={{
                  uri:
                    eachInstructor.instructorUrl
                }}
                style={{ width: 40, height: 42 }}
                resizeMode='contain'
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
    padding: 8
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
