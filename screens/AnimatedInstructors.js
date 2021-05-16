import React, { useState, useEffect } from 'react';
import { View, Image, Animated, Easing } from 'react-native';

export default function AnimatedInstructors(props) {
  let sprite_translateY = new Animated.Value(0);
  let sprite_scale = new Animated.Value(0);

  let pokemon_opacity = new Animated.Value(0);
  let punch_opacity = new Animated.Value(0);
  let punch_translateY = new Animated.Value(0);

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
  useEffect((prevProps, prevState) => {
    // if the pokemon gets damage or its health is changed is what this is saying
    if (
      prevProps.pokemon === props.pokemon &&
      prevProps.currentHealth !== props.currentHealth
    ) {
      animateDamagePokemon();
    }
  }, []);

  // upload the sprite front/ back/ create an orientation prop for the pokemon

  //this determines which direction the pokemon will be facing
  // where is orientation coming from?
  let sprite = orientation == 'front' ? spriteFront : spriteBack;

  pokemon_moveY = sprite_translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  pokemon_scale = sprite_scale.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  punch_opacity = punch_opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  punch_moveY = punch_translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

  pokemon_opacity = pokemon_opacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.2, 1],
  });

  return (
    <View>
      <Animated.Image
        source={sprite}
        resizeMode={'contain'}
        style={[
          styles.image,
          {
            transform: [
              {
                translateY: pokemon_moveY,
              },
              {
                scale: pokemon_scale,
              },
            ],
            opacity: pokemon_opacity,
          },
        ]}
      />

      <Animated.Image
        source={require('../imgs/fist.png')}
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
      />
    </View>
  );
}

const styles = {
  container: {
    paddingBottom: 20,
  },
  image: {
    width: 150,
  },
  punch: {
    position: 'absolute',
    bottom: -40,
    left: 50,
  },
};
