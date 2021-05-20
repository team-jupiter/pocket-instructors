import React, { useState, useEffect, clearInterval } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { generateRandomPoint } from "../utilities/locationGenerator";
import LottieView from "lottie-react-native";
import * as firebase from "firebase";
import FirebaseConfig from "../constants/ApiKey";
import loading from "../screens/loading";
import { getPixelSizeForLayoutSize } from "react-native/Libraries/Utilities/PixelRatio";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

if (firebase.app.length === 0) {
  firebase.initializeApp(FirebaseConfig);
}
let instructorTracker = [];
let currentInsTriggerUseEffect = true;
let currentInsTriggerForLoop = true;
let tempFriends = {};
let musicPlayer = 0;

const io = require("socket.io-client");
let socket = io.connect("http://7508d2bacb47.ngrok.io");

export default function Map({ navigation }) {
  const targetRadius = 250;
  const [location, setLocation] = useState(null);
  const [locationForIns, setLocationForIns] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState();
  const [allInstructors, setAllInstructors] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [friends, setFriends] = useState({});
  const [sound, setSound] = useState();
  const ref = firebase.firestore().collection("Trainer");
  const ref4 = firebase.firestore().collection("Instructors");
  const email = navigation.getParam("email");
  console.log('NAVVVV--->',navigation.state.params)
  const globalJake = navigation.state.params.trainerData[0].jakeUrl;
  const jakesDog = require("../imgs/jakedog.png");
  const music = new Audio.Sound();

  const onPress = (eachInstructor) => {
    navigation.navigate("CaptureInt", {
      instructors,
      jakesDog,
      eachInstructor,
      email,
    });
  };

  const onPressUserDex = (userEmail) => {
    navigation.navigate("Pokedex", {
      emailImport: userEmail,
    });
  };

  const onPressOtherUserDex = (userEmail) => {
    navigation.navigate("OtherPokedex", {
      emailImport: userEmail,
    });
  };

  function getTrainerData() {
    ref.where("email", "==", email).onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setUserData(items);
    });
  }

  function getAllInstructorData() {
    ref4.onSnapshot((querySnapshot) => {
      const items2 = [];
      querySnapshot.forEach((doc) => {
        items2.push(doc.data());
      });
      setAllInstructors(items2);
    });
  }

  useEffect(() => {
    async function loadSound() {
      console.log("Sound Initialized");
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      await music.loadAsync(require("../audio/tonghua.mp3"), {
        shouldPlay: true,
        isLooping: true,
      });
      music.setOnPlaybackStatusUpdate();
    }
    if (musicPlayer === 0) {
      setSound("Placeholder variable");
      musicPlayer++;
      loadSound();
    }
  }, []);

  useEffect(() => {
    async function getIntLocations() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      const interval = setInterval(() => {
        (async () => {
          getAllInstructorData();
          // let { status } = await Location.requestForegroundPermissionsAsync();
          let locationForIns = await Location.getCurrentPositionAsync({});
          setLocationForIns(locationForIns);
          if (currentInsTriggerUseEffect === true) {
            currentInsTriggerUseEffect = false;
          } else {
            currentInsTriggerUseEffect = true;
          }
        })();
      }, 5000);
    }
    getIntLocations();
  }, []);

  useEffect(() => {
    async function getLocations() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      const interval = setInterval(() => {
        (async () => {
          getTrainerData();
          // if (status !== "granted") {
          //   setErrorMsg("Permission to access location was denied");
          //   return;
          // }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          socket.emit("position", {
            data: location,
            id: email,
            globalJake: globalJake,
          });
        })();
      }, 2000);
    }
    getLocations();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.on("otherPositions", (positionsData) => {
        tempFriends[positionsData.id] = { ...positionsData };
        setFriends({
          friends: tempFriends,
        });
      });
    }, 2000);
  }, []);

  let friendsPositionsArr = Object.values(friends);
  let friendsArr = friendsPositionsArr.map((eachthing) => {
    return Object.values(eachthing);
  });

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
        const randomInstructorNumber = Math.floor(Math.random() * 9);
        const instructorLocation = generateRandomPoint(
          userLocationForIns,
          targetRadius,
          1
        );

        let newObjToPush = {};
        newObjToPush.instructorDexID =
          allInstructors[randomInstructorNumber].instructorDexID;
        newObjToPush.instructorName =
          allInstructors[randomInstructorNumber].instructorName;
        // newObjToPush.description =
        //   allInstructors[randomInstructorNumber].description;
        // img for capture
        newObjToPush.imgUrl = allInstructors[randomInstructorNumber].imgUrl;
        // img for smol map
        newObjToPush.smlImg = allInstructors[randomInstructorNumber].smlImg;
        newObjToPush.longitude = instructorLocation.longitude;
        newObjToPush.latitude = instructorLocation.latitude;
        newObjToPush.frontImg = allInstructors[randomInstructorNumber].frontImg;
        newObjToPush.backImg = allInstructors[randomInstructorNumber].backImg;
        newObjToPush.level = 1;
        newObjToPush.xp = 0;

        newObjToPush.attack =
          Math.floor(
            Math.random() *
              (allInstructors[randomInstructorNumber].maxAttack -
                0.8 * allInstructors[randomInstructorNumber].maxAttack)
          ) +
          0.8 * allInstructors[randomInstructorNumber].maxAttack;
        newObjToPush.defense =
          Math.floor(
            Math.random() *
              (allInstructors[randomInstructorNumber].maxDefense -
                0.8 * allInstructors[randomInstructorNumber].maxDefense)
          ) +
          0.8 * allInstructors[randomInstructorNumber].maxDefense;
        newObjToPush.hp =
          Math.floor(
            Math.random() *
              (allInstructors[randomInstructorNumber].maxHP -
                0.8 * allInstructors[randomInstructorNumber].maxHP)
          ) +
          0.8 * allInstructors[randomInstructorNumber].maxHP;

        instructorTracker.push(newObjToPush);
      }
    }
    if (friendsArr[0] !== undefined) {
      return (
        <View style={styles.container}>
          <MapView
            //customMapStyle imports map designs from https://mapstyle.withgoogle.com/
            customMapStyle={require("../assets/map-design.json")}
            provider={PROVIDER_GOOGLE}
            showsBuildings
            // ref={(ref) => {
            //   this.map = ref;
            // }}
            // onLayout={() => {
            //   this.map.animateToBearing(125);
            //   this.map.animateToViewingAngle(45);
            // }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 1 / 300,
              longitudeDelta: 2 / 300,
            }}
            style={styles.mapStyle}
          >
            <View style={styles.overlay}>
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => onPressUserDex(email)}
              >
                <Image
                  source={require("../img/pokemon/pokeball.png")}
                  style={{ width: 55, height: 55 }}
                />
              </TouchableOpacity>
            </View>
            <MapView.Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
            >
              <Image
                source={{
                  uri: userData[0].jakeUrl,
                }}
                style={{ width: 40, height: 42 }}
                resizeMode="contain"
              />
            </MapView.Marker>
            {instructorTracker.map((eachInstructor) => (
              <MapView.Marker
                onPress={() => onPress(eachInstructor)}
                key={`${eachInstructor.latitude}::${eachInstructor.longitude}`}
                coordinate={{
                  latitude: eachInstructor.latitude,
                  longitude: eachInstructor.longitude,
                }}
              >
                <Image
                  source={{
                    uri: eachInstructor.smlImg,
                  }}
                  style={{ width: 40, height: 42 }}
                  resizeMode="contain"
                />
              </MapView.Marker>
            ))}
            {friendsArr[0].map((eachPlayer) => (
              <MapView.Marker
                onPress={() => onPressOtherUserDex(eachPlayer.id)}
                key={`${eachPlayer.data.coords.latitude}::${eachPlayer.data.coords.longitude}`}
                coordinate={{
                  latitude: eachPlayer.data.coords.latitude,
                  longitude: eachPlayer.data.coords.longitude,
                }}
              >
                <Image
                  //modify this line here
                  source={{
                    uri: eachPlayer.globalJake,
                  }}
                  // source={require('../imgs/pic.png')}
                  style={{ width: 40, height: 42 }}
                  resizeMode="contain"
                />
              </MapView.Marker>
            ))}
          </MapView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <MapView
            customMapStyle={require("../assets/map-design.json")}
            provider={PROVIDER_GOOGLE}
            showsBuildings
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 1 / 300,
              longitudeDelta: 2 / 300,
            }}
            style={styles.mapStyle}
          >
            <View>
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => onPressUserDex(email)}
              >
                <Image
                  source={require("../img/pokemon/pokeball.png")}
                  style={{ width: 55, height: 55 }}
                />
              </TouchableOpacity>
            </View>

            <MapView.Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
            >
              <Image
                source={{
                  uri: userData[0].jakeUrl,
                }}
                style={{ width: 40, height: 42 }}
                resizeMode="contain"
              />
            </MapView.Marker>
            {instructorTracker.map((eachInstructor) => (
              <MapView.Marker
                onPress={() => onPress(eachInstructor)}
                key={`${eachInstructor.latitude}::${eachInstructor.longitude}`}
                coordinate={{
                  latitude: eachInstructor.latitude,
                  longitude: eachInstructor.longitude,
                }}
              >
                <Image
                  source={{
                    uri: eachInstructor.smlImg,
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlay: {
    position: "absolute",
    padding: 36,
    margin: 20,
    top: 10,
    right: 10,
    left: 10,
  },
});
