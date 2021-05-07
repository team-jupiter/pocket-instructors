
import React from 'react';
import { View, } from 'react-native';

import LottieView from 'lottie-react-native';

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
          console.log('Animation Finished!');
          // this.props.navigation.replace('Home');
        }}
      />
    </View>
  );
};

export default loading;
