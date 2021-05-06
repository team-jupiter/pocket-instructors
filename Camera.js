import React, { useEffect, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  View,
  Text,
  Image,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import { BarCodeScanner, Permissions, Gyroscope } from 'expo';

const { height, width } = Dimensions.get('window');

export const CameraCapture = (props) => {
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const [captured, setCaptured] = useState(null);

  //Set up refs
  const gyroTracker = null;

  //Set up animations
  const animatedPokemonPosition = new Animated.ValueXY();
  const pokemonPosition = { x: 0, y: 0 };

  const animatedPokeball = new Animated.ValueXY();

  const interpolatedRotateAnimation = animatedPokeball.x.interpolate({
    inputRange: [0, width / 2, width],
    outputRange: ['-360deg', '0deg', '360deg'],
  });

  //Set up touch handlers
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,

    onPanResponderMove: Animated.event([
      null,
      {
        dx: animatedPokeball.x,
        dy: animatedPokeball.y,
      },
    ]),

    onPanResponderRelease: (event, gesture) => {
      if (isCaptured(gesture)) {
        (setCaptured = true),
          () => {
            setTimeout(goBack, 1500);
          };
      } else {
        Animated.spring(animatedPokeball, {
          toValue: { x: 0, y: 0 },
        }).start();
      }
    },
  });

  useEffect(() => {
    (async () => {
      const { status } = await CameraCapture.requestPermissionAsync();
      setCameraPermission(status === 'granted');
    })();
    Gyroscope.setUpdateInterval(50);

    Gyroscope.addListener(
      this.trackGyrometer(
        Animated.event([
          {
            x: this.animatedPokemonPosition.x,
            y: this.animatedPokemonPosition.y,
          },
        ])
      )
    );
    return function cleanup() {
      Gyroscope.removeAllListeners();
    };
  }, []);
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const trackGyrometer = (eventHandler) => {
    return (data) => {
      pokemonPosition.x += (data.y - 0.03) * 30;
      pokemonPosition.y += (data.x + 0.05) * 30;
      eventHandler(pokemonPosition);
    };
  };

  const goBack = () => {
    props.navigator.pop();
  };

  const isCaptured = (gesture) => {
    const pokeballX = gesture.moveX;
    const pokeballY = gesture.moveY;

    const pokemonX = width / 2 + pokemonPosition.x;
    const pokemonY = height / 3 + pokemonPosition.Position.y;

    return (
      Math.abs(pokeballX - pokemonX) < 50 && Math.abs(pokeballY - pokemonY) < 50
    );
  };
  return (
    <View>
      {hasCameraPermission && (
        <BarCodeScanner
          style={styles.camera}
          type={'back'}
          onBarCodeRead={() => {}}
        />
      )}

      {captured ? (
        <View style={[styles.overlay, styles.captureOverlay]}>
          <Text style={styles.cancelText}>Pokemon Captured!</Text>
        </View>
      ) : (
        <Animated.Image
          source={props.route.params.pokemon.image}
          styles={[
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
          source={require('../img/pokeball.png')}
          style={{
            transform: [
              { translateX: this.animatedPokeball.x },
              { translateY: this.animatedPokeball.y },
              { rotate: interpolatedRotateAnimation },
            ],
          }}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

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
    top: height / 3,
    bottom: height / 3,
    right: width / 3,
    left: width / 3,
  },
});
