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

export default function BattleScreen(props) {
    const opponent = props.navigation.state.params.opponent;
    const myInstructor = props.navigation.state.params.myInstructor;
    // console.log('OPPONENT--->>>>>>', opponent);
    // console.log('MY INSTRUCTOR --->>>>', myInstructor);
    const something = '../imgs/instructors/katz-back.gif';
    const opponentImage = opponent.frontImg;
    console.log('OPONENT IMAGE', typeof opponentImage);
    const myInstructorImage = myInstructor.backImg;
    console.log('my IMAGE', typeof myInstructorImage);

    let sprite_translateY = new Animated.Value(0);
    let sprite_scale = new Animated.Value(0);

    let pokemon_opacity = new Animated.Value(0);
    let punch_opacity = new Animated.Value(0);
    let punch_translateY = new Animated.Value(0);

    const tapToBattle = () => {
        console.log('taptaptap');
    };

    const [oppHealth, setOppHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(100);
    const animateDamagePokemon = () => {
        punch_opacity.setValue(0);
        punch_translateY.setValue(0);
        pokemon_opacity.setValue(0);

        //this will determine the sequence of the attack animation
        Animated.sequence([
            Animated.timing(punch_opacity, {
                toValue: 1,
                duration: 10,
                easing: Easing.in,
            }),
            Animated.timing(punch_translateY, {
                toValue: 1,
                duration: 300,
                easing: Easing.in,
            }),
            Animated.timing(punch_opacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in,
            }),
            Animated.timing(pokemon_opacity, {
                toValue: 1,
                duration: 850,
                easing: Easing.in,
            }),
        ]).start();
    };
    // useEffect((prevProps, prevState) => {
    //   // if the pokemon gets damage or its health is changed is what this is saying
    //   if (
    //     prevProps.pokemon === props.pokemon &&
    //     prevProps.currentHealth !== props.currentHealth
    //   ) {
    //     animateDamagePokemon();
    //   }
    // }, []);

    // upload the sprite front/ back/ create an orientation prop for the pokemon

    //this determines which direction the pokemon will be facing
    // where is orientation coming from?

    //call pokemonId
    // get your back sprite, front sprite, make
    // from the opp screen on click pass the props,
    //choose random pokemon
    // choose your pokemon you want to fight with them
    // choose the opponent's pokemon at random, and select yours
    // let spriteBack = myInstructor.frontImg;
    // console.log('SPRITEBACK', spriteBack);
    // let spriteFront = opponent.backImg;
    // console.log('SPRITEFRONT', spriteFront);

    // let sprite = orientation == 'front' ? spriteFront : spriteBack;

    const pokemon_moveY = sprite_translateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000],
    });

    const pokemon_scale = sprite_scale.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const punchopacity = punch_opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const punch_moveY = punch_translateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -130],
    });

    const pokemonopacity = pokemon_opacity.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.2, 1],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>battleGround</Text>
            <View style={styles.battleGround}>
                <View style={styles.opponent}>
                    <HealthBar
                        currentHealth={oppHealth}
                        totalHealth={100}
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
                        totalHealth={100}
                        label={`Pkmn Player`}
                    />
                    <Animated.Image
                        source={{ uri: myInstructorImage }}
                        resizeMode={'contain'}
                        style={{ width: 100, height: 100 }}
                    />
                </View>
            </View>
            {/* <Animated.Image
                source={{ uri: opponent.imgUrl }}
                style={[
                    styles.punch,
                    {
                        transform: [
                            {
                                translateY: punch_moveY,
                            },
                        ],
                        opacity: punch_opacity,
                    },
                ]}
            /> */}
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
