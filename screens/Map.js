import React, { useState, useEffect } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { generateRandomPoint } from '../Utilities/locationGenerator';
//import { dummyData } from './startingdummy';
import LottieView from 'lottie-react-native';
import * as firebase from 'firebase';
import FirebaseConfig from '../constants/ApiKey';
import CaptureInt from './CaptureInt';
import { Redirect } from 'react-router-dom';

if (firebase.app.length === 0) {
  firebase.initializeApp(FirebaseConfig);
}

export default function Map({ navigation }) {
  const targetRadius = 150;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState();
  const [instructors, setInstructors] = useState([]);
  const ref = firebase.firestore().collection('Trainer');

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
  //   const newInstructor = {
  //     instructorDexID: 2,
  //     instructorName: 'Jon Dagdagan',
  //     description:
  //         'Jon is a legendary instructor. His voice is said to bring peace to world wars and calamities',
  //     maxAttack: 200,
  //     maxDefense: 50,
  //     maxHP: 500,
  //     moveSet: [
  //         {
  //             move: 'Provides pictures for student projects',
  //             attack: 200,
  //             type: 'Built Different',
  //         },
  //         {
  //             move: 'Closes HELP ticket',
  //             attack: 150,
  //             type: 'Educational',
  //         },
  //     ],
  //     type: 'Educational',
  // };
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
      // need to refresh this entire thing frequently, e.g. something like below ---
      // let location = await Location.watchPositionAsync({timeInterval: 1000})
      setLocation(location);
    })();

    getTrainerData();
    console.log(userData);
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
    //Going to make the call to firebase here ---- every ~5 seconds, I am going to destroy existing markers
    //and create ~5 new Pokemon using the images that we have stored in the DB for each Pokemon

    // console.log('location is...', location);
    // console.log('dummydata is ...', dummyData);
    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 1 / 300,
      longtitudeDelta: 2 / 300,
    };

    let instructorTracker = [];
    for (let i = 0; i < 15; i++) {
      //generate random number btwn 1-10 ... or however many Pokemon there are .... eg Math.floor(Math.random() * 10)
      //make API call to grab object for that user (e.g. firebase/pokemon/id/1)
      const instructorLocation = generateRandomPoint(
        userLocation,
        targetRadius,
        1
      );

      // console.log('results of RNG code ....', instructorLocation);

      let newObjToPush = {};

      newObjToPush.longitude = instructorLocation.longitude;
      newObjToPush.latitude = instructorLocation.latitude;
      instructorTracker.push(newObjToPush);
      // console.log(
      //   'interim instructorTracker results are ...',
      //   instructorTracker
      // );
    }

    const instructorLocation = generateRandomPoint(
      userLocation,
      targetRadius,
      1
    );
    // console.log('userLocation is ...', userLocation);
    // console.log('instructorLocation is ...', instructorLocation);
    // // console.log('the entire instructorTracker array looks like ...', instructorTracker)
    // console.log(
    //   'first instructorTracker in arr lat is....',
    //   instructorTracker[0].latitude
    // );
    // console.log('instructorLocation is ...', instructorLocation)

    return (
      // somewhere here, I will need to be able to have a button or trigger where we can redirect to the
      // battle/capture screen and pass in props where props is something like instructor ID .....

      <View style={styles.container}>
        <MapView
          showsBuildings
          ref={(ref) => {
            this.map = ref;
          }}
          userInterfaceStyle='dark'
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
              resizeMode='contain'
            />
          </MapView.Marker>

          {/* solomarker */}
          {/* <MapView.Marker
          coordinate={{latitude: instructorLocation.latitude,
          longitude: instructorLocation.longitude}}
          image={require('./imgs/steel.png')}
        /> */}

          {/* iterating through multiple markers */}
          {/* {instructorTracker.map((eachInstructor, index) => {
            console.log('eachInstructors lat is...', eachInstructor.latitude)
            // <MapView.Marker
            //   key={index}
            //   coordinate={{
            //     latitude: eachInstructor.latitude,
            //     longitude: eachInstructor.longitude
            //   }}
            //   image={require('./imgs/steel.png')}
            // />
          })} */}

          {/* THE THING BELOW IS THE ONLY THING THAT WORKS DONT FORGET!!!! */}
          {instructorTracker.map((p) => (
            <MapView.Marker
              // key={`${p.latitude}::${p.longitude}`}
              coordinate={{
                latitude: p.latitude,
                longitude: p.longitude,
              }}
            >
              <Image
                source={require('../imgs/jakedog.png')}
                style={{ width: 40, height: 42 }}
                resizeMode='contain'
                onPress={() => {
                  <Redirect to={CaptureInt} />;
                }}
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
