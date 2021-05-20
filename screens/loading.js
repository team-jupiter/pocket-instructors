import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Audio } from 'expo-av';

import LottieView from 'lottie-react-native';
console.ignoredYellowBox = ['Warning:'];

const loading = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#ffffff',
            }}
        >
            <LottieView
                source={require('../assets/trainer.json')}
                autoPlay
                loop={true}
                speed={1}
                onAnimationFinish={() => {
                    // console.log('Animation Finished!');
                    // this.props.navigation.replace('Home');
                }}
            />
        </View>
    );
};

export default loading;
