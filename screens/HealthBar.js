import React, { useEffect, useState } from 'react';
import { View, Animated, Text } from 'react-native';

const available_width = 100;
export default function HealthBar(props) {
    let currentHealth = props.currentHealth;
    const totalHealth = props.totalHealth;
    let currHealthAnimation = new Animated.Value(currentHealth);
    useEffect(() => {
        Animated.timing(currHealthAnimation, {
            duration: 1500,
            toValue: props.currentHealth,
        }).start();
    }, [currentHealth]);

    const getCurrentHealthStyles = () => {
        const animated_width = currHealthAnimation.interpolate({
            inputRange: [0, totalHealth / 2, totalHealth],
            outputRange: [0, available_width / 2, available_width],
        });

        const color_animation = currHealthAnimation.interpolate({
            inputRange: [0, totalHealth / 2, totalHealth],
            outputRange: [
                'rgb(199, 45, 50)',
                'rgb(224, 150, 39)',
                'rgb(101, 203, 25)',
            ],
        });

        return {
            width: animated_width,
            height: 8, // height of the health bar
            backgroundColor: color_animation,
        };
    };

    const { label } = props;
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.rail}>
                    <Animated.View style={[getCurrentHealthStyles()]} />
                </View>
                <View style={styles.percent}>
                    <Text>
                        {parseInt((currentHealth / props.totalHealth) * 100)}%
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = {
    container: {
        height: 20,
        width: 130,
        marginBottom: 15,
        flexDirection: 'row',
    },
    label: {
        paddingBottom: 2,
        color: '#212121',
    },
    rail: {
        height: 10,
        width: 102.2,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#616161',
    },
    healthOK: {
        backgroundColor: '#5db56d',
    },
    healthWarning: {
        backgroundColor: '#fcc419',
    },
    healthCritical: {
        backgroundColor: '#fa5252',
    },
    percent: {
        paddingLeft: 3,
    },
    percentText: {
        fontSize: 10,
        color: '#212121',
    },
};
