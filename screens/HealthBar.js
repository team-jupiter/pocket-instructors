import React, { useEffect, useState } from 'react';
import { View, Animated, Text } from 'react-native';

const available_width = 100;
export default function HealthBar(props) {
    const [currentHealth, setCurrentHealth] = useState(props.currentHealth);
    let currHealth = new Animated.Value(currentHealth);
    useEffect(() => {
        Animated.timing(currHealth, {
            duration: 1500,
            toValue: props.currentHealth,
        }).start();
    }, [currentHealth]);

    const getCurrentHealthStyles = () => {
        const animated_width = currHealth.interpolate({
            inputRange: [0, 250, 400],
            outputRange: [0, available_width / 2, available_width],
        });

        const color_animation = currHealth.interpolate({
            inputRange: [0, 250, 500],
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
        width: 100,
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
