import React, { Component } from 'react';

import {
    Button,
    Text,
    TouchableOpacity,
    TextInput,
    View,
    StyleSheet,
} from 'react-native';
import firebase from 'firebase/app';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: null,
        };
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
            // this.props.navigation.navigate('Pokedex', { email });
            this.props.navigation.navigate('Map', { email });
            //changing above to test page before merge
        } catch (error) {
            this.setState({ loginError: error });
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
                {this.state.loginError ? (
                    <Text>{this.state.loginError.message}</Text>
                ) : (
                    console.log('login')
                )}
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
