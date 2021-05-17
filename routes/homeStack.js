import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
// import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
// import screenName from 'path'
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Map from '../screens/Map';
import CaptureInt from '../screens/CaptureInt';
import loading from '../screens/loading';
import Pokedex from '../screens/Pokedex';
import AnimatedInstructors from '../screens/AnimatedInstructors';

const screens = {
  // name of screen: {
  //   screen: screenName }
  // AnimatedInstructors: {
  //   screen: AnimatedInstructors,
  // },
  Login: {
    screen: Login,
  },
  SignUp: {
    screen: SignUp,
  },
  // Pokedex: {
  //   screen: Pokedex
  // },
  Map: {
    screen: Map,
  },
  CaptureInt: {
    screen: CaptureInt,
  },
  Pokedex: {
    screen: Pokedex,
  },
};

const homeStack = createStackNavigator(screens);

export default createAppContainer(homeStack);

//import Navigator from 'routes/homeStack'
//^^^ use this in file u wana use navigation

//pass {navigation} where we usually pass props
//Props.navigation.navigate
//navigation.navigate('Name of screenName', {props})
