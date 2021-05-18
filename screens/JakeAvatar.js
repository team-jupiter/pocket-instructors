import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native';
import * as firebase from 'firebase';
import { useEffect } from 'react';

// const testEmail = 'b@b.com'

export default function JakeAvatar({ navigation }) {
  const [jakesState, setJakes] = useState()
  const email = navigation.getParam('email');
  const jakeDB = firebase.firestore().collection('Jakes');
  const ref = firebase.firestore().collection('Trainer')

  function getAllJakes() {
    jakeDB.onSnapshot((querySnapshot) => {
      const jakesArray = [];
      querySnapshot.forEach((doc) => {
        jakesArray.push(doc.data());
      });
      setJakes(jakesArray);
    });
  }

  function setJakePic(email, jakeUrlValue) {
    ref.doc(email).set({ email, instructors: [], jakeUrl: jakeUrlValue });
    navigation.navigate('Map', {
      email
    });
  }

  useEffect(() => {
    getAllJakes()
  }, [])


  if (jakesState !== undefined) {
    console.log('Your Jakes are ...', jakesState)
    return (
      <ScrollView>
      <View style={styles.masterContainer}>
        <Text style={styles.title}> Which of these self provided pictures of Jake is the cutest? </Text>
        <View style={styles.container}>
          {jakesState.map((eachJake) => (
            <View style={styles.eachPokemonContainer} key={eachJake.description}>
              <TouchableOpacity onPress={() => setJakePic(email, eachJake.jakeUrl)}>
              {/* <TouchableOpacity> */}
                <Image
                  source={{ uri: eachJake.jakeUrl }}
                  style={{ width: 300, height: 320 }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    );
  }

  return (
    <View>
        <Text> Loading ... </Text>
    </View>
  );
}

//https://htmlcolorcodes.com/
const styles = StyleSheet.create({
  masterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EE82EE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  eachPokemonContainer: {
    backgroundColor: '#ee82ee',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#0F0503',
    borderWidth: 10,
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
});
