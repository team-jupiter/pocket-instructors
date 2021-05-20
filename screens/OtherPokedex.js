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
console.ignoredYellowBox = ['Warning:'];

export default function OtherPokedex(props) {
    const [ownedInstructors, setOwnedInstructors] = useState();
    const ref = firebase.firestore().collection('Trainer');
    const emailImport = props.navigation.state.params.userEmail;
    // console.log('emailImport is ...', emailImport)

    function getOneTrainerData() {
        ref.where('email', '==', emailImport).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setOwnedInstructors(items);
        });
    }

    const goBack = () => {
        props.navigation.pop();
    };

    useEffect(() => {
        getOneTrainerData();
    }, []);

    if (ownedInstructors !== undefined) {
        console.log('ownedInstructors is ...', ownedInstructors);
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
                        onPress={() => props.navigation.navigate('Pokedex')}
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
                                    {/* <Text>MoveSet: {eachInstructor.moveSet}</Text> */}
                                    <Image
                                        source={{ uri: eachInstructor.imgUrl }}
                                        style={{ width: 300, height: 320 }}
                                        // source={{
                                        //   uri: eachInstructor.instructorUrl,
                                        // }}
                                    />
                                </View>
                            )
                        )}
                        {/* <Text> Hello, it's loaded </Text> */}
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
