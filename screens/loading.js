import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";

import LottieView from "lottie-react-native";
import { useState } from "react";
console.ignoredYellowBox = ["Warning:"];

async function locationStaus() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("STATUS--->", status);
    Alert.alert("Please enable Location Services!");
  }
}
let globalVar = 0;

const loading = () => {
  if (globalVar < 1) {
    locationStaus();
    globalVar++;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <LottieView
        source={require("../assets/trainer.json")}
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
};
const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Baskerville",
    fontSize: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default loading;
