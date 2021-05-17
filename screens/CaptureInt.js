import React, { useEffect, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Camera } from 'expo-camera';
import * as firebase from 'firebase';
import { Audio } from 'expo-av';

const { height, width } = Dimensions.get('window');

export default function CaptureInt(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [captured, setCaptured] = useState(false);

  const ref = firebase.firestore().collection('Trainer');
  const ref4 = firebase.firestore().collection('Instructors');

  const { eachInstructor } = props.navigation.state.params;
  const { instructorUrl } = props.navigation.state.params.eachInstructor;
  const { instructors } = props.navigation.state.params;
  const { instructorDexID } = props.navigation.state.params.instructors;
  const { imgUrl } = props.navigation.state.params.eachInstructor;
  const { email } = props.navigation.state.params;

  // console.log('eachInstructor is ...', eachInstructor)
  // console.log('instructors is ...', instructors.length)

  function addInstructor(newInstructor) {
    if (instructors.length) {
      // console.log('DATA FROM ADD INSTRUCTOR -->', instructors);
      //this is hardcoded, this needs to be adjusted
      // let testInstructors = [...instructors, newInstructor]
      // console.log('testInstructors is....', testInstructors)
      ref.doc(email).update({
        instructors: [...instructors, newInstructor],
      });


    }
  }

  //Set up refs
  const gyroTracker = null;

  //Set up animations
  const animatedPokemonPosition = new Animated.ValueXY();
  const pokemonPosition = { x: 0, y: 0 };

  const animatedPokeball = new Animated.ValueXY();

  //allows pokeballs to spins
  const interpolatedRotateAnimation = animatedPokeball.x.interpolate({
    inputRange: [0, width / 2, width],
    outputRange: ['-360deg', '0deg', '360deg'],
  });

  //Set up touch handlers
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,

    onPanResponderMove: Animated.event([
      null,
      { dx: animatedPokeball.x, dy: animatedPokeball.y },
    ]),

    // if capture is set to true push to data base
    onPanResponderRelease: (event, gesture) => {
      if (isCaptured(gesture)) {
        setCaptured(true),
          () => {
            setTimeout(goBack, 1500);
          };
      } else {
        Animated.spring(animatedPokeball, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const goBack = () => {
    props.navigation.pop();
  };

  const isCaptured = (gesture) => {
    const pokeballX = gesture.moveX;
    const pokeballY = gesture.moveY;

    const pokemonX = width / 2 + pokemonPosition.x;
    const pokemonY = height / 3 + pokemonPosition.y;

    //only returns if both these absolute vals under 50
    return (
      Math.abs(pokeballX - pokemonX) < 50 && Math.abs(pokeballY - pokemonY) < 50
    );
  };

  useEffect(() => {
    Gyroscope.setUpdateInterval(50);

    Gyroscope.addListener(
      trackGyrometer(
        Animated.event([
          { x: animatedPokemonPosition.x, y: animatedPokemonPosition.y },
        ])
      )
    );
    return function cleanup() {
      Gyroscope.removeAllListeners();
    };
  }, []);
  function trackGyrometer(eventHandler) {
    return (data) => {
      pokemonPosition.x += (data.y - 0.03) * 30;
      pokemonPosition.y += (data.x + 0.05) * 30;

      eventHandler(pokemonPosition);
    };
  }
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <StatusBar animated hidden />
      <Animated.Image
        source={require('../imgs/image.png')}
        styles={styles.background}
      />
      {/* <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera> */}

      {captured ? (
        <View style={[styles.overlay, styles.captureOverlay]}>
          <Text style={styles.cancelText}>Pokemon Captured!</Text>
          {addInstructor(eachInstructor)}
        </View>
      ) : (
        <Animated.Image
          source={{ uri: imgUrl }}
          style={[
            styles.pokemon,
            {
              transform: [
                { translateX: animatedPokemonPosition.x },
                { translateY: animatedPokemonPosition.y },
              ],
            },
          ]}
        />
      )}

      <View style={[styles.overlay, styles.topOverlay]}>
        <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
          <Text style={styles.cancelText}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.overlay, styles.bottomOverlay]}>
        <Animated.Image
          source={require('../img/pokemon/pokeball.png')}
          style={{
            transform: [
              { translateX: animatedPokeball.x },
              { translateY: animatedPokeball.y },
              { rotate: interpolatedRotateAnimation },
            ],
          }}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomOverlay: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureOverlay: {
    top: width / 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    padding: 15,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
  },
  pokemon: {
    position: 'absolute',
    top: height / 5,
    bottom: height / 5,
    right: width / 5,
    left: width / 5,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});
