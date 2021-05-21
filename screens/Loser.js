import React, { Component } from 'react';

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
} from 'react-native';
import firebase from 'firebase/app';
console.ignoredYellowBox = ['Warning:'];

export default function Winner(props){

        return (
            <View style={styles.container}>
                <Image
                    source={require('../imgs/palletTown.jpeg')}
                    style={styles.backgroundImage}
                />
                <Image
                    source={require('../imgs/loser.png')}
                    style={{ width: 350, height: 200, bottom: 60}}
                />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>{props.navigation.navigate('Map')}}
                    >
                        <Text style={styles.buttonText}> Return To Map </Text>
                    </TouchableOpacity>

            </View>
        );
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
        width: 170,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 25,
        marginBottom: 10,
        opacity: 0.8,
        top: 200
    },
    buttonText: {
        fontFamily: 'Baskerville',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputUser: {
        bottom: 150,
        paddingVertical: 15,
        maxWidth: 250,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        width: 250,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        opacity: 0.8,
    },
    inputPass: {
        bottom: 140,
        paddingVertical: 15,
        maxWidth: 250,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        width: 250,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        opacity: 0.8,
    },
    backgroundImage: {
        position: 'absolute',
        height: 1000,
        resizeMode: 'stretch',
        opacity: 1,
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
