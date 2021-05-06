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
import FirebaseConfig from '../constants/ApiKey';
import firebase from 'firebase/app';
import Navigator from '../routes/homeStack';

export default class Login extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        email: '',
        password: '',
        userData: [],
    };

    async onLogin() {
        try {
            const { email, password } = this.state;
            const result = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            console.log('LOGGED IN');
            this.props.navigation.navigate('Map', { email });
        } catch (error) {
            console.log('LOGIN PAGE ERROR', error);
        }
    }
    pressSignUpHandler() {
        this.props.navigation.navigate('SignUp');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Login</Text>
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

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogin.bind(this)}
                >
                    <Text style={styles.buttonText}> Login </Text>
                </TouchableOpacity>

                <Button
                    title="SignUp"
                    onPress={() => this.pressSignUpHandler()}
                />
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
