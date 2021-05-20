import React, { useState } from 'react';
import * as firebase from 'firebase';
import { useEffect } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Button,
} from 'react-native';
console.ignoredYellowBox = ['Warning:'];

export default function OtherPokedex(props) {
    const [ownedInstructors, setOwnedInstructors] = useState();
    const ref = firebase.firestore().collection('Trainer');
    const emailImport = props.navigation.state.params.emailImport;
    function getOneTrainerData() {
        ref.where('email', '==', emailImport).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setOwnedInstructors(items);
        });
    }
    const onPressToBattle = () => {
        let randomIdx = Math.floor(
            Math.random() * ownedInstructors[0].instructors.length
        );
        let randomInstructor = ownedInstructors[0].instructors[randomIdx];

        props.navigation.navigate('Pokedex', {
            randomInstructor,
            emailImport,
        });
    };

    const goBack = () => {
        props.navigation.pop();
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
                    <Text style={styles.title}> Their Owned Instructors </Text>
                    <Button
                        onPress={() => onPressToBattle()}
                        title="Battle!"
                        color="#f194ff"
                    />
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
