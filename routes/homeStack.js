import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Map from '../screens/Map';
import CaptureInt from '../screens/CaptureInt';
import Pokedex from '../screens/Pokedex';
import OtherPokedex from '../screens/OtherPokedex';

const screens = {
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null,
        },
    },
    // Pokedex: {
    //   screen: Pokedex
    // },
    Map: {
        screen: Map,
        navigationOptions: {
            header: null,
        },
    },
    CaptureInt: {
        screen: CaptureInt,
        navigationOptions: {
            header: null,
        },
    },
    Pokedex: {
        screen: Pokedex,
    },
    OtherPokedex: {
        screen: OtherPokedex,
    },
};

const homeStack = createStackNavigator(screens);

export default createAppContainer(homeStack);
