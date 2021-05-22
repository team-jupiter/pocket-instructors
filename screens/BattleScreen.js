import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
} from 'react-native';
import useInterval from 'use-interval';
import HealthBar from './HealthBar';

// FUNCTIONS THAT UPDATE THE DATABASE TO NEW XP AN LEVEL
// wonBattle(email,singleInstructorInstance, allInstructors)
import { wonBattle, lostBattle } from '../firebase/battleFunc.js';

//DUMMY DATA
const opponentDummyData = {
    attack: 4,
    backImg:
        'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/michaelBack.gif?alt=media&token=0358d538-d6b0-48a1-9948-7d59645f6b59',
    defense: 16,
    frontImg:
        'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/mike.gif?alt=media&token=e4bff7f8-354d-4ac7-890d-c7214fd57f76',
    hp: 92,
    imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/golem.gif?alt=media&token=be246ae5-604f-49ad-b871-f0e4ae3db1c9',
    instructorDexID: '8',
    instructorName: 'Michael',
    latitude: 25.39782377817098,
    level: 1,
    longitude: 51.523379838926296,
    smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/michael-map.png?alt=media&token=0ca7066c-3277-4a72-b0f0-41d3ac136c5a',
    xp: 0,
};

// const myInstructorDummyData = {
//     attack: 14,
//     backImg:
//         'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chrisBack.gif?alt=media&token=8578b721-692e-4758-9f42-85c82a0aef2a',
//     defense: 8,
//     frontImg:
//         'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//     hp: 93,
//     imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//     instructorDexID: 5,
//     instructorName: 'Christopher G.M.',
//     latitude: 25.395988227854865,
//     level: 1,
//     longitude: 51.520464763095816,
//     smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/cgm.webp?alt=media&token=65c0f5f9-ac06-43af-9d14-5af9ea99487f',
//     xp: 90,
// };
// const allInstructorsDummyData = [
//     {
//         attack: 14,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chrisBack.gif?alt=media&token=8578b721-692e-4758-9f42-85c82a0aef2a',
//         defense: 8,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//         hp: 97,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//         instructorDexID: 5,
//         instructorName: 'Christopher G.M.',
//         latitude: 25.394824645792173,
//         level: 1,
//         longitude: 51.522245561258394,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/cgm.webp?alt=media&token=65c0f5f9-ac06-43af-9d14-5af9ea99487f',
//         xp: 90,
//     },
//     {
//         attack: 17,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/rickyBack.gif?alt=media&token=cddb8903-2953-446b-89ab-6e193f3bce2e',
//         defense: 1,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/ricky.gif?alt=media&token=04853dc8-eaee-4088-8a6e-b65a483681a9',
//         hp: 84,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/ricky.gif?alt=media&token=04853dc8-eaee-4088-8a6e-b65a483681a9',
//         instructorDexID: '9',
//         instructorName: 'Rick',
//         latitude: 25.397696049668355,
//         level: 1,
//         longitude: 51.522744492795,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/ricky-map.png?alt=media&token=a9d0c51d-0710-45d2-b024-fc28fabdd235',
//         xp: 0,
//     },
//     {
//         attack: 6,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/mayback.gif?alt=media&token=e15e8b9f-e5a0-4999-b154-1aa7de1d8521',
//         defense: 7,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/may.gif?alt=media&token=d18217ec-9d37-47df-9274-b2c64558851e',
//         hp: 99,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/may.gif?alt=media&token=d18217ec-9d37-47df-9274-b2c64558851e',
//         instructorDexID: 6,
//         instructorName: 'May',
//         latitude: 25.397954421921785,
//         level: 1,
//         longitude: 51.52302840541373,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/squirtle-may.png?alt=media&token=99e34db0-9a5e-4249-9c8e-31d9e40fe7ad',
//         xp: 0,
//     },
//     {
//         attack: 8,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissaBack.gif?alt=media&token=e8160fc5-aae4-4337-a4bc-eb333f5f3291',
//         defense: 7,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa.gif?alt=media&token=43585bcb-3793-40cd-9746-b6cc858f065f',
//         hp: 82,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa.gif?alt=media&token=43585bcb-3793-40cd-9746-b6cc858f065f',
//         instructorDexID: 7,
//         instructorName: 'Melissa',
//         latitude: 25.39543185851903,
//         level: 1,
//         longitude: 51.52037378668351,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa-meowth.webp?alt=media&token=d2385a3d-058c-42b5-ab80-f6275b85f288',
//         xp: 0,
//     },
//     {
//         attack: 10,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissaBack.gif?alt=media&token=e8160fc5-aae4-4337-a4bc-eb333f5f3291',
//         defense: 8,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa.gif?alt=media&token=43585bcb-3793-40cd-9746-b6cc858f065f',
//         hp: 90,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa.gif?alt=media&token=43585bcb-3793-40cd-9746-b6cc858f065f',
//         instructorDexID: 7,
//         instructorName: 'Melissa',
//         latitude: 25.397255878183234,
//         level: 1,
//         longitude: 51.520196202646304,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/melissa-meowth.webp?alt=media&token=d2385a3d-058c-42b5-ab80-f6275b85f288',
//         xp: 0,
//     },
//     {
//         attack: 14,
//         backImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chrisBack.gif?alt=media&token=8578b721-692e-4758-9f42-85c82a0aef2a',
//         defense: 8,
//         frontImg:
//             'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//         hp: 93,
//         imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/chris.gif?alt=media&token=5c0adb42-444a-4198-bf98-a19a8080420d',
//         instructorDexID: 5,
//         instructorName: 'Christopher G.M.',
//         latitude: 25.395988227854865,
//         level: 1,
//         longitude: 51.520464763095816,
//         smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/cgm.webp?alt=media&token=65c0f5f9-ac06-43af-9d14-5af9ea99487f',
//         xp: 90,
//     },
// ];
export default function BattleScreen(props) {
    // REAL DATA PASSED FROM BattlePokeDex
    const opponent = props.navigation.state.params.opponent;
    const myInstructor = props.navigation.state.params.myInstructor;
    const allInstructors = props.navigation.state.params.allInstructors;
    const playerEmail = props.navigation.state.params.playerEmail;

    // // DUMMY DATA STUFF TO BE REMOVED
    // const opponent = opponentDummyData;
    // const myInstructor = myInstructorDummyData;
    // const allInstructors = allInstructorsDummyData;
    // const playerEmail = 'Kavin@g.com';

    const [playerHealthState, setPlayerHealthState] = useState(myInstructor.hp);
    let playerHealth = myInstructor.hp;
    let oppHealth = opponent.hp;
    const [oppHealthState, setOppHealthState] = useState(opponent.hp);
    const [winner, setWinner] = useState(null);
    const opponentImage = opponent.frontImg;
    const myInstructorImage = myInstructor.backImg;

    // REAL LIFE PLAYER
    const tapToBattle = () => {
        // if nobody has won yet you can continue to play
        const damage = myInstructor.attack / opponent.defense;
        oppHealth = oppHealth - damage;
        setOppHealthState(oppHealthState - damage);
        console.log('OPP HEALTH --->>', oppHealthState);
        if (oppHealthState <= 0) {
            console.log('YOUUUU  WINNNN');
            setWinner('PLAYER');
            wonBattle(playerEmail, myInstructor, allInstructors);
        }
    };
    // CPU PLAYER -- runs every 1 second
    useInterval(() => {
        if (playerHealthState > 0 && oppHealthState > 0) {
            let clicksPerSecond = opponent.level + 3;
            let damage =
                (opponent.attack / myInstructor.defense) * clicksPerSecond;
            Vibration.vibrate();
            setPlayerHealthState(playerHealthState - damage);
        } else if (playerHealthState <= 0 && !winner) {
            setWinner('CPU');
            lostBattle(playerEmail, myInstructor, allInstructors);
        }
    }, 1000);

    return (
        <View style={styles.container}>
            {winner === null ? (
                <View style={styles.container}>
                    <Text style={styles.headerText}>battleGround</Text>
                    <View style={styles.battleGround}>
                        <View style={styles.opponent}>
                            <HealthBar
                                currentHealth={oppHealthState}
                                totalHealth={opponent.hp}
                                label={`Pkmn Name`}
                            />
                            {opponentImage ? (
                                <Animated.Image
                                    source={{
                                        uri: opponentImage,
                                    }}
                                    resizeMode={'contain'}
                                    style={{ width: 100, height: 100 }}
                                />
                            ) : (
                                <Text> Opponent is not loaded </Text>
                            )}
                        </View>

                        <View style={styles.currentPlayer}>
                            <HealthBar
                                currentHealth={playerHealthState}
                                totalHealth={myInstructor.hp}
                                label={`Pkmn Player`}
                            />
                            <Animated.Image
                                source={{ uri: myInstructorImage }}
                                resizeMode={'contain'}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={tapToBattle}
                            style={styles.roundButton1}
                        >
                            <Text>TapTapTap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text> {`${winner} WON!`}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        flex: 1,
    },
    image: {
        width: 150,
    },
    punch: {
        position: 'absolute',
        bottom: -40,
        left: 50,
    },
    battleGround: {
        flex: 8,
        padding: 12,
        flexDirection: 'column',
    },
    currentPlayer: {
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    opponent: {
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        marginTop: 50,
        marginBottom: 10,
        alignSelf: 'center',
    },
    roundButton1: {
        height: 150,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 20,
        backgroundColor: 'orange',
    },
});
