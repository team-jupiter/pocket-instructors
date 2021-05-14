import React, { Component } from 'react';

import {
    Alert,
    Button,
    Text,
    TouchableOpacity,
    TextInput,
    View,
    StyleSheet,
} from 'react-native';
import * as firebase from 'firebase';
import Navigator from '../routes/homeStack';
import FirebaseConfig from '../constants/ApiKey';
if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
    console.log(FirebaseConfig);
}
const ref = firebase.firestore().collection('Trainer');

export default class SignUp extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        email: '',
        password: '',
        name: '',
    };

    async onSignUp() {
        try {
            const { email, password, name } = this.state;
            const result = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);
            this.props.navigation.navigate('Map', { email });
            this.props.navigation.navigate('Map');
            ref.doc(email).set({ email, instructors: [] });
            console.log(result);
        } catch (error) {
            console.log('ERROR AT SIGNUP', error);
            console.log(FirebaseConfig.FirebaseConfig);
        }
    }
    pressHandler() {
        this.props.navigation.navigate('Login');
        console.log(this.props.navigation);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Sing up</Text>
                <TextInput
                    value={this.state.email}
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="email"
                    placeholderTextColor="white"
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'password'}
                    secureTextEntry={true}
                    placeholderTextColor="white"
                    style={styles.input}
                />
                <TextInput
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder={'name'}
                    secureTextEntry={true}
                    placeholderTextColor="white"
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onSignUp.bind(this)}
                >
                    <Text style={styles.buttonText}> Sign Up </Text>
                </TouchableOpacity>
                <Button title="Login" onPress={() => this.pressHandler()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'salmon',
    },
    titleText: {
        fontFamily: 'Baskerville',
        fontSize: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'powderblue',
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 25,
        marginBottom: 10,
    },
    buttonText: {
        fontFamily: 'Baskerville',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 200,
        fontFamily: 'Baskerville',
        fontSize: 20,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        marginVertical: 10,
    },
});
