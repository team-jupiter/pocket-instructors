import React, { Component } from "react";

import {
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import firebase from "firebase/app";
console.ignoredYellowBox = ["Warning:"];

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: null,
    };
  }
  state = {
    email: "",
    password: "",
    userData: [],
    trainerData: [],
  };

  async onLogin() {
    try {
      const { email, password } = this.state;
      const ref = await firebase.firestore().collection("Trainer");
      ref.where("email", "==", email).onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        this.state.trainerData = items;
      });

      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      this.props.navigation.navigate("Map", this.state);
    } catch (error) {
      this.setState({ loginError: error });
      Alert.alert("Invalid Email/Password");
      console.log("LOGIN PAGE ERROR", error);
    }
  }
  pressSignUpHandler() {
    this.props.navigation.navigate("SignUp");
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../imgs/palletTown.jpeg")}
          style={styles.backgroundImage}
        />
        <Image
          source={require("../imgs/poketInstructors.png")}
          style={{ width: 300, height: 120, bottom: 200 }}
        />
        <Text style={styles.titleText}></Text>
        <TextInput
          value={this.state.email}
          keyboardType="email-address"
          onChangeText={(email) => this.setState({ email })}
          placeholder="email"
          placeholderTextColor="black"
          style={styles.inputUser}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={"password"}
          secureTextEntry={true}
          placeholderTextColor="black"
          style={styles.inputPass}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={this.onLogin.bind(this)}
          >
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.pressSignUpHandler()}
          >
            <Text style={styles.buttonText}> SignUp </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "salmon",
  },
  titleText: {
    fontFamily: "Baskerville",
    fontSize: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "powderblue",
    width: 150,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    opacity: 0.8,
  },
  buttonText: {
    fontFamily: "Baskerville",
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputUser: {
    bottom: 150,
    paddingVertical: 15,
    maxWidth: 250,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    width: 250,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    opacity: 0.8,
  },
  inputPass: {
    bottom: 140,
    paddingVertical: 15,
    maxWidth: 250,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    width: 250,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    opacity: 0.8,
  },
  backgroundImage: {
    position: "absolute",
    height: 1000,
    resizeMode: "stretch",
    opacity: 1,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
