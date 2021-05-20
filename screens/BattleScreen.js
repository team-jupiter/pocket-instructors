import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import HealthBar from './HealthBar';

//fucntion that runs every 1

export default function BattleScreen(props) {
    const opponent = props.navigation.state.params.opponent;
    const myInstructor = props.navigation.state.params.myInstructor;
    // const [playerHealth, setPlayerHealth] = useState(myInstructor.hp);
    let playerHealth = myInstructor.hp;
    let oppHealth = opponent.hp;
    // const [oppHealth, setOppHealth] = useState(opponent.hp);
    let winner = null;
    const opponentImage = opponent.frontImg;
    // console.log('OPPONENT--->>>>>>', opponent);
    // console.log('MY INSTRUCTOR --->>>>', myInstructor);
    const myInstructorImage = myInstructor.backImg;

    // CPU PLAYER
    useEffect(() => {
        let clicksPerSecond = opponent.level + 3;
        const interval = setInterval(() => {
            let damage =
                (opponent.attack / myInstructor.defense) * clicksPerSecond;
            playerHealth -= damage;
            console.log('PLAYER HEALTH--->>>', playerHealth);
            if (playerHealth <= 0 || winner) {
                if (playerHealth <= 0) {
                    winner = 'CPU';
                    console.log('THE PLAYER HAS LOST');
                }
                clearInterval(interval);
            }
        }, 1000);
    }, []);

    // REAL LIFE PLAYER
    const tapToBattle = () => {
        // if nobody has won yet you can continue to play
        if (!winner) {
            const damage = myInstructor.attack / opponent.defense;
            oppHealth -= damage;
            console.log(oppHealth);
            if (oppHealth <= 0) {
                console.log('YOUUUU  WINNNN');
                winner = 'player';
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>battleGround</Text>
            <View style={styles.battleGround}>
                <View style={styles.opponent}>
                    <HealthBar
                        currentHealth={oppHealth}
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
                        currentHealth={playerHealth}
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
        borderRadius: 50,
        backgroundColor: 'orange',
    },
});
