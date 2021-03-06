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

export default function BattleScreen(props) {
    // REAL DATA PASSED FROM BattlePokeDex
    const opponent = props.navigation.state.params.opponent;
    const myInstructor = props.navigation.state.params.myInstructor;
    const allInstructors = props.navigation.state.params.allInstructors;
    const playerEmail = props.navigation.state.params.playerEmail;

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
        if (oppHealthState - damage < 0) {
            oppHealth = oppHealth - damage;
            setOppHealthState(0);
        } else {
            setOppHealthState(oppHealthState - damage);
        }
        setOppHealthState(oppHealthState - damage);
        if (oppHealthState <= 0) {
            setWinner('Winner');
            props.navigation.navigate('Winner', {
                playerEmail,
                myInstructor,
                allInstructors,
            });
        }
    };
    // CPU PLAYER -- runs every 1 second
    useInterval(() => {
        if (playerHealthState > 0 && oppHealthState > 0) {
            let clicksPerSecond = opponent.level + 3;
            let damage =
                (opponent.attack / myInstructor.defense) * clicksPerSecond;
            Vibration.vibrate();
            if (playerHealthState - damage < 0) {
                setPlayerHealthState(0);
            } else {
                setPlayerHealthState(playerHealthState - damage);
            }
        } else if (playerHealthState <= 0 && !winner) {
            setWinner('Loser');
            props.navigation.navigate('Loser', {
                playerEmail,
                myInstructor,
                allInstructors,
            });
        }
    }, 1000);

    return (
        <View style={styles.container}>
            {winner === null ? (
                <View style={styles.container}>
                    <Image
                        source={require('../imgs/battle.png')}
                        style={styles.backgroundImage}
                    />
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
                            <Text>TAP AS FAST AS YOU CAN </Text>
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
        top: 200,
        backgroundColor: 'powderblue',
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
        backgroundColor: '#ffcb05',
    },
    backgroundImage: {
        position: 'absolute',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'powderblue',
        top: 10,
        height: 200,
        width: 415,
        resizeMode: 'contain',
    },
});
