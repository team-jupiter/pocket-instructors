import React, { useEffect, useState } from "react";
import { View, Text,StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";

import LottieView from "lottie-react-native";
console.ignoredYellowBox = ["Warning:"];
let { status } = Location.requestForegroundPermissionsAsync();

const loading = () => {
    useEffect(() => {
        if (status !== 'granted') {
            Alert.alert('Please enable Location Services!')
            }
      }, [] );

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
                    // console.log('Animation Finished!');
                    // this.props.navigation.replace('Home');
                }}
            />
        </View>
    );
  }
const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Baskerville",
    fontSize: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default loading;
