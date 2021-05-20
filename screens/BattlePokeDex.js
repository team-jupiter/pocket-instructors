import React, { useState } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Button,
} from 'react-native';
import * as firebase from 'firebase';
import { useEffect } from 'react';

// const testEmail = 'b@b.com'

export default function BattlePokeDex(props) {
    const [ownedInstructors, setOwnedInstructors] = useState();
    const ref = firebase.firestore().collection('Trainer');
    const playerEmail = props.navigation.state.params.playerEmail;
    const battleData = props.navigation.state.params.randomInstructor;

    const getOneTrainerData = () => {
        ref.where('email', '==', playerEmail).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setOwnedInstructors(items);
        });
    };

    const goBack = () => {
        props.navigation.pop();
    };

    const onPressInstructor = (myInstructor) => {
        props.navigation.navigate('BattleScreen', {
            opponent: battleData,
            myInstructor: myInstructor,
        });
    };

    useEffect(() => {
        getOneTrainerData();
    }, []);

    if (ownedInstructors !== undefined) {
        return (
            <ScrollView>
                <View style={styles.masterContainer}>
                    <View style={[styles.overlay, styles.topOverlay]}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={goBack}
                        >
                            <Text style={styles.cancelText}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}> Owned Instructors </Text>
                    <View style={styles.container}>
                        {ownedInstructors[0].instructors.map(
                            (eachInstructor) => (
                                <View
                                    style={styles.eachPokemonContainer}
                                    key={eachInstructor.instructorDexID}
                                >
                                    <Text>
                                        Instructor:{' '}
                                        {eachInstructor.instructorName}{' '}
                                    </Text>
                                    <Text>
                                        Instructor Dex #:{' '}
                                        {eachInstructor.instructorDexID}{' '}
                                    </Text>
                                    <Text>HP: {eachInstructor.hp} </Text>
                                    <Text>Attack: {eachInstructor.attack}</Text>
                                    <Text>
                                        Defense: {eachInstructor.defense}
                                    </Text>
                                    <Text>Level: {eachInstructor.level}</Text>
                                    <Text>Xp: {eachInstructor.xp}</Text>
                                    <Image
                                        source={{ uri: eachInstructor.imgUrl }}
                                        style={{ width: 300, height: 320 }}
                                    />
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() =>
                                            onPressInstructor(eachInstructor)
                                        }
                                    >
                                        <Text>Pick This Instructor </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
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
        backgroundColor: '#9DFCE4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    eachPokemonContainer: {
        backgroundColor: '#FFF',
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
