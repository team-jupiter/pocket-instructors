import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Button,
} from 'react-native';
import * as firebase from 'firebase';
console.ignoredYellowBox = ['Warning:'];

export default function OtherPokedex(props) {
    const [ownedInstructors, setOwnedInstructors] = useState();
    const [searchField, setSearchField] = useState('');
    const ref = firebase.firestore().collection('Trainer');
    const emailImport = props.navigation.state.params.emailImport;
    const playerEmail = props.navigation.state.params.playerEmail;

    const getOneTrainerData = () => {
        ref.where('email', '==', emailImport).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setOwnedInstructors(items);
        });
    };

    const onPressToBattle = () => {
        let randomIdx = Math.floor(
            Math.random() * ownedInstructors[0].instructors.length
        );
        let randomInstructor = ownedInstructors[0].instructors[randomIdx];

        props.navigation.navigate('BattlePokeDex', {
            randomInstructor,
            playerEmail,
        });
    };

    useEffect(() => {
        getOneTrainerData();
    }, []);

    if (ownedInstructors !== undefined) {
        return (
            <View>
                <View style={styles.searchCont}>
                    <TextInput
                        style={styles.searchField}
                        placeholder="Search Instructors"
                        onChangeText={(value) => setSearchField(value)}
                        value={searchField}
                    />
                </View>
                <ScrollView>
                    <View style={styles.container}>
                        {ownedInstructors[0].instructors
                            .filter((instructor) =>
                                instructor.instructorName
                                    .toLowerCase()
                                    .includes(searchField.toLowerCase())
                            )
                            .map((instructor, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        key={index}
                                        style={styles.card}
                                        onPress={() =>
                                            props.navigation.navigate(
                                                'DexDetails',
                                                {
                                                    instructor:
                                                        instructor.instructorName,
                                                }
                                            )
                                        }
                                    >
                                        <Image
                                            style={{ width: 150, height: 150 }}
                                            source={{
                                                uri: instructor.imgUrl,
                                            }}
                                        />
                                        <Text>
                                            Instructor-Dex #:{' '}
                                            {instructor.instructorDexID}
                                        </Text>
                                        <Text>{instructor.instructorName}</Text>
                                        <Text>Lvl: {instructor.level}</Text>
                                        <Text>
                                            Hp: {Math.floor(instructor.hp)}
                                        </Text>
                                        <Text>
                                            Attack:{' '}
                                            {Math.floor(instructor.attack)}
                                        </Text>
                                        <Text>
                                            Defense:{' '}
                                            {Math.floor(instructor.defense)}
                                        </Text>
                                        <TouchableOpacity>
                                            <Button
                                                style={styles.cancelButton}
                                                onPress={() =>
                                                    onPressToBattle()
                                                }
                                                title="Battle"
                                            ></Button>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                </ScrollView>
            </View>
        );
    }
    return (
        <View>
            <Text> Loading ... </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 30,
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    searchCont: {
        position: 'absolute',
        marginBottom: 70,
        left: '20%',
        zIndex: 1,
        marginTop: 10,
    },
    searchField: {
        height: 40,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        width: 250,
        borderRadius: 50,
    },
});
